import React from "react";

function Icon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      className="cf-icon-svg"
      viewBox="-3 0 19 19"
      {...props}
    >
      <path d="M12.517 12.834v1.9a1.27 1.27 0 01-1.267 1.267h-9.5a1.27 1.27 0 01-1.267-1.267v-1.9A3.176 3.176 0 013.65 9.667h5.7a3.176 3.176 0 013.167 3.167zM3.264 5.48A3.236 3.236 0 116.5 8.717a3.236 3.236 0 01-3.236-3.236z"></path>
    </svg>
  );
}

export default Icon;
