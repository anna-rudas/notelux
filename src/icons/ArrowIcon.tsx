import React from "react";

function Icon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      aria-hidden="true"
      viewBox="0 0 14 14"
      {...props}
    >
      <path d="M13 6.697q0 .428-.285.728L7.701 12.7Q7.4 13 7 13q-.408 0-.693-.3L1.293 7.426Q1 7.134 1 6.697q0-.43.293-.737l.57-.607q.3-.3.7-.3.409 0 .694.3l2.264 2.38V2.035q0-.421.293-.729Q6.107 1 6.507 1h.986q.4 0 .693.307.293.308.293.729v5.696l2.264-2.379q.285-.3.693-.3.401 0 .701.3l.578.607q.285.316.285.737z"></path>
    </svg>
  );
}

export default Icon;
