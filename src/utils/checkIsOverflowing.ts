interface Props {
  height: number;
  width: number;
  scrollHeight: number;
  scrollWidth: number;
  axis?: "x" | "y" | "both";
}
export const checkIsOverFlowing = ({
  height,
  width,
  scrollHeight,
  scrollWidth,
  axis = "y",
}: Props) => {
  const isY = scrollHeight > Math.round(height);
  const isX = scrollWidth > Math.round(width);

  let isOverflowing = axis === "both" ? isY || isX : axis === "x" ? isX : isY;
  return isOverflowing;
};
