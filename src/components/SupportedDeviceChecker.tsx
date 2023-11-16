import { useDeviceDetection } from "@/hooks/use-device-detection";
import { ReactNode, useEffect, useState } from "react";
import { Capacitor } from '@capacitor/core'
import Elephant from "./Elephant";
import AboutButton from "./AboutButton";

const SupportedDeviceChecker = ({ children }: { children: ReactNode }) => {
  // const [isSupported, setIsSupported] = useState(false);
  
  const { browser, screenSize } = useDeviceDetection();

  const platform = Capacitor.getPlatform();
  const isWeb = platform === "web";
  const isChrome = browser?.toLowerCase() === "chrome";
  const isValidResolution = screenSize.width >= 480 && screenSize.height >= 480;
  const isSupported = isValidResolution && isWeb ? isChrome : true;
  return isSupported ? (
    <>{children}</>
  ) : (
    <main className="flex items-center justify-center h-screen bg-pink">
        <>
          <div className="max-w-[90vw] flex flex-col justify-center items-center">
            <div className="w-[clamp(200px,23.5vw,325px)] pointer-events-none">
              <Elephant
                onClick={() => {}}
                disabled
                mood="listening"
                messages={[]}
              />
            </div>
            <p className="text-center text-elephant leading-[100%] whitespace-nowrap tracking-[-1px] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              {isValidResolution ? (
                <>
                  The Elephant in <br /> the room is your tiny <br /> screen
                  resolution.
                </>
              ) : (
                <>
                  The Elephant in the room is your <br /> blatant avoidance of
                  the <br /> Chrome browser.
                </>
              )}
            </p>
          </div>
          <AboutButton />
        </>
    </main>
  );
};

export default SupportedDeviceChecker;
