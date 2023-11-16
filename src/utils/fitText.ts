import { checkIsOverFlowing } from "./checkIsOverflowing";
import { getElementSize } from "./getElementSize";

interface Props {
  textElement: HTMLParagraphElement;
  max?: number;
  axis?: "x" | "y" | "both";
}

export const fitText = ({ textElement, max = 100, axis = "y" }: Props) => {
  const container = textElement?.parentElement;
  if (!container || !textElement) return;
  textElement.style.fontSize = "0px";

  const { height, width, scrollHeight, scrollWidth } =
    getElementSize(container);

  let overflowing = checkIsOverFlowing({
    height,
    width,
    scrollHeight,
    scrollWidth,
    axis,
  });

  const step = 1;
  const unit = "px";
  let i = 10;

  while (!overflowing && i < max) {
    textElement.style.fontSize = `${i}${unit}`;
    const elSize = getElementSize(container);
    overflowing = checkIsOverFlowing({
      ...elSize,
      axis,
    });
    if (!overflowing) {
      i += step;
    } else {
      textElement.style.fontSize = `${i - step}${unit}`;
    }
  }
};
