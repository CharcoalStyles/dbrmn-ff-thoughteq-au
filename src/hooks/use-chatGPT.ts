import {
  AnalysisType,
  CharacterCommentResponse,
  CharacterType,
  ElephantResponse,
  ImageResponse,
  PreviousCharacterCommentData,
  PreviousElephantData,
  PreviousImageData,
  PreviousResponses,
  PreviousThemesData,
  PromptType,
  ThemeResponse,
} from "@/types";
import { useRef, useState } from "react";
import { getIntroPrompt } from "@/utils/addPreviousResponses";
import { imageLibrary } from "@/data/data";
import { useConfig } from "@/configContext/ConfigState";
import { elephantFeelings, elephantProfessions } from "@/data/defaultConfig";

export const useChatGPT = () => {
  const characterCommentResponses = useRef<PreviousCharacterCommentData[]>([]);
  const themesResponses = useRef<PreviousThemesData[]>([]);
  const imagesResponses = useRef<PreviousImageData[]>([]);
  const elephantsResponses = useRef<PreviousElephantData[]>([]);

  const lastCharacter = useRef<string>();

  const { config } = useConfig();

  const sendUserMessage = async (
    type: AnalysisType,
    transcript: string,
    overrides?: {
      model?: string;
      temperature?: number;
      profession?: string;
      feeling?: string;
    }
  ) => {
    const { model, temperature } = config[type];

    const profession =
      overrides?.profession ??
      elephantProfessions[config.personality.profession].prompt;
    const feeling =
      overrides?.feeling ?? elephantFeelings[config.personality.feeling].prompt;

    console.log("→ SENDING PROMPT:", {
      type,
      model: model.value,
      temperature: temperature.value,
      overrides,
    });

    // create a new set of messages,
    // 1. including an intro prompt per request type
    // 2. also, append the latest responses for that type, if any previous are present
    // 3. append the transcript.
    let messages: PromptType[] = [];
    let introPrompt = "";
    let previousResponses: PreviousResponses[];
    if (type === AnalysisType.CharacterComment) {
      introPrompt = config.theme.introPrompt.value;
      previousResponses = characterCommentResponses.current;
    } else if (type === AnalysisType.Theme) {
      introPrompt = config.theme.introPrompt.value;
      previousResponses = themesResponses.current;
    } else if (type === AnalysisType.ImageAndHashtags) {
      introPrompt = config.image.introPrompt.value;
      previousResponses = imagesResponses.current;
    } else {
      introPrompt = config.elephant.introPrompt.value;
      previousResponses = elephantsResponses.current;
    }
    messages.push({
      role: "system",
      content: getIntroPrompt(
        introPrompt,
        type,
        previousResponses,
        profession,
        feeling
      ),
    });

    messages.push({
      role: "user",
      content: `Here is the transcript: ${transcript}`,
    });
    messages.map((message) => {
      const role = message.role;
      const content = message.content;
      // console.log({ role }, { content });
    });
    console.log(type, "MESSAGES TO SEND", messages);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.main.openAiKey.value}`,
        ...(config.main.openAiOrganisation.value.trim() === ""
          ? {}
          : {
              "OpenAI-Organization":
                config.main.openAiOrganisation.value.trim(),
            }),
      },
      body: JSON.stringify({
        messages: messages,
        model: overrides?.model ?? model.value,
        max_tokens: 500,
        n: 1,
        stop: null,
        temperature:
          overrides?.temperature ?? Number.parseFloat(temperature.value),
      }),
    };

    console.log({ requestOptions });

    console.time(type + " Prompt request");
    const response = await fetch(
      process.env.NEXT_PUBLIC_OPEN_API_URL!,
      requestOptions
    );
    console.timeEnd(type + " Prompt request");

    if (!response.ok) {
      throw new Error(`API call failed with status code: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? null;

    console.log("←", type, "RECEIVED PROMPT RESPONSE", { response: text });
    console.timeEnd("Whole flow");

    const itemsOnBoard =
      characterCommentResponses.current.length +
      themesResponses.current.length +
      imagesResponses.current.length;

    if (itemsOnBoard >= parseInt(config.main.maxItems.value)) {
      characterCommentResponses.current = [];
      themesResponses.current = [];
      imagesResponses.current = [];
    }

    try {
      if (type === AnalysisType.Elephant) {
        const elephants = JSON.parse(text) as ElephantResponse[];
        if (
          !!elephants.length &&
          elephants[0] &&
          elephants[0].text &&
          elephants[0].text !== "No elephant found"
        ) {
          elephantsResponses.current.push({
            text: elephants[0].text,
          });
          return elephants;
        } else {
          return [];
        }
      } else if (type === AnalysisType.CharacterComment) {
        // TEMP: see to that this function is not needed (found trailing commas in JSON response)
        function parseJSON(jsonString: string) {
          let sanitizedString = jsonString
            .replace(/\,\s*}\s*\]/g, "}]")
            .replace(/\,\s*}\s*,/g, "},");
          return JSON.parse(sanitizedString);
        }
        const characterComments = parseJSON(text) as CharacterCommentResponse[];
        if (!!characterComments) {
          const CharacterComment: PreviousCharacterCommentData = {
            text: characterComments[0].text,
            emojis: characterComments[0].emojis,
            type: characterComments[0].responseType as CharacterType,
          };

          characterCommentResponses.current.push(CharacterComment);
          return [CharacterComment];
        } else {
          return [];
        }
      } else if (type === AnalysisType.Theme) {
        const themes = JSON.parse(text) as ThemeResponse[];
        if (!!themes.length) {
          const prevTheme: PreviousThemesData = {
            theme: themes[0].theme,
            emojis: themes[0].emojis,
            type: themes[0].type,
          };
          themesResponses.current.push(prevTheme);
          return themes;
        } else {
          return [];
        }
      } else {
        const images = JSON.parse(text) as ImageResponse[];
        if (!!images.length && images[0].file && images[0].hashtag) {
          // skip suggested image if it's not in our library
          const imageName = images[0].file.split(".")[0];
          const imageIsInLibrary = imageLibrary.includes(imageName);
          if (!imageIsInLibrary) {
            console.log(
              `Skipping suggeested image ${images[0].file}. Not found in library.`
            );
            return [];
          }

          const prevImage = {
            file: images[0].file,
            hashtag: images[0].hashtag,
          } as PreviousImageData;
          imagesResponses.current.push(prevImage);
          return images;
        } else {
          return [];
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { sendUserMessage };
};
