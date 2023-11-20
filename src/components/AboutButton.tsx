import React, { useState } from "react";
import ElephantDialog from "./ElephantDialog";

const AboutButton = () => {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <>
      <button
        className="absolute px-2 bg-white rounded-full z-20 left-2 bottom-8"
        onClick={() => setAboutOpen(true)}
      >
        About
      </button>
      {aboutOpen && (
        <ElephantDialog onClose={() => setAboutOpen(false)} lookUp>
          <div className="flex flex-col items-center justify-center h-full gap-8 px-16 text-white max-w-">
            <h2 className="text-6xl">About</h2>
            <p className="text-xl sm:text-2xl max-w-6xl md:text-4xl md:leading-[160%] tracking-[-0.8px]">
              {`"The Elephant in the Room", an AI application by EY Doberman,
              explores the intriguing potential of AI to uncover unspoken or
              ignored topics. Even though AI doesn't currently possess
              consciousness, it may act as a revealing mirror in our
              conversations. This innovative project aims to spark discussions
              about the prospective roles of AI, highlighting a frequently
              overlooked dimension of the evolving AI landscape.`}
            </p>
          </div>
        </ElephantDialog>
      )}
    </>
  );
};

export default AboutButton;
