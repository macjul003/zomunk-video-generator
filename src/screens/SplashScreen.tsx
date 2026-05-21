import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import type { DealInput } from "../types/DealInput";
import { FLAG_MAP, FLAG_FALLBACK } from "../utils/flagMap";

const { fontFamily } = loadFont();
const S = (n: number) => n * (1080 / 390);

const REEL_BASE = [
  { name: "United Arab Emirates", code: "AE" },
  { name: "United States",        code: "US" },
  { name: "Singapore",            code: "SG" },
  { name: "Australia",            code: "AU" },
  { name: "Japan",                code: "JP" },
  { name: "Philippines",          code: "PH" },
  { name: "China",                code: "CN" },
];

// Figma: status bar icons are white on the purple gradient
const StatusBar: React.FC = () => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${S(16)}px ${S(24)}px 0`, height: S(56), width: "100%" }}>
    <span style={{ fontSize: S(17), fontWeight: 590, color: "white", fontFamily, letterSpacing: 0 }}>9:41</span>
    <div style={{ display: "flex", alignItems: "center", gap: S(6) }}>
      {/* Cellular: 4 bars */}
      <svg width={S(19.2)} height={S(12)} viewBox="0 0 19.2 12" fill="white">
        <rect x="0" y="8" width="3" height="4" rx="0.8" />
        <rect x="4.8" y="5" width="3" height="7" rx="0.8" />
        <rect x="9.6" y="2" width="3" height="10" rx="0.8" />
        <rect x="14.4" y="0" width="3" height="12" rx="0.8" />
      </svg>
      {/* Wifi */}
      <svg width={S(17)} height={S(12)} viewBox="0 0 17 12" fill="none">
        <circle cx="8.5" cy="10.5" r="1.3" fill="white" />
        <path d="M4.5 7.2 Q8.5 3.8 12.5 7.2" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M1.5 4.5 Q8.5 -0.5 15.5 4.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      </svg>
      {/* Battery */}
      <svg width={S(27)} height={S(13)} viewBox="0 0 27 13" fill="none">
        <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="white" strokeWidth="1" opacity="0.35" />
        <rect x="24" y="4" width="2.5" height="5" rx="1.5" fill="white" opacity="0.4" />
        <rect x="2" y="2" width="19" height="9" rx="2.5" fill="white" />
      </svg>
    </div>
  </div>
);

type SplashProps = Pick<DealInput, "userCountry" | "userCountryCode">;

export const SplashScreen: React.FC<SplashProps> = ({ userCountry, userCountryCode }) => {
  const frame = useCurrentFrame();

  // Background fade in
  const bgOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Logo spring pop
  const iconScale = interpolate(frame, [5, 32], [0.5, 1], {
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const iconOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Title + subtitle slide up
  const contentOpacity = interpolate(frame, [20, 38], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const contentY = interpolate(frame, [20, 38], [S(20), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Country selector fade + slide
  const countryOpacity = interpolate(frame, [42, 58], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const countryY = interpolate(frame, [42, 58], [S(20), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  // Slot-machine reel: spin through other countries, land on configured one
  const others = REEL_BASE.filter((c) => c.code !== userCountryCode);
  const sequence = [...others, ...others.slice(0, 3), { name: userCountry, code: userCountryCode }];
  const ITEM_H = S(36);
  const SPIN_START = 58;
  const SPIN_END = 148; // 90 frames = 3 s
  const reelY = interpolate(frame, [SPIN_START, SPIN_END], [0, -(sequence.length - 1) * ITEM_H], {
    easing: Easing.out(Easing.poly(3)),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Button slide up
  const btnOpacity = interpolate(frame, [46, 64], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const btnY = interpolate(frame, [46, 64], [S(30), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const legalOpacity = interpolate(frame, [58, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Figma gradient: #8159DC → white at 53.365% */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #8159DC 0%, #FFFFFF 53.365%)", opacity: bgOpacity }} />

      {/* Status bar — shrink-0 */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", flexShrink: 0 }}>
        <StatusBar />
      </div>

      {/* Wrapper spacer — flex-1, matches Figma "wrapper" frame h=306 */}
      <div style={{ flex: 1, zIndex: 1 }} />

      {/* Logo: 120×120 in Figma, bg #7C01E7, rounded-20, shadow */}
      <div style={{ opacity: iconOpacity, transform: `scale(${iconScale})`, position: "relative", zIndex: 1, flexShrink: 0 }}>
        <div style={{ width: S(120), height: S(120), borderRadius: S(20), overflow: "hidden", background: "#7C01E7", boxShadow: `0 ${S(8)}px ${S(30)}px rgba(124,1,231,0.45)` }}>
          <Img src={staticFile("icons/zomunk-logo.svg")} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      {/* Content: title + subtitle + dots — gap-16, px-20, py-32 */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: S(16),
          padding: `${S(32)}px ${S(20)}px`,
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
        }}
      >
        {/* Title + subtitle */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: S(8), width: "100%", textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: S(22), fontWeight: 700, color: "#000000", lineHeight: `${S(28)}px`, letterSpacing: `-${0.26 * (1080 / 390)}px`, whiteSpace: "nowrap", fontFamily }}>
            Welcome to Zomunk
          </p>
          <p style={{ margin: 0, fontSize: S(16), fontWeight: 400, color: "#000000", lineHeight: `${S(24)}px`, letterSpacing: `${0.5 * (1080 / 390)}px`, fontFamily }}>
            Discover Curated Roundtrip Flight Deals That Save You Lakhs
          </p>
        </div>

      </div>

      {/* Country selector — cycling pill */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: S(16),
          paddingBottom: S(32),
          paddingLeft: S(20),
          paddingRight: S(20),
          opacity: countryOpacity,
          transform: `translateY(${countryY}px)`,
        }}
      >
        <p style={{ margin: 0, fontSize: S(12), fontWeight: 500, color: "#868686", textAlign: "center", lineHeight: "1", fontFamily, whiteSpace: "nowrap" }}>
          Select Your Country
        </p>

        {/* Pill — slot machine reel */}
        <div style={{
          display: "flex",
          alignItems: "center",
          border: `${S(2)}px solid #2c2c2c`,
          borderRadius: 9999,
          paddingLeft: S(8),
          paddingRight: S(16),
          paddingTop: S(8),
          paddingBottom: S(8),
          overflow: "hidden",
        }}>
          {/* Reel window: shows exactly one row, clips overflow */}
          <div style={{ position: "relative", height: ITEM_H, overflow: "hidden" }}>
            {/* Invisible spacer — locks window width to the widest entry */}
            <div style={{ visibility: "hidden", display: "flex", alignItems: "center", gap: S(8) }}>
              <div style={{ width: S(36), height: S(36), flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: S(16), fontWeight: 600, fontFamily, whiteSpace: "nowrap" }}>United Arab Emirates</p>
            </div>
            {/* Scrolling reel */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", transform: `translateY(${reelY}px)` }}>
              {sequence.map((country, idx) => (
                <div key={`${country.code}-${idx}`} style={{ height: ITEM_H, display: "flex", alignItems: "center", gap: S(8) }}>
                  <Img
                    src={staticFile(FLAG_MAP[country.code] ?? FLAG_FALLBACK)}
                    style={{ width: S(36), height: S(36), borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                  />
                  <p style={{ margin: 0, fontSize: S(16), fontWeight: 600, color: "#000", lineHeight: `${S(24)}px`, fontFamily, whiteSpace: "nowrap" }}>
                    {country.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Button section — w-350 container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flexShrink: 0,
          width: S(350),
          opacity: btnOpacity,
          transform: `translateY(${btnY}px)`,
          display: "flex",
          flexDirection: "column",
          gap: S(8),
        }}
      >
        {/* Black CTA button: py-20, rounded-8 */}
        <div style={{ background: "#000000", borderRadius: S(8), paddingTop: S(20), paddingBottom: S(20), display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: S(16), fontWeight: 590, color: "#FFFFFF", letterSpacing: `-${0.31 * (1080 / 390)}px`, lineHeight: `${S(21)}px`, fontFamily }}>
            Get Started
          </span>
        </div>

        {/* Legal text */}
        <p style={{ margin: 0, opacity: legalOpacity, fontSize: S(8), fontWeight: 510, color: "rgba(60,60,67,0.6)", textAlign: "center", lineHeight: `${S(12)}px`, letterSpacing: `-${0.2 * (1080 / 390)}px`, fontFamily }}>
          {`By  clicking "Get Started", you acknowledge that you have read and understood, and agree to Zomunk's Terms & Conditions & Privacy Policy.`}
        </p>
      </div>

      {/* Home indicator: h=21, bar 139×5 at bottom 8px */}
      <div style={{ position: "relative", zIndex: 1, height: S(21), width: "100%", flexShrink: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: S(8) }}>
        <div style={{ width: S(139), height: S(5), borderRadius: S(100), background: "#000000" }} />
      </div>
    </AbsoluteFill>
  );
};
