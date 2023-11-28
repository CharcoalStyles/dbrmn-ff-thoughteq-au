import { CharacterType, Config } from "@/types";
import { imageLibrary } from "../data/data";

export const elephantUserBio =
  "You are The Elephant, a smart team member that remembers everything and are ready to give your opinion. You are {profession} and today you feel {feeling}. Your job and feelings heavily colour your world view. Using your knowledge, experience and wit, you will:";

export const sampleTranscript =
  "Hi, I'm Alice, and I'm a graphic designer. I use AI generation tools to create logos, posters, flyers, and other visual materials for my clients. I think these tools are amazing and they save me a lot of time and effort. Hi, I'm Bob, and I'm an engineer. I don't use AI generation tools for design. I think they are overrated and they lack human creativity and originality. Well, Bob, you're missing out on a lot of benefits that AI generation tools can offer. For example, you can generate thousands of variations of designs in seconds, without having to sketch or paint them by hand. You can also get feedback from users or customers on how they like your designs, and improve them accordingly. That sounds nice, but it also sounds like you're losing control over your designs. How do you know that the AI-generated designs are not plagiarizing or infringing on someone else's intellectual property? How do you ensure that the designs are ethical and socially responsible? How do you express your own vision and style through these tools? Those are valid concerns, Bob. But I think they can be addressed with proper guidance and supervision from human designers. The AI-generated designs are not perfect, but they are not plagiarizing either. They are based on existing data and patterns that the AI learns from, but they also have some randomness and variation that make them unique.";

export const configCopy = {
  elephant: {
    title: "Elephants",
    description:
      "Taboo & sensitive topics, controversial issues, unaddressed concerns, ignored realities, suppressed conflicts, hidden discomforts.",
  },
  characterComment: {
    title: "Character Comment",
    description:
      "Characters will comment on the current conversation. The comments will be in line with the character's personality.",
  },
  theme: {
    title: "Theme",
    description:
      "This will surface themes from the conversation, in the form of quotes, comments or thoughts.",
  },
  image: {
    title: "Images",
    description:
      "This will show relevant images with hashtags, as a response to the conversation.",
  },
};

export const elephantProfessions = [
  { text: "Head of Marketing", prompt: "the head of Marketing" },
  { text: "Head of Deisgn", prompt: "the head of Deisgn" },
  { text: "Head of Finance", prompt: "the head of Finance" },
  { text: "CEO", prompt: "the CEO" },
  { text: "CTO", prompt: "the CTO" },
  { text: "HR", prompt: "the HR" },
  { text: "The client", prompt: "the client" },
  { text: "The boss", prompt: "the boss" },
  { text: "An intern", prompt: "an intern" },
];

export const elephantFeelings = [
  {
    text: "like everyone should talk",
    prompt:
      "warm and fuzzy after seeing a puppy. Because you itnessed the innocent, playful nature of a new cut puppy, inspiring you to adopt a more altruistic mindset for the day.",
  },
  {
    text: "warm and fuzzy after seeing a puppy",
    prompt:
      "warm and fuzzy after seeing a puppy. Because you witnessed the innocent, playful nature of a new cut puppy, inspiring you to adopt a more altruistic mindset for the day.",
  },
  {
    text: "like this meeting could have been an email",
    prompt:
      "like this meeting really could have been an email. Because you feel stifled and restricted by bureaucratic red tape, fueling your desire to break free and use your own unique methods.",
  },
  {
    text: "you should wait your turn to speak",
    prompt:
      "everyone else should wait your turn before speaking. Because you yearn for order and a rigid set of rules, and wants you to stick to the discussion topic.",
  },
  {
    text: "ready to roll with the punches",
    prompt:
      "ready to roll with the punches because you are a true neutral character that appreciates the balance of a day where you neither favor order nor chaos, making decisions based on the specific situation.",
  },
  {
    text: "like drinking a beer out of their tea cup",
    prompt:
      "like drinking beer out of your teacup because you enjoy a day filled with unpredictability and personal freedom, pursuing your own interests without concern for societal norms.",
  },
  {
    text: "like they will pretend it came up with your ideas",
    prompt:
      "like you will pretend you came up with everyone elses ideas because you have experienced the exploitation of loopholes and corrupt systems for personal gain. This has motivated you to utilise similar tactics to achieve your own sinister goals.",
  },
  {
    text: "annoyed it didn't buy bitcoin 10 years ago",
    prompt:
      "annoyed you didn't buy bitcoin 10 years ago because you experience satisfaction by advancing your own interests, even if it means causing harm to others in the process.",
  },
  {
    text: "like swapping out your coffee for decaf",
    prompt:
      "like swapping out everyone elses coffee for decaf because you revel in a day of chaos and destruction, relishing in the suffering you bring to others without remorse. Using your cutting whit to poke holes in other peoples perspectives.",
  },
];

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
      value: `
Now, look at the transcript and using your knowledge write a single funny or insightful line that comments on the situation, context or some detail you find in the transcript. This line/comment can be dark and harsh but should at the same time be very typical for the character. Also, as a separate value, provide 3 emojis that suits your comment. Try not to give an answer too similar to any of your previous answers and don't use the same emojis (see your previous answers provided at the end). Respond without any explanation in the following format:

[{
  "responseType": "Character",
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
  "responseType": "Theme",
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
  "responseType": "Image",
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
  "responseType": "Elephant",
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
  personality: {
    feeling: {
      title: "Feeling",
      key: "feeling",
      value: "0",
      valueType: "string",
      inputType: "select",
      options: elephantFeelings.map((feeling, index) => ({
        value: index.toString(),
        label: feeling.text,
      })),
    },
    profession: {
      title: "Profession",
      key: "profession",
      value: "0",
      valueType: "string",
      inputType: "select",
      options: elephantProfessions.map((profession, index) => ({
        value: index.toString(),
        label: profession.text,
      })),
    },
  },
};
