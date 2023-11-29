import { PostItBoardItem } from "@/types";
import { fitText } from "@/utils/fitText";
import { FC, createRef, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";

interface PostItProps {
  handleDragStart: (node: HTMLElement) => void;
  setIsDragging: (isDragging: boolean) => void;
  postIt: PostItBoardItem;
  more?: string;
  noDrag?: boolean;
  noPosition?: boolean;
}

const PostIt: FC<PostItProps> = ({
  handleDragStart,
  setIsDragging,
  postIt,
  more,
  noDrag,
  noPosition,
}) => {
  const ref = createRef<HTMLDivElement>();

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [bg, setBg] = useState<string>("");
  const [color, setColor] = useState<string>("");

  const colors = ["bg-yellow", "bg-white", "bg-green"];

  const resizeText = () =>
    textRef.current && fitText({ textElement: textRef.current });

  useEffect(() => {
    let bg = "";
    if (postIt.postitType === "Elephant") {
      switch (postIt.elephantLevel) {
        case "low": {
          bg = "bg-elephant-low";
          break;
        }
        case "high": {
          bg = "bg-elephant-high";
          break;
        }
        default: {
          bg = "bg-elephant";
        }
      }
    } else {
      bg = colors[Math.floor(Math.random() * colors.length)];
    }
    setBg(bg);
    setColor(postIt.postitType === "Elephant" ? "text-white" : "text-black");

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.remove("opacity-0", "-translate-y-6");
        containerRef.current.classList.add("animate-smacky-gelatiny");
      }
    }, 1000);
    resizeText();

    window.addEventListener("resize", resizeText);
    return () => window.removeEventListener("resize", resizeText);
  }, []);

  return (
    <Draggable
      disabled={noDrag}
      nodeRef={ref}
      onStart={(_, data) => handleDragStart(data.node)}
      onStop={() => setIsDragging(false)}
    >
      <div
        ref={ref}
        style={{
          ...(noPosition ? {} : postIt.pos),
          zIndex: postIt.itemIndex ?? 0,
        }}
        className={`pointer-events-auto ${noPosition ? "" : "absolute"}`}
      >
        <div
          ref={containerRef}
          className={`${bg} ${color} transition-all duration-300 ease-in-out -translate-y-6 opacity-0 rounded-[5.5%] w-[21vw] max-w-[350px] aspect-square p-5 overflow-hidden flex flex-col drop-shadow-xl`}
        >
          {postIt.contentType && (
            <div className="flex items-center gap-3 max-h-fit">
              <p className="text-xl">{postIt.contentType}</p>
            </div>
          )}
          <div className="grow overflow-hidden text-[0px] flex flex-col gap-1">
            <p
              className="whitespace-pre-wrap leading-100 tracking-snug hyphens-auto"
              ref={textRef}
            >
              {postIt.text}
              {postIt.emojis && (
                <>
                  {"\n"}
                  {postIt.emojis}
                </>
              )}
            </p>
          </div>
          {more && (
            <p className="w-full overflow-hidden text-xl min-h-fit whitespace-nowrap overflow-ellipsis">
              {more}
            </p>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default PostIt;
