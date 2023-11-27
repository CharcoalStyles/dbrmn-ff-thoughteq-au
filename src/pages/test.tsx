//@ts-nocheck
import { useConfig } from "@/configContext/ConfigState";
import { elephantProfessions, elephantFeelings } from "@/data/defaultConfig";
import { useChatGPT } from "@/hooks/use-chatGPT";
import {
  AnalysisType,
  CharacterCommentResponse,
  ElephantResponse,
  ImageResponse,
  ThemeResponse,
} from "@/types";
import { useState } from "react";

const responseTypes: Array<AnalysisType> = [
  AnalysisType.CharacterComment,
  AnalysisType.Theme,
  AnalysisType.ImageAndHashtags,
  AnalysisType.Elephant,
];

export default function Test() {
  const {} = useConfig();
  const { sendUserMessage } = useChatGPT();

  const [transcript, setTranscript] = useState<string>("");

  const [elephantFeels, setElephantFeels] = useState<Array<boolean>>(
    Array(9).fill(false)
  );
  const [elephantIs, setElephantIs] = useState<Array<boolean>>(
    Array(9).fill(false)
  );
  const [responses, setResponses] = useState<Array<boolean>>([]);

  const [running, setRunning] = useState(false);

  const [combinations, setCombinations] = useState<
    {
      profession: {
        text: string;
        prompt: string;
      };
      feeling: {
        text: string;
        prompt: string;
      };
      response: AnalysisType;
    }[]
  >([]);
  const [gptReturns, setGptReturns] = useState<
    Array<
      | ElephantResponse
      | CharacterCommentResponse
      | ThemeResponse
      | ImageResponse
    >
  >([]);

  return (
    <main
      className={`flex flex-col items-center h-screen bg-pink text-elephant`}
    >
      <h1 className="text-6xl font-extrabold">Elephant Test</h1>
      <div className="mt-8">
        <p className="text-3xl w-full">Transcript</p>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="resize-none p-2"
          placeholder="Type here"
          cols={80}
          rows={3}
        />
      </div>
      <div className="mt-8 flex flex-row w-2/3">
        <div className="p2 w-1/2">
          <p className="text-3xl w-full">Elephant is</p>
          <div className="flex flex-row flex-wrap"></div>
          {elephantProfessions.map((profession, i) => {
            return (
              <div>
                <label>
                  <input
                    checked={elephantIs[i]}
                    onChange={() => {
                      setElephantIs((prev) => {
                        const next = [...prev];
                        next[i] = !next[i];
                        return next;
                      });
                    }}
                    type="checkbox"
                    className="mr-2"
                  />
                  {profession.text}
                </label>
              </div>
            );
          })}
        </div>
        <div className="p2 w-1/2">
          <p className="text-3xl w-full">Elephant feels</p>
          <div className="flex flex-row flex-wrap"></div>
          {elephantFeelings.map(({ text }, i) => {
            return (
              <div>
                <label>
                  <input
                    checked={elephantFeels[i]}
                    onChange={() => {
                      setElephantFeels((prev) => {
                        const next = [...prev];
                        next[i] = !next[i];
                        return next;
                      });
                    }}
                    type="checkbox"
                    className="mr-2"
                  />
                  {text}
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-8 flex flex-row w-2/3">
        <div className="w-2/3 pr-8">
          <p className="text-3xl w-full">Response Types</p>
          <div className="flex flex-row justify-between">
            {responseTypes.map((response, i) => {
              return (
                <div>
                  <label>
                    <input
                      checked={responses[i]}
                      onChange={() => {
                        setResponses((prev) => {
                          const next = [...prev];
                          next[i] = !next[i];
                          return next;
                        });
                      }}
                      type="checkbox"
                      className="mr-2"
                    />
                    {response}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-1/3">
          <p className="text-3xl w-full">Total</p>
          <div className="flex flex-row justify-between">
            <p className="text-xl w-1/3">
              {elephantFeels.filter((v) => v).length *
                elephantIs.filter((v) => v).length *
                responses.filter((v) => v).length}{" "}
              {elephantFeels.filter((v) => v).length *
                elephantIs.filter((v) => v).length *
                responses.filter((v) => v).length >
                5 && "🤯"}
            </p>
            <button
              className="px-4 border rounded-md"
              disabled={running}
              onClick={() => {
                setRunning(true);

                //create an array of objects with the selected professions, feelings and response types
                const selectedProfessions = elephantProfessions.filter(
                  (_, i) => elephantIs[i]
                );
                const selectedFeelings = elephantFeelings.filter(
                  (_, i) => elephantFeels[i]
                );
                const selectedResponses = responseTypes.filter(
                  (_, i) => responses[i]
                );

                //create an array of objects with all possible combinations of the selected professions, feelings and response types
                const combos = selectedProfessions.flatMap((profession) =>
                  selectedFeelings.flatMap((feeling) =>
                    selectedResponses.map((response) => ({
                      profession,
                      feeling,
                      response,
                    }))
                  )
                );
                setCombinations(combos);

                Promise.all(
                  combos.map(({ profession, feeling, response }) => {
                    return sendUserMessage(response, transcript, {
                      feeling: feeling.prompt,
                      profession: profession.prompt,
                    });
                  })
                ).then((responses) => {
                  responses.forEach((resposne) => {
                    console.log("VVV", resposne);
                    if (resposne !== undefined) {
                      //@ts-ignore
                      setGptReturns((prev) => [...prev, ...resposne]);
                    }
                  });
                  setRunning(false);
                });
              }}
            >
              GO!
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col w-2/3">
        <p className="text-3xl w-full">Responses from the Elephant</p>
        <div className="flex flex-row w-full">
          {gptReturns.map((response, i) => {
            const c = combinations[i];
            console.log("WWW", response, c);
            switch (c.response) {
              case AnalysisType.Elephant:
                //ignore typescript errors until the end of file
                return (
                  <div
                    key={response.text.substring(0, 15)}
                    className="w-1/3 px-4 border-t-2 border-elephant"
                  >
                    <p className="text-xl">Elephant</p>
                    <p className="text-lg font-bold">
                      {c.profession.text} - {c.feeling.text}
                    </p>
                    <p>{response.text}</p>
                  </div>
                );
              case AnalysisType.CharacterComment:
                return (
                  <div
                    key={response.text.substring(0, 15)}
                    className="w-1/4 px-4 border-t-2 border-elephant"
                  >
                    <p className="text-xl">Character</p>
                    <p className="text-lg font-bold">
                      {c.profession.text} - {c.feeling.text}
                    </p>
                    <div>
                      <p>{response.text}</p>
                      <p>{response.emojis}</p>
                    </div>
                  </div>
                );
              case AnalysisType.Theme:
                return (
                  <div
                    key={response.text.substring(0, 15)}
                    className="w-1/4 px-4 border-t-2 border-elephant"
                  >
                    <p className="text-xl">Theme</p>
                    <p className="text-lg font-bold">
                      {c.profession.text} - {c.feeling.text}
                    </p>
                    <div>
                      <p>{response.text}</p>
                      <p>{response.emojis}</p>
                    </div>
                  </div>
                );
              case AnalysisType.ImageAndHashtags:
                return (
                  <div
                    key={response.hashtag}
                    className="w-1/4 px-4 border-t-2 border-elephant"
                  >
                    <p className="text-xl">Image</p>
                    <p className="text-lg font-bold">
                      {c.profession.text} - {c.feeling.text}
                    </p>
                    <div>
                      <p>{response.file}</p>
                      <p>{response.hashtag}</p>
                    </div>
                  </div>
                );
            }
          })}
        </div>
      </div>
    </main>
  );
}
