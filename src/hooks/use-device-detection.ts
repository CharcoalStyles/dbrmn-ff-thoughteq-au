import { useEffect, useState } from "react";

export const useDeviceDetection = () => {
  const [ua, setUa] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [browser, setBrowser] = useState<undefined | string>();
  const [isTouch, setIsTouch] = useState(false);
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  const [orientationPortrait, setOrientationPortrait] = useState(true);

  const update = () => {
    // get the user agent string
    var userAgent = navigator.userAgent;
    setUa(userAgent);

    const mobile =
      userAgent.match(/Android/i) ||
      userAgent.match(/webOS/i) ||
      userAgent.match(/iPhone/i) ||
      userAgent.match(/iPad/i) ||
      userAgent.match(/iPod/i) ||
      userAgent.match(/Opera Mini/i) ||
      userAgent.match(/IEMobile/i) ||
      userAgent.match(/BlackBerry/i) ||
      userAgent.match(/WPDesktop/i) ||
      userAgent.match(/Windows Phone/i);
    setIsMobile(!!mobile);

    const tablet =
      /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(
        userAgent
      );
    setIsTablet(!!tablet);

    let browserName = undefined;
    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "Firefox";
    } else if (userAgent.match(/safari/i)) {
      browserName = "Safari";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "Opera";
    } else if (userAgent.match(/edg/i)) {
      browserName = "Edge";
    } else if (userAgent.match(/android/i)) {
      browserName = "Android";
    } else if (userAgent.match(/iphone/i)) {
      browserName = "iPhone";
    }
    setBrowser(browserName);

    setIsTouch(
      "ontouchstart" in document.documentElement ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
    );

    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    setOrientationPortrait(window.innerWidth <= window.innerHeight);
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  return {
    ua,
    isMobile,
    isTablet,
    browser,
    isTouch,
    screenSize,
    orientationPortrait,
  };
};
