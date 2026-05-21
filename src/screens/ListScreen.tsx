import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import type { DealInput } from "../types/DealInput";
import { FLAG_MAP, FLAG_FALLBACK } from "../utils/flagMap";

const { fontFamily } = loadFont();
const S = (n: number) => n * (1080 / 390);

type DealData = {
  destination: string; country: string; price: string; original: string;
  imgUrl: string; fromCity: string; stops: string; airlineLogoUrl: string;
};

const STATIC_DEALS: DealData[] = [
  { destination: "Singapore",  country: "",            price: "₹84,560",   original: "₹1,08,900", imgUrl: staticFile("images/figma-singapore.png"),  fromCity: "New Delhi", stops: "direct",  airlineLogoUrl: staticFile("images/airline-air-india.png") },
  { destination: "Seoul",      country: "South Korea", price: "₹1,10,240", original: "₹1,42,800", imgUrl: staticFile("images/figma-seoul.png"),       fromCity: "New Delhi", stops: "1 stop",  airlineLogoUrl: staticFile("images/airline-air-india.png") },
  { destination: "Amsterdam",  country: "Netherlands", price: "₹1,24,800", original: "₹1,58,200", imgUrl: staticFile("images/figma-amsterdam.png"),   fromCity: "New Delhi", stops: "2 stops", airlineLogoUrl: staticFile("images/airline-air-india.png") },
  { destination: "Paris",      country: "France",      price: "₹1,36,200", original: "₹1,72,400", imgUrl: staticFile("images/figma-paris.png"),       fromCity: "New Delhi", stops: "1 stop",  airlineLogoUrl: staticFile("images/airline-air-india.png") },
];

// 54 (status bar) + 12 (pt) + 46 (row) + 8 (pb) = 120
const HEADER_H = S(120);

const DotSep: React.FC = () => (
  <div style={{ width: S(16), height: S(16), flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: S(3), height: S(3), borderRadius: "50%", background: "#C7C7CC" }} />
  </div>
);

