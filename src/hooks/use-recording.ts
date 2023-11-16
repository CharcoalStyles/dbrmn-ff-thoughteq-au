import { useConfig } from "@/configContext/ConfigState";
import { useCallback, useEffect, useState } from "react";

export const useRecording = ({
  onStart,
  onStop,
  onReset,
}: {
  onStart: ({
    recordingInBackground,
  }: {
    recordingInBackground: boolean;
  }) => void;
  onStop: () => void;
  onReset: () => void;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [recordStartTime, setRecordStartTime] = useState<number>();
  const [isInBackground, setIsInBackground] = useState(false);
  const [backgroundStartTime, setBackgroundStartTime] = useState<number>();

  const { config } = useConfig();

  const _onStart = useCallback(() => {
    onStart({ recordingInBackground: isInBackground });
  }, [isInBackground]);

  function handleBlur() {
    setIsInBackground(true);
    setBackgroundStartTime(Date.now());
    console.log("Window inactive");
  }

  function handleFocus() {
    setIsInBackground(false);
    setBackgroundStartTime(undefined);
    console.log("Window active");
  }

  function start() {
    reset();
    setHasRecording(true);
    setIsRecording(true);
    // so, if you hit pause, and then restart, it will start from zero.
    // ideally, it should allow pause and resume, but keep the time to the time it's been recording..
    const now = Date.now();
    setRecordStartTime(now);
    console.log("Record start time", now);
    // onStart({ recordingInBackground: isInBackground });
    _onStart();
  }

  const stop = useCallback(() => {
    setIsRecording(false);
    onStop();
  }, [onStop]);

  function reset() {
    const now = new Date().getTime();

    onReset();
  }

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    if (isRecording) {
      intervalId = setInterval(() => {
        // get difference between rec start and now, in ms.
        const now = Date.now();
        const diff: number = now - (recordStartTime ?? 0);

        // TODO: do we need both recordStartTime and recordDuration?
        setRecordingDuration(diff);
        const maxDuration = parseInt(config.main.maxRecordingDuration.value);

        // maxDuration is defined in seconds.
        if (diff >= maxDuration * 1000) {
          console.log("Max recording time reached:", maxDuration);
          stop();
        }

        const inactiveLimitExceeded =
          isInBackground &&
          backgroundStartTime &&
          now >
            backgroundStartTime +
              parseInt(config.main.inactiveTimeout.value) * 1000;

        if (inactiveLimitExceeded) {
          console.log("Window inactive for too long, stopping recording");
          stop();
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [
    isRecording,
    config.main.maxRecordingDuration.value,
    config.main.inactiveTimeout.value,
    recordStartTime,
    isInBackground,
    backgroundStartTime,
    stop,
  ]);

  useEffect(() => {
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return {
    isRecording,
    hasRecording,
    recordingDuration,
    startRecording: start,
    stopRecording: stop,
    recordingInBackground: isInBackground,
  };
};
