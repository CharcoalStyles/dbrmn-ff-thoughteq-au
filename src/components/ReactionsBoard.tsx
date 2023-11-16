import Draggable from "react-draggable";
import PostIt from "@/components/PostIt";
import HashtagImage from "@/components/HashtagImage";
import { ImageBoardItem, PostItBoardItem } from "@/types";
import { createRef } from "react";

interface ReactionsBoardProps {
  characterComments: PostItBoardItem[];
  postIts: PostItBoardItem[];
  images: ImageBoardItem[];
  isDragging: boolean;
  handleDragStart: (node: HTMLElement) => void;
  setIsDragging: (isDragging: boolean) => void;
}

const ReactionsBoard = ({
  characterComments,
  postIts,
  images,
  isDragging,
  handleDragStart,
  setIsDragging,
}: ReactionsBoardProps) => {
  return (
    <div
      className={`absolute z-0 inset-0 pointer-events-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {characterComments.map((characterComment, i) => (
        <PostIt
          key={characterComment.itemIndex + "" + i}
          postIt={characterComment}
          handleDragStart={handleDragStart}
          setIsDragging={setIsDragging}
        />
      ))}
      {postIts.map((postIt, i) => (
        <PostIt
          key={postIt.itemIndex + "" + i}
          handleDragStart={handleDragStart}
          setIsDragging={setIsDragging}
          postIt={postIt}
        />
      ))}
      {images.map((image, i) => {
        const ref = createRef<HTMLDivElement>();

        return (
          <Draggable
            key={i + "_" + image.src}
            nodeRef={ref}
            onStart={(_, data) => handleDragStart(data.node)}
            onStop={() => setIsDragging(false)}
          >
            <div
              ref={ref}
              style={{ ...image.pos, zIndex: image.itemIndex ?? 0 }}
              className="absolute pointer-events-auto"
            >
              <HashtagImage filename={image.src} hashtag={image.hashtag} />
            </div>
          </Draggable>
        );
      })}
    </div>
  );
};

export default ReactionsBoard;
