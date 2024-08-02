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
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="0">
        <g>
          <path fillRule="nonzero" d="M0 0H24V24H0z"></path>
          <path strokeLinecap="round" strokeWidth="2" d="M12 4L12 14"></path>
          <path
            strokeLinecap="round"
            strokeWidth="2"
            d="M4 8v10a2 2 0 002 2h12a2 2 0 002-2V8M8 7l3.293-3.293a1 1 0 011.414 0L16 7"
          ></path>
        </g>
      </g>
    </svg>
  );
}

export default Icon;
