import { useConfig } from "@/configContext/ConfigState";
import { encodeAudio } from "@/utils/encodeAudio";
import { Capacitor } from "@capacitor/core";
import type { Mp3Encoder } from "lamejs";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Options, RecordRTCPromisesHandler } from "recordrtc";

interface Props {
  apiKey: string;
  openAiOrg?: string;
  timeSlice: number;
  language: string;
  onStream: (stream: MediaStream) => void;
}

export const useWhisper = ({
  apiKey,
  timeSlice,
  language,
  onStream,
  openAiOrg,
}: Props) => {
  const { config } = useConfig();
  const recorder = useRef<RecordRTCPromisesHandler>();
  const workerRef = useRef<Worker>();
  const streamRef = useRef<MediaStream>();
  const encoder = useRef<Mp3Encoder>();
  const transcriptRef = useRef<string>("");
  const isIos = Capacitor.getPlatform() === "ios";

  const [lastTranscriptChunk, setLastTranscriptChunk] = useState({ text: "" });
  const [transcript, setTranscript] = useState({ text: "" });

  const stopRecording = useCallback(() => {
    if (recorder.current) {
      recorder.current.stopRecording();
      recorder.current = undefined;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = undefined;
    }
  }, [recorder, streamRef]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const transcribeWithWhisper = async (
    auth: { apiKey: string; organisation?: string },
    blob: Blob,
    language: string,
    initialPrompt?: string
  ) => {
    const formData = new FormData();
    formData.append("model", "whisper-1");
    formData.append("language", language);
    formData.append("response_format", "verbose_json");
    formData.append("file", blob, "recording.mp3");
    if (initialPrompt) formData.append("prompt", initialPrompt);

    console.log("→ SENDING AUDIO FOR TRANSCRIPTION", {
      language,
    });
    console.time("Whisper transcription request");

    const requestUrl = "https://api.openai.com/v1/audio/transcriptions";
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + auth.apiKey,
        ...(auth.organisation
          ? {}
          : { "OpenAI-Organization": auth.organisation }),
      },
      body: formData,
    };

    const response = await fetch(requestUrl, requestOptions);
    const responseData = await response.json();

    console.timeEnd("Whisper transcription request");
    console.log("← RECEIVED TRANSCRIPTION", { responseData });
    const transcription = responseData.text;
    return transcription;
  };

  useEffect(() => {
    console.warn("useEffect", {
      apiKey,
      configApiKey: config.main.openAiKey.value,
    });
    workerRef.current = new Worker(new URL("../worker.ts", import.meta.url));
    workerRef.current.onmessage = (event: MessageEvent<File>) => {
      transcribeWithWhisper(
        { apiKey, organisation: openAiOrg },
        event.data,
        language,
        transcriptRef.current
      ).then((transcription) => {
        transcriptRef.current += " " + transcription;
        setTranscript({ text: transcriptRef.current });
        setLastTranscriptChunk({ text: transcription });
        console.timeEnd("Generated a transcript chunk");
      });
      return () => {
        workerRef.current?.terminate();
      };
    };
  }, [language, apiKey, openAiOrg]);

  const startRecording = useCallback(() => {
    Promise.all([import("recordrtc"), import("lamejs")])
      .then(
        ([
          {
            default: { StereoAudioRecorder, RecordRTCPromisesHandler },
          },
          { Mp3Encoder },
        ]) => {
          if (!encoder.current) encoder.current = new Mp3Encoder(1, 44100, 96);

          const startStream = (stream: MediaStream) => {
            if (stream.getAudioTracks().length === 0) {
              console.error("No audio tracks found in the stream.");
              // You could also update the UI to inform the user here
              return;
            }
            console.log("whisper Stream:", stream);
            onStream(stream);

            streamRef.current = stream;
            const recorderConfig: Options = {
              mimeType: "audio/wav",
              numberOfAudioChannels: 1, // mono
              recorderType: StereoAudioRecorder,
              sampleRate: 44100, // Sample rate = 44.1khz
              timeSlice: timeSlice,
              type: "audio",
              ondataavailable: onDataAvailable,
            };
            recorder.current = new RecordRTCPromisesHandler(
              stream,
              recorderConfig
            );
            recorder.current.startRecording();

            function onDataAvailable(data: Blob) {
              console.time("Generated a transcript chunk");
              console.time("Whole flow");
              if (isIos) {
                console.log("→ TRANSCRIBING AUDIO WITH WHISPER iOS workaround");
                data.arrayBuffer().then((buffer) => {
                  const enc = encodeAudio(buffer);
                  transcribeWithWhisper(
                    { apiKey, organisation: openAiOrg },
                    enc,
                    language,
                    transcriptRef.current
                  ).then((transcription) => {
                    transcriptRef.current += " " + transcription;
                    setTranscript({ text: transcriptRef.current });
                    setLastTranscriptChunk({ text: transcription });
                    console.timeEnd("Generated a transcript chunk");
                  });
                });
              } else {
                console.log("→ TRANSCRIBING AUDIO WITH WHISPER Worker Path");
                data.arrayBuffer().then((buffer) => {
                  workerRef.current?.postMessage(buffer);
                });
              }
            }
          };

          if (config.main.audioInputSource.value === "INTERNAL_MICROPHONE") {
            navigator.mediaDevices
              .getUserMedia({ audio: true })
              .then(startStream);
          } else if (config.main.audioInputSource.value === "SYSTEM_AUDIO") {
            navigator.mediaDevices
              .getDisplayMedia({
                audio: {
                  echoCancellation: true,
                  noiseSuppression: true,
                  sampleRate: 44100,
                },
              })
              .then(startStream);
          }
        }
      )
      .catch((error) => {
        console.error(error);
      });
  }, [timeSlice, config.main.audioInputSource.value]);

  return {
    startWhisper: startRecording,
    stopWhisper: stopRecording,
    lastTranscriptChunk,
    transcript,
  };
};
