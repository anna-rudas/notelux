import React from "react";

function Icon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 385 385"
      version="1.1"
      viewBox="0 0 385 385"
      xmlSpace="preserve"
      {...props}
    >
      <g>
        <path
          fill="#FF9811"
          d="M77.326 355L83.327 385 233.318 355 157.5 355z"
        ></path>
        <path
          fill="#FF9811"
          d="M307.5 340.163L377.5 326.162 318.663 31.988 203.612 55 307.5 55z"
        ></path>
        <path
          fill="#FFE98F"
          d="M157.5 150c-24.813 0-45-20.186-45-45V85h30v20c0 8.271 6.729 15 15 15V55H7.5v300h150V150z"
        ></path>
        <path
          fill="#FFDA44"
          d="M307.5 340.163V55h-105v50c0 24.814-20.187 45-45 45v205h150v-14.837z"
        ></path>
        <path
          fill="#FFDA44"
          d="M172.5 105V55h-15v65c8.271 0 15-6.729 15-15z"
        ></path>
        <path
          fill="#565659"
          d="M142.5 45c0-8.271 6.729-15 15-15s15 6.729 15 15v60c0 8.271-6.729 15-15 15s-15-6.729-15-15V85h-30v20c0 24.814 20.187 45 45 45s45-20.186 45-45V45c0-24.813-20.187-45-45-45s-45 20.187-45 45v10h30V45z"
        ></path>
      </g>
    </svg>
  );
}

export default Icon;
