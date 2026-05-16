import React from "react";

export const useCurrentFrame = () => 999;

export const useVideoConfig = () => ({
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 999,
});

type ExtrapolateType = "clamp" | "extend" | "wrap" | "identity";

export function interpolate(
  input: number,
  inputRange: [number, number],
  outputRange: [number, number],
  options?: { extrapolateLeft?: ExtrapolateType; extrapolateRight?: ExtrapolateType; easing?: (t: number) => number }
): number {
  const [inMin, inMax] = inputRange;
  const [outMin, outMax] = outputRange;
  const extrapolateRight = options?.extrapolateRight ?? "extend";
  const extrapolateLeft = options?.extrapolateLeft ?? "extend";

  let t = (input - inMin) / (inMax - inMin);

  if (t < 0) {
    if (extrapolateLeft === "clamp") t = 0;
  } else if (t > 1) {
    if (extrapolateRight === "clamp") t = 1;
  }

  if (options?.easing) t = options.easing(Math.max(0, Math.min(1, t)));

  return outMin + t * (outMax - outMin);
}

export const Easing = {
  bezier: (_x1: number, _y1: number, _x2: number, _y2: number) => (t: number) => t,
  linear: (t: number) => t,
  ease: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

export const AbsoluteFill: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ style, ...props }) =>
  React.createElement("div", {
    ...props,
    style: { position: "absolute", inset: 0, ...style },
  });

export const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) =>
  React.createElement("img", props);

export const staticFile = (path: string) => `/${path}`;

export const Sequence: React.FC<{ from?: number; durationInFrames?: number; children?: React.ReactNode }> = ({ children }) =>
  React.createElement(React.Fragment, null, children);
