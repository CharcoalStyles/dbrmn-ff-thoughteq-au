import { useEffect, useRef, useState } from "react";

const HashtagImage = ({
  filename,
  hashtag,
}: {
  filename: string;
  hashtag: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const styleTimeout = useRef<ReturnType<typeof setTimeout>>();

  const [rotation, setRotation] = useState("rotate-0");
  const rotations = [
    "rotate-[9deg]",
    "rotate-[5deg]",
    "rotate-[3deg]",
    "rotate-[-3deg]",
    "rotate-[-5deg]",
    "rotate-[-9deg]",
  ];

  useEffect(() => {
    styleTimeout.current = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.remove(
          "translate-x-4",
          "translate-y-4",
          "scale-110",
          "opacity-0"
        );
        containerRef.current.classList.add("animate-smacky-gelatiny");
      }
    }, 1000);

    setRotation(rotations[Math.floor(Math.random() * rotations.length)]);
    return () => styleTimeout.current && clearTimeout(styleTimeout.current);
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-w-[10vw] transition-all duration-200 opacity-0 ease-out translate-x-4 translate-y-4 scale-110"
    >
      <img
        height="300"
        width="300"
        className="pointer-events-none max-w-[60vw]"
        src={"/reactions/" + filename}
        alt=""
      />
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-[7px] px-[10px] w-fit rounded-[40px] text-xl bg-yellow ${rotation}`}
      >
        <p className="uppercase">{hashtag}</p>
      </div>
    </div>
  );
};

export default HashtagImage;
