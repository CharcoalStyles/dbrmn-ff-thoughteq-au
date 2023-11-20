import React, { FC, use, useEffect, useRef, useState } from "react";
import { WhisperSegment } from "@/hooks/use-whisper";

interface Props {
  fullTranscript: Array<WhisperSegment>;
}

const TranscriptDialog: FC<Props> = ({ fullTranscript }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [augmentedTranscript, setAugmentedTranscript] = useState<
    Array<{
      time: string;
      text: string;
    }>
  >([]);

  useEffect(() => {
    if (fullTranscript.length > 0) {
      let lastEnd = 0;
      let accumulativeEnd = 0;
      setAugmentedTranscript(
        fullTranscript.map(({ text, start, end }, i) => {
          if (start === 0) {
            if (i > 0) {
              accumulativeEnd += lastEnd;
            }
          }
          const currentStart = start + accumulativeEnd;
          //convert currentStart to minutes and seconds
          const minutes = Math.floor(currentStart / 60);
          const seconds = Math.floor(currentStart % 60);
          const time = `${minutes}:${`${seconds}`.padStart(2, "0")}`;

          lastEnd = end;
          return {
            time: time,
            text,
          };
        })
      );
    }
  }, [fullTranscript]);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      dialogRef.current.classList.add("flex", "flex-col");
    }
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.classList.remove("flex", "flex-col");
      dialogRef.current.close();
    }
  };

  return (
    <>
      {augmentedTranscript.length > 0 && (
        <button
          onClick={openDialog}
          className="absolute px-2 z-90 bg-white rounded-full left-1/2 bottom-8"
        >
          <p>Transcript</p>
        </button>
      )}
      <dialog ref={dialogRef} onClose={closeDialog}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-1/2 h-full overflow-y-auto rounded-lg shadow-lg flex flex-col">
            <div className="bg-pink p-4 text-black font-bold rounded-t-lg">
              <h3 className="text-lg font-bold">Transcript</h3>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              {augmentedTranscript.map(({ text, time }) => {
                return (
                  <p>
                    <span className="pr-2 font-bold">{time}</span>
                    {text}
                  </p>
                );
              })}
            </div>
            <div className="bg-gray-100 p-4 rounded-b-lg">
              <button
                onClick={closeDialog}
                className="px-4 py-2 font-bold text-white bg-black bg-gray-500 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default TranscriptDialog;
