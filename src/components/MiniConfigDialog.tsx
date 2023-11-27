import React, { FC, useEffect, useRef, useState } from "react";

import ConfigIcon from "../../public/elephant/silhouette-cog.svg";
import Image from "next/image";
import { Config } from "@/types";
import { useConfig } from "@/configContext/ConfigState";
import {
  configCopy,
  elephantFeelings,
  elephantProfessions,
} from "@/data/defaultConfig";

interface Props {
  onFullOptionsClick: () => void;
}

const MiniOptionsDialog: FC<Props> = ({ onFullOptionsClick }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { config, updateConfig } = useConfig();

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

  const miniOptionKeys: Array<
    keyof Omit<Config, "chatGPT" | "main" | "whisper" | "personality">
  > = ["elephant", "characterComment", "theme", "image"];

  const [elephantFeels, setElephantFeels] = useState(false);

  return (
    <>
      <button
        onClick={openDialog}
        className="absolute top-8 right-0 z-20 w-10 p-2"
      >
        <Image alt="elephant" src={ConfigIcon} />
      </button>
      <dialog ref={dialogRef} onClose={closeDialog}>
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-elephant text-pink w-full h-full overflow-y-auto rounded-lg shadow-lg flex flex-col">
            <div className="flex justify-between items-center p-4">
              <button
                className="bg-pink text-elephant rounded-lg p-2"
                onClick={() => {
                  updateConfig({ type: "RESET_CONFIG", saveToStorage: true });
                }}
              >
                Reset all
              </button>
              <button
                className="bg-pink text-elephant rounded-lg p-2"
                onClick={() => {
                  closeDialog();
                  onFullOptionsClick();
                }}
              >
                Full Options
              </button>
              <button
                className="bg-pink text-elephant rounded-lg p-2"
                onClick={closeDialog}
              >
                Close
              </button>
            </div>
            <hr className="border-2" />
            <div className=" overflow-y-auto flex-grow">
              <div className="flex flex-row">
                <div className="flex flex-col py-4 px-8 w-2/5">
                  <p className="text-xl">Content</p>
                  {miniOptionKeys.map((key) => {
                    // @ts-ignore
                    const isActive = config[key].active.value === "true";

                    return (
                      <div className="py-4" key={key}>
                        <div className="flex text-lg justify-between items-center">
                          <p>{configCopy[key].title}</p>
                          <div>
                            <label className="flex cursor-pointer select-none items-center">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={isActive}
                                  onChange={() => {
                                    updateConfig({
                                      category: key,
                                      type: "SET_CONFIG_VALUE",
                                      key: "active",
                                      value: isActive ? "false" : "true",
                                    });
                                  }}
                                  className="sr-only"
                                />
                                <div
                                  className={`box block h-8 w-14 rounded-full transition-colors ${
                                    isActive ? "bg-pink" : "bg-pink-muted"
                                  }`}
                                ></div>
                                <div
                                  className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black transition ${
                                    isActive ? "translate-x-full" : ""
                                  }`}
                                ></div>
                              </div>
                            </label>
                          </div>
                        </div>
                        <p className="w-4/5">{configCopy[key].description}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-col py-4 px-8  w-3/5">
                  <div className="flex text-lg justify-between items-center">
                    <div>The elephant is...</div>
                    <div>
                      <label className="flex cursor-pointer select-none items-center">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={elephantFeels}
                            onChange={() => {
                              setElephantFeels(!elephantFeels);
                            }}
                            className="sr-only"
                          />
                          <div
                            className={`box block h-8 w-14 rounded-full transition-colors bg-pink`}
                          ></div>
                          <div
                            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black transition ${
                              elephantFeels ? "translate-x-full" : ""
                            }`}
                          ></div>
                        </div>
                      </label>
                    </div>
                    <div>The elephant feels...</div>
                  </div>

                  <div className="flex text-lg flex-wrap justify-between items-center">
                    {!elephantFeels &&
                      elephantProfessions.map(({ text }, i) => {
                        return (
                          <div
                            key={text}
                            className={`w-1/4 h-32 m-2 border grid text-center min-w-[7rem] transform cursor-pointer place-items-center rounded-xl px-3 py-21 ${
                              i === 4
                                ? "scale-105 text-elephant  border-elephant bg-pink text-2xl"
                                : "border-pink bg-elephant text-pink text-xl"
                            }`}
                          >
                            {text}
                          </div>
                        );
                      })}
                    {elephantFeels &&
                      elephantFeelings.map(({ text }, i) => {
                        return (
                          <div
                            key={text}
                            className={`w-1/4 h-32 m-2 border grid text-center min-w-[7rem] transform cursor-pointer place-items-center rounded-xl px-3 py-21 ${
                              i === 4
                                ? "scale-105 text-elephant  border-elephant bg-pink text-2xl"
                                : "border-pink bg-elephant text-pink text-xl"
                            }`}
                          >
                            {text}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MiniOptionsDialog;
