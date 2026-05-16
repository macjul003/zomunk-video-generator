import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";

const { fontFamily } = loadFont();
const S = (n: number) => n * (1080 / 390);

export const ClosingScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const iconScale = interpolate(frame, [5, 32], [0.5, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const iconOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const line1Opacity = interpolate(frame, [22, 38], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const line1Y = interpolate(frame, [22, 38], [S(30), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const line2Opacity = interpolate(frame, [30, 46], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const line2Y = interpolate(frame, [30, 46], [S(20), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const btnOpacity = interpolate(frame, [42, 60], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const btnY = interpolate(frame, [42, 60], [S(40), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const urlOpacity = interpolate(frame, [55, 70], [0, 0.6], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      {/* Full purple gradient background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, #4C1D95 0%, #6D28D9 35%, #7C3AED 60%, #A78BFA 100%)",
          opacity: bgOpacity,
        }}
      />

      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 900px 900px at 50% 45%, rgba(167, 139, 250, 0.25) 0%, transparent 70%)",
          opacity: bgOpacity,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 64px",
          zIndex: 1,
        }}
      >
        {/* App icon */}
        <div
          style={{
            opacity: iconOpacity,
            transform: `scale(${iconScale})`,
            marginBottom: 56,
          }}
        >
          <div
            style={{
              width: 330,
              height: 330,
              borderRadius: 72,
              overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.2)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
            }}
          >
            <Img src={staticFile("zomunk-logo.svg")} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>

        {/* "zomunk" wordmark */}
        <div
          style={{
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 96, fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.05em", lineHeight: 1 }}>
            zomunk
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
            marginBottom: 80,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 400, color: "rgba(255,255,255,0.8)", lineHeight: 1.4, letterSpacing: "-0.01em" }}>
            Curated roundtrip flight deals
            <br />
            that save you lakhs
          </div>
        </div>

        {/* CTA button */}
        <div
          style={{
            opacity: btnOpacity,
            transform: `translateY(${btnY}px)`,
            width: "100%",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 999,
              height: 140,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 42, fontWeight: 700, color: "#7C3AED", letterSpacing: "-0.01em" }}>
              Download the App
            </span>
          </div>
        </div>

        {/* URL */}
        <div style={{ opacity: urlOpacity }}>
          <span style={{ fontSize: 30, color: "rgba(255,255,255,0.8)", letterSpacing: "0.02em" }}>
            zomunk.com
          </span>
        </div>
      </div>

      {/* Home indicator */}
      <div style={{ position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)", width: 160, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.4)", zIndex: 2 }} />
    </AbsoluteFill>
  );
};
