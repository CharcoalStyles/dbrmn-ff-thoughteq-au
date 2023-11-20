import Head from "next/head";
import { useState, useEffect, useRef, MutableRefObject } from "react";
import {
  AnalysisType,
  CharacterCommentResponse,
  CharacterType,
  ChatGPTResponse,
  ElephantMessage,
  ElephantResponse,
  ImageBoardItem,
  ImageResponse,
  PostItBoardItem,
  PostItItemData,
  PromptCadence,
  ThemeResponse,
  ThemeType,
} from "@/types";

import { useWhisper } from "@/hooks/use-whisper";
import Elephant from "@/components/Elephant";
import ConfigurationDialog from "@/components/ConfigurationDialog";
import TempImageLoader from "@/components/TempImageLoader";
import ReactionsBoard from "@/components/ReactionsBoard";

import { usePosition } from "@/hooks/use-position";
import { useChatGPT } from "@/hooks/use-chatGPT";
import AboutButton from "@/components/AboutButton";
import { useRecording } from "@/hooks/use-recording";
import { useConfig } from "@/configContext/ConfigState";
import { formatMultipleConfigValue } from "@/configContext/configUtils";
import { TextWithLineBreaks } from "@/components/TextWithLineBreaks";
import { fitText } from "@/utils/fitText";
import { useAudioAnalyser } from "@/hooks/use-audio-analyser";
import TranscriptDialog from "@/components/TranscriptDialog";

