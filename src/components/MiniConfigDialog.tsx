import React, { FC, useEffect, useRef, useState } from "react";

import { saveConfigToStorage } from "@/configContext/configUtils";
import ConfigIcon from "../../public/elephant/silhouette-cog.svg";
import Image from "next/image";
import { AnalysisType, Config, PostItBoardItem, PostitType } from "@/types";
import { useConfig } from "@/configContext/ConfigState";
import {
  configCopy,
  defaultConfigValues,
  elephantFeelings,
  elephantProfessions,
  sampleTranscript,
} from "@/data/defaultConfig";
import { useChatGPT } from "@/hooks/use-chatGPT";
import PostIt from "./PostIt";

type samplePostIt = {
  elephantMessage?: string;
  commnetMessage?: string;
  profession: string;
  feeling: string;
};
interface Props {
  initConfig: Config;
  onFullOptionsClick: () => void;
}

const MiniOptionsDialog: FC<Props> = ({ initConfig, onFullOptionsClick }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { config, updateConfig } = useConfig();
  const { sendUserMessage } = useChatGPT();
  const [generating, setGenerating] = useState(false);
  const [postIt, setPostIt] = useState<samplePostIt>();

  const [boardTitle, setBoardTitle] = useState<string>("");
  const [openAiKey, setOpenAiKey] = useState<string>("");
  const [openAiOrganisation, setOpenAiOrganisation] = useState<string>("");

  useEffect(() => {
    setBoardTitle(initConfig.main.boardTitle.value);
    setOpenAiKey(initConfig.main.openAiKey.value);
    setOpenAiOrganisation(initConfig.main.openAiOrganisation.value);
  }, [initConfig]);

  useEffect(() => {
    if (
      boardTitle !== config.main.boardTitle.value &&
      boardTitle !== defaultConfigValues.main.boardTitle.value
    ) {
      updateConfig({
        category: "main",
        type: "SET_CONFIG_VALUE",
        key: "boardTitle",
        value: boardTitle,
      });
    }
  }, [boardTitle]);

  useEffect(() => {
    if (
      openAiKey !== config.main.openAiKey.value &&
      openAiKey !== defaultConfigValues.main.openAiKey.value
    ) {
      updateConfig({
        category: "main",
        type: "SET_CONFIG_VALUE",
        key: "openAiKey",
        value: openAiKey,
      });
    }
  }, [openAiKey]);

  useEffect(() => {
    if (
      openAiOrganisation !== config.main.openAiOrganisation.value &&
      openAiOrganisation !== defaultConfigValues.main.openAiOrganisation.value
    ) {
      updateConfig({
        category: "main",
        type: "SET_CONFIG_VALUE",
        key: "openAiOrganisation",
        value: openAiOrganisation,
      });
    }
  }, [openAiOrganisation]);

  const openDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
      dialogRef.current.classList.add("flex", "flex-col");
    }
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      saveConfigToStorage(config);
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
            <div className="overflow-y-auto flex-grow">
              <div className="flex flex-row py-4 px-8">
                <label className="w-full">
                  Board Title
                  <input
                    type="text"
                    className="w-full bg-pink border-0 py-1 px-2 rounded-md text-elephant"
                    value={boardTitle}
                    onChange={({ target: { value } }) => {
                      setBoardTitle(value);
                    }}
                  />
                </label>
              </div>
              <div className="flex flex-row">
                <div className="flex flex-col px-8 w-full">
                  <div className="flex flex-row w-full">
                    <div className="w-1/2 pr-4">
                      <label>
                        OpenAI Key:
                        <input
                          type="text"
                          className="w-full bg-pink border-0 py-1 px-2 rounded-md text-elephant"
                          value={openAiKey}
                          onChange={({ target: { value } }) => {
                            setOpenAiKey(value);
                          }}
                        />
                      </label>
                    </div>
                    <div className="w-1/2">
                      <label>
                        OpenAI Org (optional):
                        <input
                          type="text"
                          className="w-full bg-pink border-0 py-1 px-2 rounded-md text-elephant"
                          value={openAiOrganisation}
                          onChange={({ target: { value } }) => {
                            setOpenAiOrganisation(value);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
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
                    {(elephantFeels
                      ? elephantFeelings
                      : elephantProfessions
                    ).map(({ text }, i) => {
                      const targetValue = Number.parseInt(
                        elephantFeels
                          ? config.personality.feeling.value
                          : config.personality.profession.value
                      );
                      return (
                        <div
                          key={text}
                          onClick={() => {
                            updateConfig({
                              category: "personality",
                              type: "SET_CONFIG_VALUE",
                              key: elephantFeels ? "feeling" : "profession",
                              value: i.toString(),
                            });

                            if (!generating) {
                              setGenerating(true);
                              const feeling =
                                elephantFeelings[
                                  Number.parseInt(
                                    config.personality.feeling.value
                                  )
                                ];
                              const profession =
                                elephantProfessions[
                                  Number.parseInt(
                                    config.personality.profession.value
                                  )
                                ];

                              const postit: samplePostIt = {
                                feeling: elephantFeels ? text : feeling.text,
                                profession: elephantFeels
                                  ? profession.text
                                  : text,
                              };

                              Promise.all([
                                sendUserMessage(
                                  AnalysisType.Elephant,
                                  sampleTranscript,
                                  {
                                    feeling: postit.feeling,
                                    profession: postit.profession,
                                  }
                                ),

                                sendUserMessage(
                                  AnalysisType.CharacterComment,
                                  sampleTranscript,
                                  {
                                    feeling: postit.feeling,
                                    profession: postit.profession,
                                  }
                                ),
                              ]).then(([ele, cc]) => {
                                if (ele !== undefined) {
                                  const data = ele[0];
                                  if (data.responseType === "Elephant") {
                                    const { text } = data;
                                    postit.elephantMessage = text;
                                  }
                                }
                                if (cc !== undefined) {
                                  const data = cc[0];
                                  if (data.responseType === "Character") {
                                    const { text } = data;
                                    postit.commnetMessage = text;
                                  }
                                }
                                setPostIt(postit);
                                setGenerating(false);
                              });
                            }
                          }}
                          className={`w-1/4 h-32 m-2 border grid text-center min-w-[7rem] transform cursor-pointer place-items-center rounded-xl px-3 py-21 ${
                            i === targetValue
                              ? "scale-105 text-elephant  border-elephant bg-pink text-2xl"
                              : "border-pink bg-elephant text-pink text-xl"
                          }`}
                        >
                          {text}
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-2">
                    <p className="text-xl">Sample Comment</p>
                    {generating && <p>Generating</p>}
                    {postIt && !generating && (
                      <div className="w-full flex flex-row justify-between">
                        <div className="w-1/3 pr-4 pt-2">
                          <p>
                            The Elephant is {postIt.profession} who feels{" "}
                            {postIt.feeling}. They are commenting on a debate
                            about AI in design.
                          </p>
                        </div>
                        <div className="w-1/2 flex flex-grow content-end">
                          <div>
                            {postIt.elephantMessage && (
                              <PostIt
                                postIt={{
                                  pos: { left: "0", top: "0" },
                                  contentType: "Elephant",
                                  itemIndex: 0,
                                  text: postIt.elephantMessage,
                                  postitType: "Elephant",
                                }}
                                handleDragStart={() => {}}
                                setIsDragging={() => {}}
                                noDrag
                                noPosition
                              />
                            )}
                          </div>
                          <div>
                            {postIt.commnetMessage && (
                              <PostIt
                                postIt={{
                                  pos: { left: "0", top: "0" },
                                  contentType: "Comment",
                                  itemIndex: 0,
                                  text: postIt.commnetMessage,
                                  postitType: "CharacterComment",
                                }}
                                handleDragStart={() => {}}
                                setIsDragging={() => {}}
                                noDrag
                                noPosition
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
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
