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
      <path d="M12 1a11 11 0 1011 11A11.013 11.013 0 0012 1zm0 20a9 9 0 119-9 9.011 9.011 0 01-9 9zm5.737-12.176a1 1 0 01-.061 1.413l-6 5.5a1 1 0 01-1.383-.03l-3-3a1 1 0 011.415-1.414l2.323 2.323 5.294-4.853a1 1 0 011.412.061z"></path>
    </svg>
  );
}

export default Icon;