export default function Home() {
  const [elephantMessages, setElephantMessages] = useState<ElephantMessage[]>(
    []
  );

  const [characterComments, setCharacterComments] = useState<PostItBoardItem[]>(
    []
  );
  const [postIts, setPostIts] = useState<PostItBoardItem[]>([]);
  const [images, setImages] = useState<ImageBoardItem[]>([]);

  const [isDragging, setIsDragging] = useState(false);

  const zIndexRef = useRef(0);
  const boardTitleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { config } = useConfig();
  const { getNextPosition } = usePosition({
    allowCentered: config.elephant.showElephantImage.value === "false",
  });
  const { sendUserMessage } = useChatGPT();

  const {
    startAnalyser,
    stopAnalyser,
    analyseStream,
    clearCanvas,
    isAnalysing,
  } = useAudioAnalyser({
    canvasRef,
    callerId: "index-page",
  });

  const org = config.main.openAiOrganisation.value;
  const {
    transcript,
    lastTranscriptChunk,
    startWhisper,
    stopWhisper,
    fullTranscript,
  } = useWhisper({
    apiKey: config.main.openAiKey.value,
    timeSlice: 1000 * parseInt(config.main.timeSlice.value),
    language: config.main.language.value,
    onStream: analyseStream,
    openAiOrg: org.trim() === "" ? undefined : org,
  });

  const {
    isRecording,
    hasRecording,
    recordingDuration,
    startRecording,
    stopRecording,
    recordingInBackground,
  } = useRecording({
    onStart: () => {
      startWhisper();
    },
    onStop: () => {
      stopWhisper();
      stopAnalyser();
      clearCanvas();
    },
    onReset: () => {
      lastThemeRequestWordCount.current = 0;
      lastImageRequestWordCount.current = 0;
      lastElephantRequestWordCount.current = 0;
    },
  });

  const elephantContainerRef = useRef<HTMLDivElement>(null);
  const pendingResponse = useRef(false);

  const lastCharacterCommentRequestWordCount = useRef<number>(0);
  const lastThemeRequestWordCount = useRef<number>(0);
  const lastImageRequestWordCount = useRef<number>(0);
  const lastElephantRequestWordCount = useRef<number>(0);

  const characterCommentRequestCadence = useRef<PromptCadence>({
    interval: parseInt(config.characterComment.promptInterval.value),
    startTriggers: config.characterComment.startTriggers.value.includes(",")
      ? config.characterComment.startTriggers.value
          .split(",")
          .map((s) => parseInt(s.trim()))
      : [],
  });

  const themeRequestCadence = useRef<PromptCadence>({
    interval: parseInt(config.theme.promptInterval.value),
    startTriggers: config.theme.startTriggers.value.includes(",")
      ? config.theme.startTriggers.value
          .split(",")
          .map((s) => parseInt(s.trim()))
      : [],
  });

  const imageRequestCadence = useRef<PromptCadence>({
    interval: parseInt(config.image.promptInterval.value),
    startTriggers: config.image.startTriggers.value.includes(",")
      ? config.image.startTriggers.value
          .split(",")
          .map((s) => parseInt(s.trim()))
      : [],
  });
  const elephantRequestCadence = useRef<PromptCadence>({
    interval: parseInt(config.elephant.promptInterval.value),
    startTriggers: [],
  });

  function clearItems() {
    setCharacterComments([]);
    setPostIts([]);
    setImages([]);
    setElephantMessages([]);
  }

  function addPostIt(data: PostItItemData) {
    zIndexRef.current++;

    setPostIts((old) => [
      ...old,
      {
        ...data,
        itemIndex: zIndexRef.current,
        pos: getNextPosition(),
      },
    ]);
  }

  function addImage(src: string, hashtag: string) {
    zIndexRef.current;

    setImages((old) => [
      ...old,
      { src, hashtag, pos: getNextPosition(), itemIndex: zIndexRef.current },
    ]);
  }

  const sendPrompt = async (
    type: AnalysisType,
    onResponse: (res: ChatGPTResponse[]) => {}
  ) => {
    pendingResponse.current = true;
    let wordCount;
    wordCount =
      parseInt(config[type]?.getLastXWordsFromTranscript.value) ??
      (type === AnalysisType.Elephant ? 1000 : 200);

    const lastTranscript = transcript.text
      .split(" ")
      .splice(-wordCount)
      .join(" ");
    sendUserMessage(type, lastTranscript).then((res) => {
      console.log("sendUserMessage res: ", res);
      pendingResponse.current = false;
      if (res) onResponse(res);
    });
  };

  const handleCharacterCommentResponse = async (
    res: CharacterCommentResponse[]
  ) => {
    try {
      if (!res.length) return;

      addPostIt({
        text: res[0].text,
        emojis: res[0].emojis,
        postitType: "CharacterComment",
        contentType: res[0].type,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleThemeResponse = async (res: ThemeResponse[]) => {
    try {
      if (!res.length) return;
      if (res[0].isValid)
        addPostIt({
          text: res[0].text,
          emojis: res[0].emojis,
          postitType: "Theme",
          contentType: res[0].type as ThemeType,
        });
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageResponse = async (res: ImageResponse[]) => {
    try {
      if (!res.length) return;
      pendingResponse.current = false;
      addImage(res[0].file, res[0].hashtag);
    } catch (e) {
      console.error(e);
    }
  };

  const handleElephantResponse = async (res: ElephantResponse[]) => {
    try {
      pendingResponse.current = false;
      if (!res.length) return;
      setElephantMessages((old) => [...old, { ...res[0] }]);

      if (elephantContainerRef.current) {
        elephantContainerRef.current.style.zIndex = (
          zIndexRef.current + 1
        ).toString();
      }

      if (config.elephant.showPostits.value === "true") {
        const _ = res as ElephantResponse[];
        addPostIt({
          text: res[0].text,
          postitType: "Elephant",
          contentType: res[0].type ?? "",
          elephantLevel: res[0].elephantLevel,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragStart = (node: HTMLElement) => {
    setIsDragging(true);
    node.style.zIndex = zIndexRef.current.toString();
    zIndexRef.current += 1;
    if (elephantContainerRef.current) {
      elephantContainerRef.current.style.zIndex = (
        zIndexRef.current + 1
      ).toString();
    }
  };

  function handlePromptCadence(
    type: AnalysisType,
    cadenceRef: MutableRefObject<PromptCadence>,
    wordCount: number,
    lastRequestCount: MutableRefObject<number>,
    onResponse: (res: ChatGPTResponse[]) => {}
  ) {
    console.log("lastRequestCount", lastRequestCount);
    const wordsSinceLastRequest = wordCount - lastRequestCount.current;
    const cadence = cadenceRef.current;
    // Check start triggers before interval
    const startTrigger = cadence.startTriggers[0];
    if (startTrigger && wordsSinceLastRequest >= startTrigger) {
      console.log(type, "Start trigger triggered!");
      cadence.startTriggers.shift();
      sendPrompt(type, onResponse);
      cadenceRef.current = cadence;
    } else if (wordsSinceLastRequest > cadence.interval) {
      console.log(type, "Interval triggered!");
      sendPrompt(type, onResponse);
      lastRequestCount.current = wordCount;
    } else {
      console.log("Latest word chunk too small for", type);
    }
  }

  useEffect(() => {
    // fetching the config here, as it's a bit tricky with loading from local storage
    // and it's only used once, so we can load it here :)))
    // no need for a state, really
    themeRequestCadence.current = {
      interval: parseInt(config.theme.promptInterval.value),
      startTriggers: formatMultipleConfigValue(
        config.theme.startTriggers.value
      ),
    };

    imageRequestCadence.current = {
      interval: parseInt(config.image.promptInterval.value),
      startTriggers: formatMultipleConfigValue(
        config.image.startTriggers.value
      ),
    };
    elephantRequestCadence.current = {
      interval: parseInt(config.elephant.promptInterval.value),
      startTriggers: [],
    };
  }, [config]);

  useEffect(() => {
    if (!lastTranscriptChunk.text) return;

    const wordCount = transcript.text.trim().split(" ").length;
    console.log("Transcript chunk:", {
      wordCount: lastTranscriptChunk.text.trim().split(" ").length,
      chunk: lastTranscriptChunk.text,
    });
    console.log("Full transcript:", { wordCount, transcript: transcript.text });

    // handle active types only
    if (config.characterComment.active.value === "true") {
      handlePromptCadence(
        AnalysisType.CharacterComment,
        characterCommentRequestCadence,
        wordCount,
        lastCharacterCommentRequestWordCount,
        (res: ChatGPTResponse[]) =>
          handleCharacterCommentResponse(res as CharacterCommentResponse[])
      );
    }

    // handle active types only
    if (config.theme.active.value === "true") {
      handlePromptCadence(
        AnalysisType.Theme,
        themeRequestCadence,
        wordCount,
        lastThemeRequestWordCount,
        (res: ChatGPTResponse[]) => handleThemeResponse(res as ThemeResponse[])
      );
    }

    if (config.image.active.value === "true") {
      handlePromptCadence(
        AnalysisType.ImageAndHashtags,
        imageRequestCadence,
        wordCount,
        lastImageRequestWordCount,
        (res: ChatGPTResponse[]) => handleImageResponse(res as ImageResponse[])
      );
    }

    if (config.elephant.active.value === "true") {
      handlePromptCadence(
        AnalysisType.Elephant,
        elephantRequestCadence,
        wordCount,
        lastElephantRequestWordCount,
        (res: ChatGPTResponse[]) =>
          handleElephantResponse(res as ElephantResponse[])
      );
    }
  }, [lastTranscriptChunk]);

  const fitBoardTitle = () =>
    boardTitleRef.current &&
    fitText({ textElement: boardTitleRef.current, max: 500, axis: "both" });

  useEffect(() => {
    fitBoardTitle();
  }, [config.main.boardTitle.value]);

  useEffect(() => {
    window.addEventListener("resize", fitBoardTitle);
    return () => {
      window.removeEventListener("resize", fitBoardTitle);
      stopRecording();
    };
  }, []);

  useEffect(() => {
    if (recordingInBackground) {
      stopAnalyser();
      clearCanvas();
    } else if (isRecording) {
      startAnalyser();
    }
  }, [recordingInBackground]);

  // refactor to separate method plz
  const hours = Math.floor(recordingDuration / 3_600_000);
  const minutes = Math.floor((recordingDuration % 3_600_000) / 60_000);
  const seconds = Math.floor((recordingDuration % 60_000) / 1000); // ms

  return (
    <>
      <Head>
        <title>AI-Bert</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`relative transition-[background-color] flex flex-col items-center justify-center h-screen overflow-hidden ${
          isDragging ? "select-none" : "select-auto"
        } ${recordingInBackground ? "bg-pink-muted" : "bg-pink"}`}
      >
        {config.main.boardTitle.value && (
          <div className="absolute flex w-screen h-screen">
            <h1
              ref={boardTitleRef}
              className="text-[16vw] leading-[0.9] tracking-tight text-elephant px-10 py-4"
            >
              <TextWithLineBreaks text={config.main.boardTitle.value} />
            </h1>
          </div>
        )}

        <ConfigurationDialog />
        <TranscriptDialog fullTranscript={fullTranscript} />

        <ReactionsBoard
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          handleDragStart={handleDragStart}
          characterComments={characterComments}
          postIts={postIts}
          images={images}
        />

        {config.elephant.showElephantImage.value === "true" && (
          <>
            <div
              ref={elephantContainerRef}
              className={`max-w-[23.5%] ${
                isDragging ? "pointer-events-none" : "pointer-events-auto"
              }`}
            >
              <Elephant
                onClick={startRecording}
                disabled={isRecording}
                mood={!isRecording ? "waiting" : "listening"}
                messages={elephantMessages}
              />
            </div>
            <h2 className="text-2xl -mt-[1.2vw] relative z-10">
              {!isRecording
                ? "Please press me to start ..."
                : "Keep talking..."}
            </h2>
          </>
        )}

        <TempImageLoader />

        <AboutButton />

        <div className="absolute bottom-8 right-0 flex items-end gap-4">
          <div className="">
            <canvas ref={canvasRef} width="300" height="40"></canvas>
          </div>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex gap-1 justify-center items-center overflow-hidden bg-white h-6 rounded-full transition-[width] duration-300 w-fit px-6 mr-2 my-2`}
          >
            <p>
              {isRecording ? "Press to stop" : "Press to start"}
              <span className="">{isRecording ? "◼" : ""}</span>
            </p>
            {(isRecording || hasRecording) && (
              <p className="text-xs italic text-black">
                ({isRecording ? "is Listening" : "not Listening"})
              </p>
            )}
            <p>
              {hours}:{minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
            </p>
          </button>
        </div>
      </main>
    </>
  );
}
