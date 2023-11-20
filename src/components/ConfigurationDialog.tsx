import { useConfig } from "@/configContext/ConfigState";
import { saveConfigToStorage } from "@/configContext/configUtils";
import { CategoryName, ConfigValueKey } from "@/types";
import React, { FC, useRef, useState } from "react";
import ConfigIcon from "../../public/elephant/silhouette-cog.svg";
import Image from "next/image";
import { externalLinks } from "@/data/data";
interface Props {
  disabled?: boolean;
}

const ConfigurationDialog: FC<Props> = ({ disabled }) => {
  const { config, updateConfig } = useConfig();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dirty, setDirty] = useState(false);

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

  const handleChange = (
    category: CategoryName,
    key: ConfigValueKey,
    value: string
  ) => {
    setDirty(true);
    updateConfig({ type: "SET_CONFIG_VALUE", category, key, value });
  };

  const isDisabled = {
    all: disabled,
    main: disabled,
    character: disabled || config.characterComment.active.value === "false",
    theme: disabled || config.theme.active.value === "false",
    image: disabled || config.image.active.value === "false",
    elephant: disabled || config.elephant.active.value === "false",
  };

  return (
    <>
      <button
        onClick={openDialog}
        className="absolute top-8 right-0 z-20 w-10 p-2"
      >
        <Image alt="elephant" src={ConfigIcon} />
      </button>

      <dialog
        className="w-screen h-screen max-w-[unset] max-h-[unset] rounded-lg p-0 bg-pink "
        ref={dialogRef}
        onClose={closeDialog}
      >
        <div
          className="flex justify-center w-full pt-24 overflow-auto"
          style={{
            opacity: disabled ? 0.75 : 1,
          }}
        >
          <div className="flex flex-col w-full max-w-5xl gap-16 p-4 mb-16 h-fit">
            <div>
              <h2 className="text-black text-[40px] font-normal leading-9 tracking-wide">
                Configuration {disabled ? "(stop recording to edit)" : ""}
              </h2>
              <a
                className="text-black text-[13px] font-normal underline leading-3 tracking-wide"
                href={externalLinks.documentation.url}
                target="_blank"
              >
                {externalLinks.documentation.title}
              </a>
            </div>

            <div className="grid w-full grid-cols-4 gap-x-3 gap-y-3 pr-[200px]">
              {Object.values(config.main).map((item) => {
                return (
                  <div
                    key={item.title}
                    className={`flex flex-col gap-2 ${
                      item.inputType === "text-xl" ? "config-input-xl" : ""
                    }`}
                  >
                    <label className="config-label">{item.title}</label>
                    {item.inputType === "select" ? (
                      <select
                        className="w-full px-1 py-0 config-input"
                        disabled={isDisabled.main}
                        onChange={(ev) =>
                          handleChange("main", item.key, ev.target.value)
                        }
                        value={config.main.audioInputSource.value}
                      >
                        {item.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label ?? option.value}
                          </option>
                        ))}
                      </select>
                    ) : item.inputType === "textarea" ? (
                      <textarea
                        disabled={isDisabled.main}
                        value={item.value}
                        onChange={(ev) =>
                          handleChange("main", item.key, ev.target.value)
                        }
                      />
                    ) : (
                      <input
                        disabled={isDisabled.main}
                        type={item.valueType}
                        className="w-full config-input"
                        value={item.value}
                        onChange={(ev) =>
                          handleChange("main", item.key, ev.target.value)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-[1fr_200px] gap-y-16">
              <div className="flex flex-col flex-1 gap-2">
                <label className="config-label">
                  Character Comment Post-It
                </label>
                <textarea
                  className="config-prompt"
                  value={config.characterComment.introPrompt.value}
                  disabled={isDisabled.character}
                  rows={27}
                  onChange={(e) =>
                    handleChange(
                      "characterComment",
                      config.characterComment.introPrompt.key,
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-8 ml-8">
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.characterComment.active.title}
                  </label>
                  <select
                    disabled={isDisabled.all}
                    className="p-0 px-2 config-input"
                    value={config.characterComment.active.value}
                    onChange={(ev) =>
                      handleChange(
                        "characterComment",
                        config.characterComment.active.key,
                        ev.target.value
                      )
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.characterComment.character.title}
                  </label>
                  <select
                    multiple
                    disabled={isDisabled.character}
                    className="p-0 px-2 h-32 config-input"
                    value={config.characterComment.character.value.split(",")}
                    onChange={(ev) => {
                      const l = ev.currentTarget.selectedOptions.length;
                      const v = [];
                      for (let i = 0; i < l; i++) {
                        v.push(ev.currentTarget.selectedOptions[i].value);
                      }
                      console.log(v);
                      handleChange(
                        "characterComment",
                        config.characterComment.character.key,
                        v.join(",")
                      );
                    }}
                  >
                    {config.characterComment.character.options?.map(
                      (option) => (
                        <option key={option.value} value={option.value}>
                          {option.value}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.characterComment.startTriggers.title}
                  </label>
                  <input
                    disabled={isDisabled.character}
                    className="config-input"
                    type={config.characterComment.startTriggers.valueType}
                    value={config.characterComment.startTriggers.value}
                    onChange={(ev) =>
                      handleChange(
                        "characterComment",
                        config.characterComment.startTriggers.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.characterComment.promptInterval.title}
                  </label>
                  <input
                    disabled={isDisabled.character}
                    className="config-input"
                    type={config.characterComment.promptInterval.valueType}
                    value={config.characterComment.promptInterval.value}
                    onChange={(ev) =>
                      handleChange(
                        "characterComment",
                        config.characterComment.promptInterval.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.characterComment.model.title}
                  </label>
                  <input
                    disabled={isDisabled.character}
                    className="config-input"
                    type={config.characterComment.model.valueType}
                    value={config.characterComment.model.value}
                    onChange={(ev) =>
                      handleChange(
                        "characterComment",
                        config.characterComment.model.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.characterComment.temperature.title}
                  </label>
                  <input
                    disabled={isDisabled.character}
                    className="config-input"
                    type={config.characterComment.temperature.valueType}
                    value={config.characterComment.temperature.value}
                    onChange={(ev) =>
                      handleChange(
                        "characterComment",
                        config.characterComment.temperature.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.characterComment.getLastXWordsFromTranscript.title}
                  </label>
                  <input
                    disabled={isDisabled.character}
                    className="config-input"
                    type={
                      config.characterComment.getLastXWordsFromTranscript
                        .valueType
                    }
                    value={
                      config.characterComment.getLastXWordsFromTranscript.value
                    }
                    onChange={(ev) =>
                      handleChange(
                        "characterComment",
                        config.characterComment.getLastXWordsFromTranscript.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1 gap-2">
                <label className="config-label">Theme Post-It</label>
                <textarea
                  className="config-prompt"
                  value={config.theme.introPrompt.value}
                  disabled={isDisabled.theme}
                  rows={27}
                  onChange={(e) =>
                    handleChange(
                      "theme",
                      config.theme.introPrompt.key,
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-8 ml-8">
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.theme.active.title}
                  </label>
                  <select
                    disabled={isDisabled.all}
                    className="p-0 px-2 config-input"
                    value={config.theme.active.value}
                    onChange={(ev) =>
                      handleChange(
                        "theme",
                        config.theme.active.key,
                        ev.target.value
                      )
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.theme.startTriggers.title}
                  </label>
                  <input
                    disabled={isDisabled.theme}
                    className="config-input"
                    type={config.theme.startTriggers.valueType}
                    value={config.theme.startTriggers.value}
                    onChange={(ev) =>
                      handleChange(
                        "theme",
                        config.theme.startTriggers.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.theme.promptInterval.title}
                  </label>
                  <input
                    disabled={isDisabled.theme}
                    className="config-input"
                    type={config.theme.promptInterval.valueType}
                    value={config.theme.promptInterval.value}
                    onChange={(ev) =>
                      handleChange(
                        "theme",
                        config.theme.promptInterval.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.theme.model.title}
                  </label>
                  <input
                    disabled={isDisabled.theme}
                    className="config-input"
                    type={config.theme.model.valueType}
                    value={config.theme.model.value}
                    onChange={(ev) =>
                      handleChange(
                        "theme",
                        config.theme.model.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.theme.temperature.title}
                  </label>
                  <input
                    disabled={isDisabled.theme}
                    className="config-input"
                    type={config.theme.temperature.valueType}
                    value={config.theme.temperature.value}
                    onChange={(ev) =>
                      handleChange(
                        "theme",
                        config.theme.temperature.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.theme.getLastXWordsFromTranscript.title}
                  </label>
                  <input
                    disabled={isDisabled.theme}
                    className="config-input"
                    type={config.theme.getLastXWordsFromTranscript.valueType}
                    value={config.theme.getLastXWordsFromTranscript.value}
                    onChange={(ev) =>
                      handleChange(
                        "theme",
                        config.theme.getLastXWordsFromTranscript.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1 gap-2">
                <label className="config-label">Images & Hashtags</label>
                <textarea
                  className="config-prompt"
                  value={config.image.introPrompt.value}
                  disabled={isDisabled.image}
                  rows={27}
                  onChange={(e) =>
                    handleChange(
                      "theme",
                      config.image.introPrompt.key,
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-8 ml-8">
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.image.active.title}
                  </label>
                  <select
                    disabled={isDisabled.all}
                    className="p-0 px-2 config-input"
                    value={config.image.active.value}
                    onChange={(ev) =>
                      handleChange(
                        "image",
                        config.image.active.key,
                        ev.target.value
                      )
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.image.startTriggers.title}
                  </label>
                  <input
                    disabled={isDisabled.image}
                    className="config-input"
                    type={config.image.startTriggers.valueType}
                    value={config.image.startTriggers.value}
                    onChange={(ev) =>
                      handleChange(
                        "image",
                        config.image.startTriggers.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.image.promptInterval.title}
                  </label>
                  <input
                    disabled={isDisabled.image}
                    className="config-input"
                    type={config.image.promptInterval.valueType}
                    value={config.image.promptInterval.value}
                    onChange={(ev) =>
                      handleChange(
                        "image",
                        config.image.promptInterval.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.image.model.title}
                  </label>
                  <input
                    disabled={isDisabled.image}
                    className="config-input"
                    type={config.image.model.valueType}
                    value={config.image.model.value}
                    onChange={(ev) =>
                      handleChange(
                        "image",
                        config.image.model.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.image.temperature.title}
                  </label>
                  <input
                    disabled={isDisabled.image}
                    className="config-input"
                    type={config.image.temperature.valueType}
                    value={config.image.temperature.value}
                    onChange={(ev) =>
                      handleChange(
                        "image",
                        config.image.temperature.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.image.getLastXWordsFromTranscript.title}
                  </label>
                  <input
                    disabled={isDisabled.image}
                    className="config-input"
                    type={config.image.getLastXWordsFromTranscript.valueType}
                    value={config.image.getLastXWordsFromTranscript.value}
                    onChange={(ev) =>
                      handleChange(
                        "image",
                        config.image.getLastXWordsFromTranscript.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1 gap-2">
                <label className="config-label">Elephant</label>
                <textarea
                  className="config-prompt"
                  value={config.elephant.introPrompt.value}
                  disabled={isDisabled.elephant}
                  rows={21}
                  onChange={(e) =>
                    handleChange(
                      "elephant",
                      config.elephant.introPrompt.key,
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-8 ml-8">
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.elephant.active.title}
                  </label>
                  <select
                    disabled={isDisabled.all}
                    className="p-0 px-2 config-input"
                    value={config.elephant.active.value}
                    onChange={(ev) =>
                      handleChange(
                        "elephant",
                        config.elephant.active.key,
                        ev.target.value
                      )
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.elephant.promptInterval.title}
                  </label>
                  <input
                    disabled={isDisabled.elephant}
                    className="config-input"
                    type={config.elephant.promptInterval.valueType}
                    value={config.elephant.promptInterval.value}
                    onChange={(ev) =>
                      handleChange(
                        "elephant",
                        config.elephant.promptInterval.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.elephant.model.title}
                  </label>
                  <input
                    disabled={isDisabled.elephant}
                    className="config-input"
                    type={config.elephant.model.valueType}
                    value={config.elephant.model.value}
                    onChange={(ev) =>
                      handleChange(
                        "elephant",
                        config.elephant.model.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.elephant.temperature.title}
                  </label>
                  <input
                    disabled={isDisabled.elephant}
                    className="config-input"
                    type={config.elephant.temperature.valueType}
                    value={config.elephant.temperature.value}
                    onChange={(ev) =>
                      handleChange(
                        "elephant",
                        config.elephant.temperature.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.elephant.getLastXWordsFromTranscript.title}
                  </label>
                  <input
                    disabled={isDisabled.elephant}
                    className="config-input"
                    type={config.elephant.getLastXWordsFromTranscript.valueType}
                    value={config.elephant.getLastXWordsFromTranscript.value}
                    onChange={(ev) =>
                      handleChange(
                        "elephant",
                        config.elephant.getLastXWordsFromTranscript.key,
                        ev.target.value
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.elephant.showElephantImage.title}
                  </label>
                  <select
                    disabled={isDisabled.elephant}
                    className="p-0 px-2 config-input"
                    value={config.elephant.showElephantImage.value}
                    onChange={(ev) =>
                      handleChange(
                        "elephant",
                        config.elephant.showElephantImage.key,
                        ev.target.value
                      )
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="config-label">
                    {config.elephant.showPostits.title}
                  </label>
                  <select
                    disabled={isDisabled.elephant}
                    className="p-0 px-2 config-input"
                    value={config.elephant.showPostits.value}
                    onChange={(ev) =>
                      handleChange(
                        "elephant",
                        config.elephant.showPostits.key,
                        ev.target.value
                      )
                    }
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-white border-t h-fit border-t-gray">
          <button
            type="button"
            disabled={isDisabled.all}
            onClick={() => {
              setDirty(false);
              updateConfig({ type: "RESET_CONFIG", saveToStorage: true });
            }}
            className="px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
          >
            Reset all to default
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setDirty(false);
                saveConfigToStorage(config);
                closeDialog();
              }}
              disabled={!dirty || isDisabled.all}
              className="px-4 py-2 font-bold text-white rounded-full bg-green hover:opacity-90 focus:outline-none focus:shadow-outline disabled:bg-gray"
            >
              Save
            </button>

            <button
              onClick={closeDialog}
              className="px-4 py-2 font-bold text-white bg-black bg-gray-500 rounded-full hover:bg-gray-700 focus:outline-none focus:shadow-outline"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ConfigurationDialog;
