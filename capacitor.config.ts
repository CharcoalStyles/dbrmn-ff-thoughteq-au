import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "co.doberman.elephant",
  appName: "Elephant In The Room",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;
