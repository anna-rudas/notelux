import React from "react";

function Icon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      fill="none"
      viewBox="0 -2 24 24"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M9.5 0a5.5 5.5 0 110 11 5.5 5.5 0 010-11zM.95 20c-.525 0-.95-.387-.95-.864v-1.814C0 14.934 2.127 13 4.75 13h9.5c2.623 0 4.75 1.935 4.75 4.322v1.814c0 .477-.425.864-.95.864H.95zM21.5 7a1 1 0 10-2 0v1.5H18a1 1 0 100 2h1.5V12a1 1 0 102 0v-1.5H23a1 1 0 100-2h-1.5V7z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}

export default Icon;
