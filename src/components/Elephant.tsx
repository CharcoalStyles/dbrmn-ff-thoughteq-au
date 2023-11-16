import React, { useRef } from "react";
import { useState, useEffect } from "react";

// Import SVGs
import OpenEyes from "@/components/elephant/open-eyes";
import ClosedEyes from "@/components/elephant/closed-eyes";

import Honk from "@/components/elephant/honk";
import Silent from "@/components/elephant/silent";
import ElephantMessages from "./ElephantMessages";
import ElephantDialog from "./ElephantDialog";
import { ElephantMessage } from "@/types";

export type Mood = "waiting" | "listening" | "honking";

type Moods = {
  [mood in Mood]: BodyParts;
};

interface BodyParts {
  eyes: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  body: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

const moods: Moods = {
  waiting: { eyes: ClosedEyes, body: Silent },
  listening: { eyes: OpenEyes, body: Silent },
  honking: { eyes: OpenEyes, body: Honk },
};

const Elephant = ({
  mood,
  messages,
  onClick,
  disabled,
}: {
  mood: Mood;
  messages: ElephantMessage[];
  onClick: () => void;
  disabled: boolean;
}) => {
  const [eyes, setEyes] = useState(moods[mood].eyes({}));
  const [body, setBody] = useState(moods[mood].body({}));
  const [messagesOpen, setMessagesOpen] = useState(false);

  console.log({eyes, body})

  const controllerRef = useRef<HTMLDivElement>(null);
  const blinkInterval = useRef<ReturnType<typeof setInterval>>();
  const blinkTimeout = useRef<ReturnType<typeof setTimeout>>();

  let audio: HTMLAudioElement;

  function startBlink() {
    blinkInterval.current = setInterval(() => {
      setEyes(ClosedEyes({}));

      blinkTimeout.current = setTimeout(() => {
        setEyes(OpenEyes({}));
      }, 100);
    }, 3000);
  }

  function stopBlink() {
    clearInterval(blinkInterval.current);
    clearTimeout(blinkTimeout.current);
  }

  function honk() {
    const prevEyes = eyes;
    const prevBody = body;
    setEyes(moods["honking"].eyes({}));
    setBody(moods["honking"].body({}));

    if (!audio) {
      audio = new Audio("/elephant/honk1.mp3");
    }
    audio.play();
    controllerRef.current?.classList.add("scale-150");

    setTimeout(() => {
      controllerRef.current?.classList.remove("scale-150");
      setEyes(prevEyes);
      setBody(prevBody);
    }, 1000);
  }

  useEffect(() => {
    startBlink();
    audio = new Audio("/elephant/honk1.mp3");

    return () => {
      stopBlink();
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      honk();
    }
  }, [messages]);

  useEffect(() => {
    setEyes(moods[mood].eyes({}));
    setBody(moods[mood].body({}));

    switch (mood) {
      case "waiting":
        stopBlink();
        break;
      case "listening":
        startBlink();
        break;
      case "honking":
        if (!audio) {
          audio = new Audio("/elephant/honk1.mp3");
        }
        audio.play();
        break;
    }
  }, [mood]);

  return (
    <>
      <div
        ref={controllerRef}
        className="relative transition-transform duration-150 ease-out w-fit"
      >
        <button onClick={onClick} disabled={disabled}>
          <div className="">
            {body}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[100%] w-[22%]">
            {eyes}
          </div>
        </button>

        {messages.length > 0 && (
          <button
            className={`absolute w-[4.6vw] aspect-square top-0 right-0 text-[3vw] bg-red-600 text-white rounded-full`}
            onClick={() => setMessagesOpen(true)}
          >
            {messages.length}
          </button>
        )}
      </div>

      {messagesOpen && (
        <ElephantDialog onClose={() => setMessagesOpen(false)}>
          <ElephantMessages messages={messages} />
        </ElephantDialog>
      )}
    </>
  );
};

export default Elephant;
