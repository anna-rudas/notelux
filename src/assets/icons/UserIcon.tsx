import React from "react";

function Icon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      fill="none"
      viewBox="-1 0 22 22"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10 0a6 6 0 110 12 6 6 0 010-12zM1 22.099a1 1 0 01-1-1V19a5 5 0 015-5h10a5 5 0 015 5v2.099a1 1 0 01-1 1H1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default Icon;
