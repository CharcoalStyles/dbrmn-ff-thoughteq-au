import CloseIcon from "../../public/elephant/close-icon.svg";
import ArrowIcon from "../../public/elephant/arrow-icon.svg";
import Face from "../../public/elephant/face.svg";

import { useEffect, useRef, useState } from "react";
import { ElephantMessage } from "@/types";

const ElephantMessages = ({ messages }: { messages: ElephantMessage[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSliderRef = useRef<HTMLButtonElement>(null);
  const nextSliderRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft =
        scrollContainerRef.current.clientWidth * currentSlide;
    }
  }, [currentSlide]);

  return (
    <>
      {messages.length > 1 && (
        <div className="absolute inset-0 pointer-events-none">
          <button
            ref={prevSliderRef}
            role="button"
            onClick={() => setCurrentSlide(currentSlide - 1)}
            className={`absolute top-1/2 left-[3.7vw] items-center flex pointer-events-auto ${
              currentSlide === 0 ? "opacity-50" : ""
            }`}
            aria-label="prev"
            disabled={currentSlide === 0}
          >
            <img className="w-[2vw]  rotate-180" src={ArrowIcon.src} />
          </button>
          <button
            ref={nextSliderRef}
            role="button"
            onClick={() => setCurrentSlide(currentSlide + 1)}
            className={`absolute top-1/2 right-[3.7vw] items-center flex pointer-events-auto ${
              currentSlide === messages.length - 1 ? "opacity-50" : ""
            }`}
            aria-label="next"
            disabled={currentSlide === messages.length - 1}
          >
            <img className="w-[2vw]" src={ArrowIcon.src} />
          </button>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        className={
          "text-white h-full text-center overflow-scroll flex  hide-scrollbars scroll-smooth"
        }
      >
        {messages.map((message, index) => (
          <div
            key={message.text + "_" + index}
            className="flex flex-col items-center justify-center flex-shrink-0 w-full h-full"
          >
            <div className="text-[2vw]">
              Elephant {index + 1} of {messages.length}
            </div>
            <div className="mx-[10%] text-[5.2vw] leading-100">
              {message.text}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ElephantMessages;
