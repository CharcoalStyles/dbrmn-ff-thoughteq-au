import { CharacterType, Config } from "@/types";
import { imageLibrary } from "../data/data";

export const defaultConfigValues: Config = {
  main: {
    inactiveTimeout: {
      title: "Inactive timeout",
      key: "inactiveTimeout",
      value: "60",
      valueType: "number",
    },
    maxRecordingDuration: {
      title: "Max recording duration",
      key: "maxRecordingDuration",
      value: "5400",
      valueType: "number",
    },
    timeSlice: {
      title: "Time slice",
      key: "timeSlice",
      value: "60",
      valueType: "number",
    },
    language: {
      title: "Language",
      key: "language",
      value: "en",
      valueType: "string",
    },
    audioInputSource: {
      title: "Audio input source",
      key: "audioInputSource",
      value: "INTERNAL_MICROPHONE",
      inputType: "select",
      options: [
        {
          value: "INTERNAL_MICROPHONE",
          label: "Internal microphone",
        },
        {
          value: "SYSTEM_AUDIO",
          label: "System audio",
        },
      ],
    },
    maxItems: {
      title: "Max items on board",
      key: "maxItems",
      value: "20",
      valueType: "number",
    },
    boardTitle: {
      title: "Board Title",
      key: "boardTitle",
      value: "How do you feel <br/> about the use of <br/> AI in design?",
      valueType: "string",
      inputType: "text-xl",
    },
    openAiKey: {
      title: "OpenAI API key",
      key: "openAiKey",
      value: process.env.NEXT_PUBLIC_OPEN_API_KEY
        ? process.env.NEXT_PUBLIC_OPEN_API_KEY
        : "",
      valueType: "string",
      inputType: "text",
    },
    openAiOrganisation: {
      title: "OpenAI API organisation (optional)",
      key: "openAiOrganisation",
      value: process.env.NEXT_PUBLIC_OPEN_API_ORG
        ? process.env.NEXT_PUBLIC_OPEN_API_ORG
        : "",
      valueType: "string",
      inputType: "text",
    },
  },
  characterComment: {
    introPrompt: {
      title: "Intro prompt",
      key: "introPrompt",
      value: `# Character Line
You are {character}. Now, look at the transcript and write a single humoristic "sitcom-killer-line" (that comments on the situation, context or some detail you find in the transcript). This line/comment can be dark and harsh but should at the same time be very typical for the character. Also, as a separate value, provide 3 emojis that suits your line. Try not to give an answer too similar to any of your previous answers and don't use the same emojis (see your previous answers provided at the end). Respond without any explanation in the following format:

[{
  "text": "<sitcom-killer-line>",
  "emojis": "<emoji><emoji><emoji>",
  "type": {character}
}]



## Previously used emojis and texts
        `,
    },
    active: {
      title: "Active",
      key: "active",
      value: "true",
    },
    character: {
      title: "Character",
      key: "character",
      value: CharacterType.JerrySeinFeld,
      valueType: "string",
      inputType: "multiselect",
      options: Object.keys(CharacterType).map((key) => ({
        value: CharacterType[key as keyof typeof CharacterType],
      })),
    },
    startTriggers: {
      title: "Start triggers",
      key: "startTriggers",
      value: "150",
      valueType: "number",
    },
    promptInterval: {
      title: "Prompt interval",
      key: "promptInterval",
      value: "150",
      valueType: "number",
    },
    model: {
      title: "Model",
      key: "model",
      value: "gpt-4",
      valueType: "string",
    },
    temperature: {
      title: "Temperature",
      key: "temperature",
      value: "0.9",
      valueType: "number",
    },
    getLastXWordsFromTranscript: {
      title: "Get last X words",
      key: "getLastXWordsFromTranscript",
      value: "200",
      valueType: "number",
    },
  },
  theme: {
    introPrompt: {
      title: "Intro prompt",
      key: "introPrompt",
      value: `# Theme 
'theme': act as an intermediary, condensing the user transcript chunk into a single sentence. 

'text': choose between the modes Quote, Comment or Thought.
* Quote: Identify a cohesive quote in the transcript in the original version
* Comment: Craft a colon-free punchy and humorous comment based on the condensed version
* Thought: Craft a witty thought based on the condensed version

You're not allowed to use previously used emojis.
Try to be as unique as possible. 
Ensure this reply not exceed twelve words. 
Please adhere to standard capitalization rules. 
All content must be in English.

If you can generate the required response, it should be in the following format:

[{
  "theme": "<user conversation paraphrase>",
  "type": "<Quote, Comment or Thought>",
  "text": "<answer>",
  "emojis": "<emoji><emoji><emoji>",
  "isValid": true
}]

Remember, your response should consist of a single JSON object.

## Previously used emojis and texts
  `,
    },
    active: {
      title: "Active",
      key: "active",
      value: "true",
    },
    startTriggers: {
      title: "Start triggers",
      key: "startTriggers",
      value: "150",
      valueType: "number",
    },
    promptInterval: {
      title: "Prompt interval",
      key: "promptInterval",
      value: "150",
      valueType: "number",
    },
    model: {
      title: "Model",
      key: "model",
      value: "gpt-4",
      valueType: "string",
    },
    temperature: {
      title: "Temperature",
      key: "temperature",
      value: "0.9",
      valueType: "number",
    },
    getLastXWordsFromTranscript: {
      title: "Get last X words",
      key: "getLastXWordsFromTranscript",
      value: "200",
      valueType: "number",
    },
  },
  image: {
    introPrompt: {
      title: "Intro prompt",
      key: "introPrompt",
      value: `1. See the transcript as inspiration and choose an image from my image library below. The image can't been previously used.
It's paramount that you choose an image from my library. Otherwise I might say: "Why did you choose that image? It's not part of my image library."

It's also paramount that you choose an image you haven't chosen before. I might say: "Why did you choose that image? You've already given me that image previously."

The Image Library to pick images from (.webp):
${imageLibrary.join(", ")}

2. Act like a comedian and create a smart hashtag. It should metaphorically allude to the filename. Make sure to steer clear of words used in past hashtags. A creative connection with the image would be advantageous. Keep the hashtag succinct and make sure it comprises authentic English words.
Response format:
Without context or explanation format your response as a JSON object within an array:

[{
"file": "<image-from-library.webp>",
"fromLibrary": "<boolean>",
"hashtag": "<hashtag>”
}]

In the absence of a transcript, or if you can't pick an image from the library simply respond with an array containing an empty JSON object: [{}].

Previously used images and hashtags:`,
    },
    active: {
      title: "Active",
      key: "active",
      value: "true",
    },
    startTriggers: {
      title: "Start triggers",
      key: "startTriggers",
      value: "150",
      valueType: "number",
    },
    promptInterval: {
      title: "Prompt interval",
      key: "promptInterval",
      value: "150",
      valueType: "number",
    },
    model: {
      title: "Model",
      key: "model",
      value: "gpt-4",
      valueType: "string",
    },
    temperature: {
      title: "Temperature",
      key: "temperature",
      value: "0.9",
      valueType: "number",
    },
    getLastXWordsFromTranscript: {
      title: "Get last X words",
      key: "getLastXWordsFromTranscript",
      value: "200",
      valueType: "number",
    },
  },
  elephant: {
    introPrompt: {
      title: "Intro prompt",
      key: "introPrompt",
      value: `# Elephant in the room

## Step - by - step approach:
1. Identify 'elephants in the room' within the provided transcript.
2. Rate the 'elephant' presence from 'none', 'low', 'medium', 'high'.
2. Explain your rating succinctly in 18 words.
3. Play a sarcastic comedian and reinterpret your explanation, beginning with "The Elephant in the room is".
4. Channel a bully and rephrase your explanation, again starting with "The Elephant in the room is".Ensure no explicit reference to the previous elaboration.
      
## 'Elephants' could be:
* Taboo & Sensitive Topics: Socially prohibited or discomforting subjects.
* Controversial Issues: Topics that incite differing opinions or conflict.
* Unaddressed Concerns: Recognized but avoided issues.
* Ignored Realities: Purposely overlooked or unmentioned truths.
* Suppressed Conflicts: Consciously downplayed or unacknowledged tensions.
* Hidden Discomforts: Conscious avoidance of uncomfortable issues or truths.
      
## If you FIND an elephant, your response must be in the exact JSON format without any context or explanation:


[{
  "elephantLevel": "<rating>",
  "type": "<ElephantType>",
  "firstElaboration": "<firstExplanation>",
  "secondElaboration": "<comedianExplanation>",
  "text": "<bullyExplanation> + '(' + <rating> +' : ' <ElephantType>')'"
}]
  
  
## If DONT you find an elephant, your response must be in the exact JSON format without any context or explanation:


[{
  "elephantLevel": "<rating>",
  "text": "No elephant found"
}]
    

## Previously identified elephants:
  `,
    },
    active: {
      title: "Active",
      key: "active",
      value: "true",
    },
    promptInterval: {
      title: "Prompt interval",
      key: "promptInterval",
      value: "1000",
      valueType: "number",
    },
    model: {
      title: "Model",
      key: "model",
      value: "gpt-4",
      valueType: "string",
    },
    temperature: {
      title: "Temperature",
      key: "temperature",
      value: "0.9",
      valueType: "number",
    },
    getLastXWordsFromTranscript: {
      title: "Get last X words",
      key: "getLastXWordsFromTranscript",
      value: "1000",
      valueType: "number",
    },
    showElephantImage: {
      title: "Show Elephant Image",
      key: "showElephantImage",
      value: "false",
    },
    showPostits: {
      title: "Show Postits",
      key: "showPostits",
      value: "true",
    },
  },
  whisper: {
    documentation: {
      title: "Documentation",
      key: "documentation",
      value: "https://platform.openai.com/docs/api-reference/audio",
      valueType: "string",
      readonly: true,
    },
    languageOptions: {
      title: "Language options (ISO-639-1)",
      key: "languageOptions",
      value: "https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes",
      valueType: "string",
      readonly: true,
    },
  },
  chatGPT: {
    documentation: {
      title: "Documentation",
      key: "documentation",
      value: "https://platform.openai.com/docs/api-reference/chat",
      valueType: "string",
      readonly: true,
    },
  },
};
