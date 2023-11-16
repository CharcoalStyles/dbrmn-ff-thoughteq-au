import { Mp3Encoder } from "lamejs";

const encoder = new Mp3Encoder(1, 44100, 64 /* 96 */);

export const encodeAudio = (buffer: ArrayBuffer) => {
  const mp3chunk = encoder.encodeBuffer(new Int16Array(buffer));
  const mp3blob = new Blob([mp3chunk], {
    type: "audio/mpeg",
  });
  const file = new File([mp3blob], "speech.mp3", {
    type: "audio/mpeg",
  });
  return file;
};
