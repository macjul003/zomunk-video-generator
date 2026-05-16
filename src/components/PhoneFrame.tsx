import React from "react";
import { AbsoluteFill } from "remotion";

const W = 1080;
const H = 1920;

// Corner radius used for content clipping in Composition.tsx — must match
export const PHONE_CORNER_R = 122;

// Dynamic Island dimensions
const DI_W = 332;
const DI_H = 96;
const DI_TOP = 16;

// SVG phone frame overlay — sits on top of all screen content
export const PhoneFrame: React.FC = () => (
  <AbsoluteFill style={{ zIndex: 200, pointerEvents: "none" }}>
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Outer phone body edge — dark border defines the phone shape */}
      <rect
        x={2} y={2}
        width={W - 4} height={H - 4}
        rx={PHONE_CORNER_R + 6} ry={PHONE_CORNER_R + 6}
        fill="none"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth={8}
      />

      {/* Inner screen rim — subtle highlight gives glass-like depth */}
      <rect
        x={9} y={9}
        width={W - 18} height={H - 18}
        rx={PHONE_CORNER_R} ry={PHONE_CORNER_R}
        fill="none"
        stroke="rgba(255,255,255,0.13)"
        strokeWidth={4}
      />

      {/* Dynamic Island — centered pill at top */}
      <rect
        x={(W - DI_W) / 2}
        y={DI_TOP}
        width={DI_W}
        height={DI_H}
        rx={DI_H / 2}
        ry={DI_H / 2}
        fill="#000"
      />

      {/* Dynamic Island — inner gloss hint */}
      <rect
        x={(W - DI_W) / 2 + 24}
        y={DI_TOP + 8}
        width={90}
        height={14}
        rx={7}
        fill="rgba(255,255,255,0.06)"
      />
    </svg>
  </AbsoluteFill>
);
