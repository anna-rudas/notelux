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
      <path d="M12 23A11 11 0 101 12a11.013 11.013 0 0011 11zm0-20a9 9 0 11-9 9 9.01 9.01 0 019-9zM8.293 14.293L10.586 12 8.293 9.707a1 1 0 011.414-1.414L12 10.586l2.293-2.293a1 1 0 011.414 1.414L13.414 12l2.293 2.293a1 1 0 11-1.414 1.414L12 13.414l-2.293 2.293a1 1 0 01-1.414-1.414z"></path>
    </svg>
  );
}

export default Icon;
