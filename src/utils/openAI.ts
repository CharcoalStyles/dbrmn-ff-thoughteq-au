import { useConfig } from "@/configContext/ConfigState";
import { PromptType } from "@/types";

export async function sendMessage(
  prompt: PromptType[],
  model: string,
  temperature: number,
  summary = false
) {
  const { config } = useConfig();

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.main.openAiKey.value}`,
    },
    body: JSON.stringify({
      messages: prompt,
      model,
      max_tokens: 500,
      n: 1,
      stop: null,
      temperature,
    }),
  };

  const response = await fetch(
    process.env.NEXT_PUBLIC_OPEN_API_URL!,
    requestOptions
  );

  if (!response.ok) {
    throw new Error(`API call failed with status code: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content?.trim() ?? null;
  const timeStamp = new Date(data.created * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const message = summary ? timeStamp + " " + text : text;

  return message;
}
