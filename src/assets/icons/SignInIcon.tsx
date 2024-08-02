import React from "react";

function Icon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 12h-6.5M13 9l-2.5 3M13 15l-2.5-3M17 17c0 2.21-1.79 3-4 3h-3a4 4 0 01-4-4V8a4 4 0 014-4h3c2.21 0 4 .79 4 3"
      ></path>
    </svg>
  );
}

export default Icon;
