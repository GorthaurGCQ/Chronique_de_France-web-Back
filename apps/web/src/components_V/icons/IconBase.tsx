// =============================================================================
// COMPOSANT — Base SVG outline (24×24)
// =============================================================================

import type { SVGProps, ReactNode } from "react";

type Props = SVGProps<SVGSVGElement> & {
  size?: number;
  children: ReactNode;
};

export default function IconBase({
  size = 24,
  children,
  viewBox = "0 0 24 24",
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 1.75,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  ...rest
}: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      {children}
    </svg>
  );
}
