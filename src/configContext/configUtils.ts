import { defaultConfigValues } from "@/data/defaultConfig";
import { Config } from "@/types";

export const formatMultipleConfigValue = (value: string) =>
  value ? value.split(",").map((s) => parseInt(s.trim())) : [];

export const loadConfigFromStorage = () => {
  if (typeof window !== "undefined") {
    const initialConfigValues = localStorage.getItem("configValues")
      ? JSON.parse(localStorage.getItem("configValues") as string)
      : defaultConfigValues;

    console.log("loading config from storage");
    return initialConfigValues;
  }
};

export const saveConfigToStorage = (config: Config) => {
  if (typeof window !== "undefined") {
    console.log("saving config to storage");
    localStorage.setItem("configValues", JSON.stringify(config));
  }
};
