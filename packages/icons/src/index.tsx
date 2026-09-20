import * as React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;

export function CheckIcon(props: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 16 16"
      width="16"
      {...props}
    >
      <path d="m3 8 3 3 7-7" />
    </svg>
  );
}
