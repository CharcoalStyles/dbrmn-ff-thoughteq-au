import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

let registeredId: string | null = null;

export const useAudioAnalyser = ({
  canvasRef,
  callerId,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  callerId: string;
}) => {
  if (registeredId && registeredId !== callerId) {
    throw new Error(
      `useAudioAnalyser has already been instantiated with ID ${registeredId}. Cannot instantiate with another ID ${callerId}.`
    );
  }

  registeredId = callerId;

  // Cleanup logic in a useEffect hook to allow reusing the hook after the component unmounts
  useEffect(() => {
    return () => {
      if (registeredId === callerId) {
        registeredId = null;
      }
    };
  }, [callerId]);

  const audioCtx = useRef<AudioContext>();
  const analyser = useRef<AnalyserNode>();
  const source = useRef<MediaStreamAudioSourceNode>();
  const dataArray = useRef<Uint8Array>();
  const rafRef = useRef<number>();
  const pathRef = useRef<Path2D>();
  const isAnimating = useRef(false);
  const streamRef = useRef<MediaStream>();

  const [isRunning, setIsRunning] = useState(false);

  const clearCanvas = useCallback(() => {
    const canvasCtx = canvasRef.current?.getContext("2d");
    if (!canvasCtx || !canvasRef.current) return;

    canvasCtx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  }, [canvasRef]);

  const drawWave = useCallback(() => {
    const canvasCtx = canvasRef.current?.getContext("2d");

    if (
      !analyser.current ||
      !dataArray.current ||
      !canvasCtx ||
      !canvasRef.current
    ) {
      console.log(
        "drawWave: missing refs",
        !!analyser.current,
        !!canvasCtx,
        !!canvasRef.current
      );
      return;
    }

    // Make a copy of dataArray before modifying it

    // clear the canvas and path
    clearCanvas();
    pathRef.current = new Path2D();

    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = "#6B4FFD";

    const sliceWidth =
      (canvasRef.current.width * 1.0) / dataArray.current.length;
    let x = 0;

    for (let i = 0; i < dataArray.current.length; i++) {
      const v = dataArray.current[i] / 128.0; // byte / 128 = normalize to [0,1]
      const y = (v * canvasRef.current.height) / 2; // y value for the current point

      if (i === 0) {
        pathRef.current.moveTo(x, y);
      } else {
        pathRef.current.lineTo(x, y);
      }

      x += sliceWidth;
    }
    pathRef.current.lineTo(
      canvasRef.current.width,
      canvasRef.current.height / 2
    );
    canvasCtx.stroke(pathRef.current);
  }, [canvasRef, clearCanvas]);

  useEffect(() => {
    console.log("AUDIO CTX STATE", audioCtx.current?.state);
  }, [audioCtx.current?.state]);

  const start = () => {
    if (!streamRef.current) {
      console.log("No stream found");
      return;
    }

    // create/resume audio ctx if needed
    if (!audioCtx.current || audioCtx.current.state === "closed") {
      audioCtx.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    if (audioCtx.current?.state !== "running") {
      audioCtx.current.resume().then(() => {
        streamRef.current && onStream(streamRef.current);
      });
      return;
    }

    // Create the Analyser
    analyser.current = audioCtx.current.createAnalyser();
    // Connect a media stream source to connect to the analyser
    source.current = audioCtx.current.createMediaStreamSource(
      streamRef.current
    );
    // Create a Uint8Array based on the frequencyBinCount(fftSize / 2)
    dataArray.current = new Uint8Array(analyser.current.frequencyBinCount);
    // Connect the analyser
    source.current.connect(analyser.current);

    const loop = () => {
      if (!analyser.current || !dataArray.current) return;
      // analyser.current.getByteFrequencyData(dataArray.current);
      analyser.current.getByteTimeDomainData(dataArray.current);
      rafRef.current = requestAnimationFrame(loop);
      drawWave();
    };
    // Initiate reporting
    loop();
  };

  const onStream = (stream: MediaStream) => {
    streamRef.current = stream;
    start();
  };

  const stop = () => {
    if (audioCtx.current?.state === "running") {
      audioCtx.current.suspend();
    }

    isAnimating.current = false;
    setIsRunning(false);

    // Cancel any existing animation frame
    if (rafRef.current !== undefined) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }

    // Reset analyser and dataArray
    analyser.current = undefined;
    dataArray.current = undefined;

    clearCanvas();
  };

  const close = () => {
    source.current?.disconnect();
    if (audioCtx.current && audioCtx.current.state !== "closed")
      audioCtx.current.close();
  };

  useEffect(() => {
    if (!window.AudioContext && !window.webkitAudioContext) {
      throw new Error("Web Audio API not supported in this browser");
    }

    return () => {
      stop();
      close();
    };
  }, []);

  return {
    startAnalyser: start,
    stopAnalyser: stop,
    isAnalysing: isRunning,
    analyseStream: onStream,
    clearCanvas,
  };
};
