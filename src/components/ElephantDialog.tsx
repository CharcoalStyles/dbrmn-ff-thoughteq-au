import CloseIcon from "../../public/elephant/close-icon.svg";
import Face from "../../public/elephant/face.svg";
import FaceLookingUp from "../../public/elephant/face-looking-up.svg";

import { ReactNode, useRef } from "react";

const ElephantDialog = ({
  children,
  onClose,
  lookUp = false,
}: {
  children?: ReactNode;
  onClose: () => void;
  lookUp?: boolean;
}) => {
  const elephantMessagesOverlayRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="absolute inset-0 z-50 bg-elephant"
      ref={elephantMessagesOverlayRef}
    >
      <div className="absolute pointer-events-none w-[16vw] left-1/2 bottom-0 -translate-x-1/2 ">
        <img src={(lookUp ? FaceLookingUp : Face).src} alt="" />
      </div>

      <button className="absolute right-[3.7vw] top-[3.7vw]" onClick={onClose}>
        <img className="w-[4vw]" src={CloseIcon.src} />
      </button>

      <>{children}</>
    </div>
  );
};

export default ElephantDialog;
