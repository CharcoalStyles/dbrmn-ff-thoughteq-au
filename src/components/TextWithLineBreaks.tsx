import { FC } from "react";

interface Props {
  text: string;
}
export const TextWithLineBreaks: FC<Props> = ({ text }) => {
  const output = text.split(/<br ?\/?>|\n/).flatMap((line, i) => [
    <span key={`line-${i}`} className="whitespace-nowrap">
      {line}
    </span>,
    <br key={`line-break-${i}`} />,
  ]);

  return <>{output}</>;
};
