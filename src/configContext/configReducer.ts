import { defaultConfigValues } from "@/data/defaultConfig";
import { CategoryName, Config, ConfigValueKey } from "@/types";
import { saveConfigToStorage } from "./configUtils";

export const initialConfig: Config = { ...defaultConfigValues };

export type Action =
  | {
      type: "SET_CONFIG_VALUE";
      category: CategoryName;
      key: ConfigValueKey;
      value: string;
      saveToStorage?: boolean;
    }
  | {
      type: "REPLACE_CONFIG";
      category?: undefined;
      key?: undefined;
      value: Config;
      saveToStorage?: boolean;
    }
  | {
      type: "RESET_CONFIG";
      category?: undefined;
      key?: undefined;
      value?: undefined;
      saveToStorage?: boolean;
    };

export const ConfigReducer = (config: Config, action: Action): Config => {
  const { type, category, key, value, saveToStorage } = action;

  console.log("Config:", type ?? "", category ?? "", key ?? "", "-->", value);

  if (
    !["REPLACE_CONFIG", "RESET_CONFIG"].includes(type) &&
    ((category && (config as Config)[category] === undefined) ||
      (category && key && (config[category] as any))[key as ConfigValueKey] ===
        undefined)
  ) {
    console.error(
      "Failed to update config. Not found:",
      type,
      category,
      key,
      "-->",
      value
    );
    return config;
  }

  switch (type) {
    case "SET_CONFIG_VALUE":
      const newConfig = {
        ...config,
        [category]: {
          ...config[category],
          [key]: {
            ...(config[category] as any)[key],
            value,
          },
        },
      };
      saveToStorage && saveConfigToStorage(newConfig);
      return newConfig;
    case "REPLACE_CONFIG":
      saveToStorage && saveConfigToStorage(value);
      return value;
    case "RESET_CONFIG":
      const newConfigValues = { ...defaultConfigValues };
      saveToStorage && saveConfigToStorage(newConfigValues);
      return newConfigValues;

    default: {
      return config;
    }
  }
};
