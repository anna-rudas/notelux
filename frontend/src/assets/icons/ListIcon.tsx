import React from "react";

function Icon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 30.263 30.263"
      version="1.1"
      viewBox="0 0 30.263 30.263"
      xmlSpace="preserve"
      {...props}
    >
      <g>
        <path d="M0 2.332H7.732V8.73H0z"></path>
        <path d="M0 11.932H7.732V18.332H0z"></path>
        <path d="M0 21.531H7.732V27.929H0z"></path>
        <path d="M10.933 11.934H30.262999999999998V18.334H10.933z"></path>
        <path d="M10.933 21.531H30.262999999999998V27.930999999999997H10.933z"></path>
        <path d="M10.933 2.332H30.262999999999998V8.732H10.933z"></path>
      </g>
    </svg>
  );
}

export default Icon;
