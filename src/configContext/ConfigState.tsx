import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  FC,
  Dispatch,
  ReactNode,
  useEffect,
} from "react";

import {
  Action,
  ConfigReducer,
  initialConfig as defaultInitialConfig,
} from "./configReducer";
import { Config } from "@/types";
import { loadConfigFromStorage } from "./configUtils";

interface ContextValue {
  config: Config;
  updateConfig: Dispatch<Action>;
}

type ContextWithSetter = React.Context<ContextValue>;

export type ContextValueType = { config: Config; dispatch: Dispatch<Action> };

const ConfigContext: ContextWithSetter = createContext({
  config: defaultInitialConfig,
  updateConfig: (action: Action) => {},
});

interface ConfigProviderProps {
  initialConfig?: Partial<Config>;
  children: ReactNode;
}

export const ConfigProvider: FC<ConfigProviderProps> = ({
  initialConfig,
  children,
}) => {
  const [config, updateConfig] = useReducer(
    ConfigReducer,
    initialConfig
      ? { ...defaultInitialConfig, ...initialConfig }
      : defaultInitialConfig
  );

  const contextValue = useMemo(() => {
    return { config, updateConfig };
  }, [config, updateConfig]);

  useEffect(() => {
    typeof window !== "undefined" && console.log("rendered");
    const storedConfig = loadConfigFromStorage();
    if (storedConfig) {
      updateConfig({ type: "REPLACE_CONFIG", value: storedConfig });
    }
  }, []);

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export function useConfig() {
  return useContext(ConfigContext);
}
