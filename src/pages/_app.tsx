import SupportedDeviceChecker from "@/components/SupportedDeviceChecker";
import { ConfigProvider } from "@/configContext/ConfigState";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <SupportedDeviceChecker>
        <Component {...pageProps} />
      </SupportedDeviceChecker>
    </ConfigProvider>
  );
}
