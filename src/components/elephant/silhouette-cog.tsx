import * as React from "react";
const SVGComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={325}
    height={289}
    viewBox="0 0 325 289"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M223.79 0L201.559 85.2179L274.179 22.9717L324.569 117.082L224.531 142.277L324.569 168.954L274.179 263.064L200.818 203.041L223.79 289H100.779L125.233 203.041L51.1307 263.064L0 168.954L99.2973 142.277L0 117.082L51.1307 22.9717L123.751 85.2179L100.779 0H223.79ZM162 170C175.807 170 187 158.807 187 145C187 131.193 175.807 120 162 120C148.193 120 137 131.193 137 145C137 158.807 148.193 170 162 170Z"
      fill="#6B4FFD"
    />
  </svg>
);
export default SVGComponent;
