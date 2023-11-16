import {
  AnalysisType,
  PreviousCharacterCommentData,
  PreviousElephantData,
  PreviousImageData,
  PreviousResponses,
  PreviousThemesData,
} from "@/types";
/* 
TODO: rensade alla inkl senaste upplagda

*/
// add the previous responses to the intro prompt
export const getIntroPrompt = (
  prompt: string,
  type: AnalysisType,
  previousResponses: PreviousResponses[]
) => {
  let emojis;
  switch (type) {
    case AnalysisType.CharacterComment:
      const text = (previousResponses as PreviousCharacterCommentData[]).map(
        (response) => response.text
      );
      emojis = (previousResponses as PreviousCharacterCommentData[]).map(
        (response) => response.emojis
      );

      const textListing =
        text?.length > 0 ? `Texts: ${JSON.stringify(text)}` : null;
      const emojiListing =
        emojis?.length > 0 ? `Emojis: ${emojis.join("")}` : null;

      return [prompt, textListing, "\n", emojiListing]
        .filter(Boolean)
        .join("\n\n");

    case AnalysisType.Theme:
      const themes = (previousResponses as PreviousThemesData[]).map(
        (response) => response.theme
      );
      emojis = (previousResponses as PreviousThemesData[]).map(
        (response) => response.emojis
      );

      return [
        prompt,
        "Themes",
        themes,
        "\n",
        "Emojis",
        [...emojis.join("")],
      ].join("\n\n");

    case AnalysisType.ImageAndHashtags:
      const images = (previousResponses as PreviousImageData[]).map(
        (response) => response.file
      );
      const hashtags = (previousResponses as PreviousImageData[]).map(
        (response) => response.hashtag
      );

      return [prompt, "Images", images, "\n", "Hashtags", hashtags].join(
        "\n\n"
      );

    case AnalysisType.Elephant:
      const elephants = (previousResponses as PreviousElephantData[]).map(
        (response) => response.text
      );

      return [prompt, elephants].join("\n\n");

    default:
      return prompt;
  }
};
