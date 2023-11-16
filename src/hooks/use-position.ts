import { useRef } from "react";
type Props =
  | {
      allowCentered?: boolean;
    }
  | undefined;

export const usePosition = (props: Props) => {
  const { allowCentered } = props || {};

  const positionIndex = useRef(0);
  let positions = [
    { left: "1.30%", top: "7.1%" },
    { left: "48.9%", top: "-5%" },
    { left: "22.5%", top: "74.3%" },
    { left: "10.5%", top: "33%" },
    { left: "72.1%", top: "71.3%" },
    { left: "1.6%", top: "59%" },
    { left: "46.3%", top: "77.9%" },
    { left: "75.4%", top: "53.9%" },
    { left: "3.6%", top: "24.4%" },
    { left: "73.4%", top: "2%" },
    { left: "76.1%", top: "26.4%" },
    { left: "24.8%", top: "-5%" },
    { left: "5.9%", top: "42.7%" },
  ];

  if (allowCentered) {
    positions = [
      ...positions,
      { left: "33%", top: "35%" },
      { left: "66%", top: "60%" },
      { left: "31%", top: "65%" },
      { left: "61%", top: "31%" },
      { left: "51%", top: "48%" },
    ];
  }

  function getNextPosition() {
    const index = positionIndex.current % positions.length;
    const pos = { top: positions[index].top, left: positions[index].left };
    positionIndex.current += 1;

    // Adjust position with a -10% to +10% if all positions are used
    if (positionIndex.current >= positions.length) {
      pos.left = `${Math.floor(Math.random() * 20 + parseInt(pos.left) - 10)}%`;
      pos.top = `${Math.floor(Math.random() * 20 + parseInt(pos.top) - 10)}%`;
    }

    return pos;
  }

  return { getNextPosition };
};
