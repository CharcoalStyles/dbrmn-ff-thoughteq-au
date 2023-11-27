export type ConfigInputType =
  | "text"
  | "text-xl"
  | "textarea"
  | "number"
  | "select"
  | "multiselect"
  | "checkbox";

export interface ConfigValue {
  title: string;
  key: ConfigValueKey;
  value: string;
  valueType?: string;
  readonly?: boolean;
  inputType?: ConfigInputType;
  inputClass?: string;
  options?: { value: string; label?: string }[];
}

export interface Category {
  [key: string]: ConfigValue;
}

export type CategoryName =
  | "main"
  | "characterComment"
  | "theme"
  | "image"
  | "elephant"
  | "whisper"
  | "chatGPT"
  | "personality";

export type ConfigValueKey =
  | "inactiveTimeout"
  | "maxRecordingDuration"
  | "timeSlice"
  | "language"
  | "introPrompt"
  | "active"
  | "startTriggers"
  | "promptInterval"
  | "model"
  | "temperature"
  | "documentation"
  | "languageOptions"
  | "getLastXWordsFromTranscript"
  | "audioInputSource"
  | "maxItems"
  | "character"
  | "showElephantImage"
  | "showPostits"
  | "boardTitle"
  | "openAiKey"
  | "openAiOrganisation"
  | "profession"
  | "feeling";

export type Config = {
  main: {
    inactiveTimeout: ConfigValue;
    maxRecordingDuration: ConfigValue;
    timeSlice: ConfigValue;
    language: ConfigValue;
    audioInputSource: ConfigValue;
    maxItems: ConfigValue;
    boardTitle: ConfigValue;
    openAiKey: ConfigValue;
    openAiOrganisation: ConfigValue;
  };
  characterComment: {
    introPrompt: ConfigValue;
    active: ConfigValue;
    character: ConfigValue;
    startTriggers: ConfigValue;
    promptInterval: ConfigValue;
    model: ConfigValue;
    temperature: ConfigValue;
    getLastXWordsFromTranscript: ConfigValue;
  };
  theme: {
    introPrompt: ConfigValue;
    active: ConfigValue;
    startTriggers: ConfigValue;
    promptInterval: ConfigValue;
    model: ConfigValue;
    temperature: ConfigValue;
    getLastXWordsFromTranscript: ConfigValue;
  };
  image: {
    introPrompt: ConfigValue;
    active: ConfigValue;
    startTriggers: ConfigValue;
    promptInterval: ConfigValue;
    model: ConfigValue;
    temperature: ConfigValue;
    getLastXWordsFromTranscript: ConfigValue;
  };
  elephant: {
    introPrompt: ConfigValue;
    active: ConfigValue;
    promptInterval: ConfigValue;
    model: ConfigValue;
    temperature: ConfigValue;
    getLastXWordsFromTranscript: ConfigValue;
    showElephantImage: ConfigValue;
    showPostits: ConfigValue;
  };
  whisper: {
    documentation: ConfigValue;
    languageOptions: ConfigValue;
  };
  chatGPT: {
    documentation: ConfigValue;
  };
  personality: {
    profession: ConfigValue;
    feeling: ConfigValue;
  };
};
export interface PromptType {
  role: string;
  content: string;
}

export interface Position {
  top: string;
  left: string;
}

export type ElephantRating = "none" | "low" | "medium" | "high";

export interface PostItItemData {
  postitType: PostitType;
  contentType: string;
  text: string;
  emojis?: string;
  elephantLevel?: ElephantRating;
}

export interface PostItBoardItem extends PostItItemData {
  pos: Position;
  itemIndex: number;
}

export interface ImageItemData {
  src: string;
  hashtag: string;
}

export interface ImageBoardItem extends ImageItemData {
  pos: Position;
  itemIndex: number;
}

export interface ElephantBoardItem {
  text: string;
  pos: Position;
  itemIndex?: number;
  type: string;
}

export interface PromptCadence {
  interval: number;
  startTriggers: number[];
}

export type PostitType = "Theme" | "CharacterComment" | "Elephant";

export type ThemeType = "Quote" | "Comment" | "Thought";

export type CharacterCommentResponse = {
  responseType: "Character";
  text: string;
  emojis: string;
  type: CharacterType;
};

export type ThemeResponse = {
  responseType: "Theme";
  theme: string;
  emojis: string;
  type: ThemeType;
  relatedToProhibitedThemes: boolean;
  containsPreviousEmojis: boolean;
  text: string;
  isValid: boolean;
};

export type ImageResponse = {
  responseType: "Image";
  file: string;
  hashtag: string;
  quality: number;
};

export type ElephantResponse = {
  responseType: "Elephant";
  elephantLevel: ElephantRating;
  text: string;
  type?: string;
  firstElaboration?: string;
  secondElaboration?: string;
};

export interface ElephantMessage {
  elephantLevel: ElephantRating;
  text: string;
  type?: string;
  firstElaboration?: string;
  secondElaboration?: string;
}

export type PreviousCharacterCommentData = {
  text: string;
  emojis: string;
  type: CharacterType;
};

export type PreviousThemesData = {
  theme: string;
  emojis: string;
  type: ThemeType;
};

export type PreviousImageData = {
  file: string;
  hashtag: string;
};

export type PreviousElephantData = {
  text: string;
};

export enum AnalysisType {
  CharacterComment = "characterComment",
  Elephant = "elephant",
  Theme = "theme",
  ImageAndHashtags = "image",
}

export type ChatGPTResponse =
  | CharacterCommentResponse
  | ThemeResponse
  | ImageResponse
  | ElephantResponse;

export type PreviousResponses =
  | PreviousThemesData
  | PreviousImageData
  | PreviousElephantData;

export type AudioInputSource = "INTERNAL_MICROPHONE" | "SYSTEM_AUDIO";

export enum CharacterType {
  JerrySeinFeld = "Jerry Seinfeld",
  FredrikReinfeldt = "Fredrik Reinfeldt",
  GretaThunberg = "Greta Thunberg",
  HomerSimpson = "Homer Simpson",
  Borat = "Borat",
  KungCarlXVIGustaf = "Kung Carl XVI Gustaf",
  Batman = "Batman",
  Deadpool = "Deadpool",
  Yoda = "Yoda",
  DarthVader = "Darth Vader",
  JustinBieber = "Justin Bieber",
  HermioneGranger = "Hermione Granger",
}