const DealCard: React.FC<{ deal: DealData; animFrame: number }> = ({ deal, animFrame }) => {
  const opacity = interpolate(animFrame, [0, 18], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const y = interpolate(animFrame, [0, 22], [S(40), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const scale = interpolate(animFrame, [0, 22], [0.96, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <div style={{
      opacity,
      transform: `translateY(${y}px) scale(${scale})`,
      background: "#FFFFFF",
      border: `${S(1)}px solid #D9D9D9`,
      borderRadius: S(16),
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      flexShrink: 0,
    }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ padding: S(16), display: "flex", flexDirection: "column", gap: S(16) }}>
          {/* Price row */}
          <div style={{ display: "flex", alignItems: "center", gap: S(8) }}>
            <div style={{
              background: "#DEE7FF",
              borderRadius: S(24),
              paddingLeft: S(12), paddingRight: S(12),
              paddingTop: S(8), paddingBottom: S(8),
              display: "inline-flex", alignItems: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: S(14), fontWeight: 600, color: "#615FFF", lineHeight: 1.4, fontFamily, whiteSpace: "nowrap" }}>
                {deal.price}
              </span>
            </div>
            <span style={{ fontSize: S(12), fontWeight: 400, color: "#000000", opacity: 0.5, textDecoration: "line-through", fontFamily, whiteSpace: "nowrap" }}>
              {deal.original}
            </span>
          </div>
          {/* Destination + flight info */}
          <div style={{ display: "flex", flexDirection: "column", gap: S(12) }}>
            <div style={{ display: "flex", flexDirection: "column", gap: S(8) }}>
              <p style={{ margin: 0, fontSize: S(20), fontWeight: 600, color: "#1E1E1E", lineHeight: 1.2, fontFamily }}>{deal.destination}</p>
              <p style={{ margin: 0, fontSize: S(14), fontWeight: 500, color: "#757575", lineHeight: 1, fontFamily, opacity: deal.country ? 1 : 0 }}>
                {deal.country || "placeholder"}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: S(12), fontWeight: 500, color: "#757575", lineHeight: `${S(16)}px`, fontFamily, whiteSpace: "nowrap" }}>
                From {deal.fromCity}
              </span>
              <DotSep />
              <span style={{ fontSize: S(12), fontWeight: 500, color: "#757575", lineHeight: `${S(16)}px`, fontFamily, whiteSpace: "nowrap" }}>{deal.stops}</span>
              <DotSep />
              <div style={{ width: S(16), height: S(16), borderRadius: S(4), overflow: "hidden", flexShrink: 0 }}>
                <Img src={deal.airlineLogoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: S(136), flexShrink: 0, overflow: "hidden", position: "relative", alignSelf: "stretch" }}>
        <Img src={deal.imgUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    </div>
  );
};

export const ListScreen: React.FC<DealInput> = (props) => {
  const frame = useCurrentFrame();

  const featuredDeal: DealData = {
    destination: props.destination,
    country: props.country,
    price: props.price,
    original: props.originalPrice,
    imgUrl: props.destinationImageUrl,
    fromCity: props.departure,
    stops: props.stops,
    airlineLogoUrl: props.airlineLogoUrl,
  };
  const DEALS: DealData[] = [featuredDeal, ...STATIC_DEALS];

  const headerOpacity = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 18], [S(-40), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const filterOpacity = interpolate(frame, [15, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const CARD_START = 18;
  const CARD_STAGGER = 10;
  const listScrollY = interpolate(frame, [CARD_START, CARD_START + 55], [S(180), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#FFFFFF", fontFamily, overflow: "hidden" }}>

      {/* ── Scrollable content area ── */}
      <div style={{ position: "absolute", top: HEADER_H, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", transform: `translateY(${listScrollY}px)` }}>

          {/* Filter chips */}
          <div style={{ opacity: filterOpacity, paddingLeft: S(16), paddingRight: S(8), paddingTop: S(4), paddingBottom: S(8), display: "flex", gap: S(8), alignItems: "center" }}>
            {(["Sort: Latest", "All Classes"] as const).map((label, i) => (
              <div key={i} style={{
                background: "#F2F2F7", borderRadius: S(24),
                paddingLeft: S(16), paddingRight: S(12),
                paddingTop: S(8), paddingBottom: S(8),
                display: "flex", alignItems: "center", gap: S(4), flexShrink: 0,
              }}>
                <span style={{ fontSize: S(13), fontWeight: 590, color: "#000000", letterSpacing: `-${0.08 * (1080 / 390)}px`, lineHeight: `${S(18)}px`, fontFamily, whiteSpace: "nowrap" }}>{label}</span>
                <CaretDown size={S(16)} color="#000000" weight="bold" />
              </div>
            ))}
          </div>

          {/* Deal cards */}
          <div style={{ paddingLeft: S(16), paddingRight: S(16), paddingTop: S(16), paddingBottom: S(24), display: "flex", flexDirection: "column", gap: S(16) }}>
            {DEALS.map((deal, i) => (
              <DealCard
                key={deal.destination}
                deal={deal}
                animFrame={Math.max(0, frame - CARD_START - i * CARD_STAGGER)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Fixed Header ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "#FFFFFF", zIndex: 10, opacity: headerOpacity, transform: `translateY(${headerY}px)` }}>
        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${S(16)}px ${S(24)}px 0`, height: S(54) }}>
          <span style={{ fontSize: S(17), fontWeight: 590, color: "#000000", fontFamily }}>9:41</span>
          <div style={{ display: "flex", alignItems: "center", gap: S(6) }}>
            <svg width={S(19.2)} height={S(12)} viewBox="0 0 19.2 12" fill="#000">
              <rect x="0" y="8" width="3" height="4" rx="0.8" />
              <rect x="4.8" y="5" width="3" height="7" rx="0.8" />
              <rect x="9.6" y="2" width="3" height="10" rx="0.8" />
              <rect x="14.4" y="0" width="3" height="12" rx="0.8" />
            </svg>
            <svg width={S(17)} height={S(12)} viewBox="0 0 17 12" fill="none">
              <circle cx="8.5" cy="10.5" r="1.3" fill="#000" />
              <path d="M4.5 7.2 Q8.5 3.8 12.5 7.2" stroke="#000" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <path d="M1.5 4.5 Q8.5 -0.5 15.5 4.5" stroke="#000" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </svg>
            <svg width={S(27)} height={S(13)} viewBox="0 0 27 13" fill="none">
              <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#000" strokeWidth="1" opacity="0.35" />
              <rect x="24" y="4" width="2.5" height="5" rx="1.5" fill="#000" opacity="0.4" />
              <rect x="2" y="2" width="19" height="9" rx="2.5" fill="#000" />
            </svg>
          </div>
        </div>

        {/* Header content */}
        <div style={{ paddingTop: S(12), paddingBottom: S(8), paddingLeft: S(24), paddingRight: S(24) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: S(46) }}>
            <div style={{ display: "flex", alignItems: "center", gap: S(8), flex: 1, minWidth: 0 }}>
              <div style={{ width: S(32), height: S(32), borderRadius: "50%", overflow: "hidden", border: `${S(1)}px solid rgba(0,0,0,0.12)`, flexShrink: 0 }}>
                <Img src={staticFile(FLAG_MAP[props.userCountryCode] ?? FLAG_FALLBACK)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontSize: S(18), fontWeight: 600, color: "#000000", lineHeight: `${S(24)}px`, fontFamily, whiteSpace: "nowrap" }}>{props.departure}</span>
              <CaretDown size={S(14)} color="#1C1C1E" weight="bold" style={{ flexShrink: 0 }} />
            </div>
            <div style={{ width: S(40), height: S(40), borderRadius: S(32), background: "rgba(0,0,0,0.05)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MagnifyingGlass size={S(20)} color="#000000" weight="regular" />
            </div>
          </div>
        </div>
      </div>

    </AbsoluteFill>
  );
};
