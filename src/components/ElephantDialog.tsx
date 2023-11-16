import CloseIcon from "@/components/elephant/close-icon";
import Face from "@/components/elephant/face";
import FaceLookingUp from "@/components/elephant/face-looking-up";

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
      <div className="absolute pointer-events-none w-64 left-1/2 bottom-0 -translate-x-1/2 ">
        {lookUp ? (
          <FaceLookingUp  />) : (
            <Face />
          )}
      </div>

      <button className="absolute right-[3.7vw] top-[3.7vw]" onClick={onClose}>
        <CloseIcon className="w-[4vw]" />
      </button>

      <>{children}</>
    </div>
  );
};

export default ElephantDialog;
