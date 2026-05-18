import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlusJakartaSans";
import { ArrowLeft, ArrowsLeftRight, Bag, ShieldCheck, Suitcase } from "@phosphor-icons/react";
import type { DealInput } from "../types/DealInput";

const { fontFamily } = loadFont();
const S = (n: number) => n * (1080 / 390);

type AirportInfo = { code: string; airport: string; city: string; country: string };
const CITY_MAP: Record<string, AirportInfo> = {
  "New Delhi":   { code: "DEL", airport: "Indira Gandhi Int'l", city: "New Delhi",  country: "India"       },
  "Casablanca":  { code: "CMN", airport: "Mohammed V Int'l",    city: "Casablanca", country: "Morocco"     },
  "Singapore":   { code: "SIN", airport: "Changi Airport",      city: "Singapore",  country: "Singapore"   },
  "Seoul":       { code: "ICN", airport: "Incheon Int'l",       city: "Seoul",      country: "South Korea" },
  "Amsterdam":   { code: "AMS", airport: "Amsterdam Schiphol",  city: "Amsterdam",  country: "Netherlands" },
  "Paris":       { code: "CDG", airport: "Charles de Gaulle",   city: "Paris",      country: "France"      },
  "Mumbai":      { code: "BOM", airport: "Chhatrapati Shivaji", city: "Mumbai",     country: "India"       },
  "Bangalore":   { code: "BLR", airport: "Kempegowda Int'l",    city: "Bangalore",  country: "India"       },
  "Dubai":       { code: "DXB", airport: "Dubai Int'l",         city: "Dubai",      country: "UAE"         },
  "London":      { code: "LHR", airport: "Heathrow",            city: "London",     country: "UK"          },
};

function lookupCity(name: string): AirportInfo {
  return CITY_MAP[name] ?? { code: name.slice(0, 3).toUpperCase(), airport: name, city: name, country: "" };
}

function parsePrice(p: string): number {
  return parseInt(p.replace(/[₹,\s]/g, ""), 10) || 0;
}

function makeAnim(frame: number, start: number, end: number, fromY = S(30)) {
  const opacity = interpolate(frame, [start, end], [0, 1], { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const y = interpolate(frame, [start, end], [fromY, 0], { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { opacity, transform: `translateY(${y}px)` };
}

const DashedLine: React.FC = () => (
  <div style={{ flex: 1, height: 0, borderTop: `${S(1)}px dashed #C7C7CC`, minWidth: 0 }} />
);

const SimilarDealRow: React.FC<{
  from: string; to: string; dates: string; meta: string;
  orig: string; price: string; disc: string;
  anim: React.CSSProperties;
}> = ({ from, to, dates, meta, orig, price, disc, anim }) => (
  <div style={{ ...anim, border: `${S(1)}px solid rgba(0,0,0,0.1)`, borderRadius: S(16), padding: S(16), display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: S(4) }}>
      <div style={{ display: "flex", alignItems: "center", gap: S(4) }}>
        <span style={{ fontSize: S(17), fontWeight: 590, color: "#000000", letterSpacing: `-${0.43 * (1080 / 390)}px`, lineHeight: `${S(22)}px`, fontFamily }}>
          {from}
        </span>
        <ArrowsLeftRight size={S(20)} color="#000000" weight="regular" />
        <span style={{ fontSize: S(17), fontWeight: 590, color: "#000000", letterSpacing: `-${0.43 * (1080 / 390)}px`, lineHeight: `${S(22)}px`, fontFamily }}>
          {to}
        </span>
      </div>
      <span style={{ fontSize: S(13), fontWeight: 400, color: "#27262A", opacity: 0.7, letterSpacing: `-${0.08 * (1080 / 390)}px`, lineHeight: `${S(18)}px`, fontFamily }}>{dates}</span>
      <span style={{ fontSize: S(13), fontWeight: 400, color: "#27262A", opacity: 0.7, letterSpacing: `-${0.08 * (1080 / 390)}px`, lineHeight: `${S(18)}px`, fontFamily }}>{meta}</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: S(2), alignItems: "flex-end" }}>
      <div style={{ display: "flex", gap: S(8), alignItems: "baseline" }}>
        <span style={{ fontSize: S(12), color: "#000000", opacity: 0.5, textDecoration: "line-through", lineHeight: `${S(16)}px`, fontFamily }}>{orig}</span>
        <span style={{ fontSize: S(15), fontWeight: 590, color: "#000000", letterSpacing: `-${0.23 * (1080 / 390)}px`, lineHeight: `${S(20)}px`, fontFamily }}>{price}</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.14)", borderRadius: S(66), paddingLeft: S(12), paddingRight: S(12), paddingTop: S(4), paddingBottom: S(4) }}>
        <span style={{ fontSize: S(11), fontWeight: 590, color: "#34C759", letterSpacing: `${0.06 * (1080 / 390)}px`, lineHeight: `${S(13)}px`, fontFamily }}>{disc}</span>
      </div>
    </div>
  </div>
);

export const DetailsScreen: React.FC<DealInput> = (props) => {
  const frame = useCurrentFrame();

  const dep = lookupCity(props.departure);
  const dst = lookupCity(props.destination);

  const origNum  = parsePrice(props.originalPrice);
  const priceNum = parsePrice(props.price);
  const animatedPrice = Math.round(
    interpolate(frame, [20, 50], [origNum, priceNum], { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  const formattedPrice = "₹" + animatedPrice.toLocaleString("en-IN");

  const bgOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const navAnim = makeAnim(frame, 5, 18, S(-15));
  const titleAnim = makeAnim(frame, 10, 28, S(20));
  const subtitleOpacity = interpolate(frame, [18, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const card1Anim = makeAnim(frame, 22, 38);
  const card2Anim = makeAnim(frame, 30, 46);
  const card3Anim = makeAnim(frame, 38, 54);
  const card4Anim = makeAnim(frame, 45, 60, S(20));
  const simAnim1 = makeAnim(frame, 52, 66, S(15));
  const simAnim2 = makeAnim(frame, 60, 74, S(15));
  const simAnim3 = makeAnim(frame, 68, 82, S(15));
  const bottomAnim = makeAnim(frame, 55, 70, S(40));

  // Verified pill: Phase 1 — pill background opens from centre outward (clipPath inset)
  // Phase 2 — icon + text appear inside once pill is open
  const pillClip = interpolate(frame, [32, 44], [50, 0], {
    easing: Easing.bezier(0.34, 1.4, 0.64, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const pillOpacity = interpolate(frame, [30, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const contentOpacity = interpolate(frame, [44, 54], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const iconX = interpolate(frame, [44, 54], [S(-8), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const textX = interpolate(frame, [46, 56], [S(8), 0], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const WHITE_CARD: React.CSSProperties = { background: "#FFFFFF", borderRadius: S(16), overflow: "hidden" };

  return (
    <AbsoluteFill style={{ fontFamily, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "#F2F2F7", opacity: bgOpacity }} />

      {/* ── Status bar ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
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
      </div>

      {/* ── Back button ── */}
      <div style={{ ...navAnim, position: "absolute", left: S(16), top: S(64), zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ArrowLeft size={S(24)} color="#000000" weight="regular" />
      </div>

      {/* ── Title area ── */}
      <div style={{ position: "absolute", left: S(56), right: S(56), top: S(78), zIndex: 10, display: "flex", flexDirection: "column", gap: S(16), textAlign: "center", alignItems: "center" }}>
        <p style={{ ...navAnim, margin: 0, fontSize: S(15), fontWeight: 400, color: "#000000", letterSpacing: `-${0.23 * (1080 / 390)}px`, lineHeight: `${S(20)}px`, fontFamily }}>
          Trip to
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: S(8) }}>
          <p style={{ ...titleAnim, margin: 0, fontSize: S(28), fontWeight: 700, color: "#000000", letterSpacing: `${0.38 * (1080 / 390)}px`, lineHeight: `${S(34)}px`, fontFamily }}>
            {props.destination}
          </p>
          <p style={{ margin: 0, fontSize: S(15), fontWeight: 400, color: "#000000", letterSpacing: `-${0.23 * (1080 / 390)}px`, lineHeight: `${S(20)}px`, opacity: subtitleOpacity, fontFamily }}>
            {props.country || dst.country}
          </p>
        </div>
      </div>

      {/* ── Verified pill — centered, below title ── */}
      <div style={{
        position: "absolute", top: S(184), left: 0, right: 0, zIndex: 10,
        display: "flex", justifyContent: "center",
        opacity: pillOpacity,
      }}>
        {/* Pill background opens from centre via clipPath */}
        <div style={{
          background: "#DEE7FF",
          borderRadius: S(24),
          paddingLeft: S(12), paddingRight: S(12),
          paddingTop: S(8), paddingBottom: S(8),
          display: "flex", alignItems: "center", gap: S(8),
          clipPath: `inset(0 ${pillClip}% round ${S(24)}px)`,
        }}>
          {/* Shield icon slides in from left */}
          <div style={{ opacity: contentOpacity, transform: `translateX(${iconX}px)`, flexShrink: 0, display: "flex", alignItems: "center" }}>
            <ShieldCheck size={S(20)} color="#615FFF" weight="fill" />
          </div>
          {/* Text slides in from right */}
          <span style={{
            opacity: contentOpacity,
            transform: `translateX(${textX}px)`,
            fontSize: S(14), fontWeight: 600, color: "#615FFF",
            fontFamily, whiteSpace: "nowrap", lineHeight: 1.4,
          }}>
            Deal Verified Today
          </span>
        </div>
      </div>

      {/* ── Cards area ── */}
      <div style={{ position: "absolute", top: S(236), left: S(16), right: S(16), bottom: S(86), overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: S(8) }}>

          {/* Card 1: Airline / Date & Seating */}
          <div style={{ ...card1Anim, ...WHITE_CARD }}>
            <div style={{ padding: S(16), display: "flex", gap: S(16), alignItems: "center" }}>
              <div style={{ width: S(48), height: S(48), borderRadius: S(4), overflow: "hidden", background: "#000000", flexShrink: 0 }}>
                <Img src={staticFile("emirates.png")} style={{ width: "100%", height: "107%", objectFit: "cover", objectPosition: "top" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: S(8) }}>
                <span style={{ fontSize: S(11), fontWeight: 400, color: "#8E8E93", letterSpacing: `${0.06 * (1080 / 390)}px`, lineHeight: `${S(13)}px`, fontFamily }}>
                  Date &amp; Seating
                </span>
                <span style={{ fontSize: S(15), fontWeight: 590, color: "#27262A", letterSpacing: `-${0.23 * (1080 / 390)}px`, lineHeight: `${S(20)}px`, fontFamily }}>
                  {props.airlineName} &nbsp;•&nbsp; {props.travelClass}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Depart / Return */}
          <div style={{ ...card2Anim, ...WHITE_CARD }}>
            <div style={{ padding: S(24), display: "flex", flexDirection: "column", gap: S(16) }}>
              <span style={{ fontSize: S(13), fontWeight: 400, color: "#000000", letterSpacing: `-${0.08 * (1080 / 390)}px`, lineHeight: `${S(18)}px`, fontFamily }}>Depart</span>
              {/* From --- 1 stop --- To */}
              <div style={{ display: "flex", alignItems: "center", gap: S(9) }}>
                <span style={{ fontSize: S(12), color: "#27262A", letterSpacing: `${0.4 * (1080 / 390)}px`, lineHeight: `${S(16)}px`, fontFamily, whiteSpace: "nowrap" }}>From</span>
                <DashedLine />
                <span style={{ fontSize: S(12), color: "#27262A", letterSpacing: `${0.4 * (1080 / 390)}px`, lineHeight: `${S(16)}px`, fontFamily, whiteSpace: "nowrap" }}>{props.stops}</span>
                <DashedLine />
                <span style={{ fontSize: S(12), color: "#27262A", letterSpacing: `${0.4 * (1080 / 390)}px`, lineHeight: `${S(16)}px`, fontFamily, whiteSpace: "nowrap" }}>To</span>
              </div>
              {/* Airport codes */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: S(4) }}>
                  <span style={{ fontSize: S(28), fontWeight: 700, color: "#000000", letterSpacing: `${0.38 * (1080 / 390)}px`, lineHeight: `${S(34)}px`, fontFamily }}>{dep.code}</span>
                  <div style={{ fontSize: S(12), color: "#8E8E93", lineHeight: `${S(16)}px`, fontFamily }}>
                    <div>{dep.city}</div>
                    <div>{dep.airport}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: S(4), alignItems: "flex-end" }}>
                  <span style={{ fontSize: S(28), fontWeight: 700, color: "#000000", letterSpacing: `${0.38 * (1080 / 390)}px`, lineHeight: `${S(34)}px`, fontFamily }}>{dst.code}</span>
                  <div style={{ fontSize: S(12), color: "#8E8E93", lineHeight: `${S(16)}px`, textAlign: "right", fontFamily }}>
                    <div>{dst.city}</div>
                    <div>{dst.airport}</div>
                  </div>
                </div>
              </div>

              <span style={{ fontSize: S(13), fontWeight: 400, color: "#000000", letterSpacing: `-${0.08 * (1080 / 390)}px`, lineHeight: `${S(18)}px`, fontFamily }}>Return</span>
              {/* From --- 1 stop --- To */}
              <div style={{ display: "flex", alignItems: "center", gap: S(9) }}>
                <span style={{ fontSize: S(12), color: "#27262A", letterSpacing: `${0.4 * (1080 / 390)}px`, lineHeight: `${S(16)}px`, fontFamily, whiteSpace: "nowrap" }}>From</span>
                <DashedLine />
                <span style={{ fontSize: S(12), color: "#27262A", letterSpacing: `${0.4 * (1080 / 390)}px`, lineHeight: `${S(16)}px`, fontFamily, whiteSpace: "nowrap" }}>{props.stops}</span>
                <DashedLine />
                <span style={{ fontSize: S(12), color: "#27262A", letterSpacing: `${0.4 * (1080 / 390)}px`, lineHeight: `${S(16)}px`, fontFamily, whiteSpace: "nowrap" }}>To</span>
              </div>
              {/* Airport codes */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: S(4) }}>
                  <span style={{ fontSize: S(28), fontWeight: 700, color: "#000000", letterSpacing: `${0.38 * (1080 / 390)}px`, lineHeight: `${S(34)}px`, fontFamily }}>{dst.code}</span>
                  <div style={{ fontSize: S(12), color: "#8E8E93", lineHeight: `${S(16)}px`, fontFamily }}>
                    <div>{dst.city}</div>
                    <div>{dst.airport}</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: S(4), alignItems: "flex-end" }}>
                  <span style={{ fontSize: S(28), fontWeight: 700, color: "#000000", letterSpacing: `${0.38 * (1080 / 390)}px`, lineHeight: `${S(34)}px`, fontFamily }}>{dep.code}</span>
                  <div style={{ fontSize: S(12), color: "#8E8E93", lineHeight: `${S(16)}px`, textAlign: "right", fontFamily }}>
                    <div>{dep.city}</div>
                    <div>{dep.airport}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Included Baggage */}
          <div style={{ ...card3Anim, ...WHITE_CARD }}>
            <div style={{ padding: S(16), display: "flex", flexDirection: "column", gap: S(16) }}>
              <span style={{ fontSize: S(15), fontWeight: 590, color: "#000000", letterSpacing: `-${0.23 * (1080 / 390)}px`, lineHeight: `${S(20)}px`, fontFamily }}>Included Baggage</span>
              <div style={{ display: "flex", gap: S(24), alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: S(8) }}>
                  <Bag size={S(24)} color="#000000" weight="regular" />
                  <span style={{ fontSize: S(13), fontWeight: 510, color: "#000000", letterSpacing: `-${0.08 * (1080 / 390)}px`, lineHeight: `${S(18)}px`, fontFamily }}>Carry On x 1</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: S(8) }}>
                  <Suitcase size={S(24)} color="#000000" weight="regular" />
                  <span style={{ fontSize: S(13), fontWeight: 510, color: "#000000", letterSpacing: `-${0.08 * (1080 / 390)}px`, lineHeight: `${S(18)}px`, fontFamily }}>Check In x 2</span>
                </div>
              </div>
              <span style={{ fontSize: S(12), fontStyle: "italic", color: "#3A3A3C", opacity: 0.7, lineHeight: `${S(16)}px`, fontFamily }}>
                Confirm it once before booking the ticket
              </span>
            </div>
          </div>

          {/* Similar Deals */}
          <div style={card4Anim}>
            <div style={{ paddingLeft: S(16), paddingRight: S(16), paddingTop: S(16), paddingBottom: 0 }}>
              <span style={{ fontSize: S(15), fontWeight: 590, color: "#000000", letterSpacing: `-${0.23 * (1080 / 390)}px`, lineHeight: `${S(20)}px`, fontFamily }}>Similar Deals</span>
            </div>
            <div style={{ paddingTop: S(16), display: "flex", flexDirection: "column", gap: S(8) }}>
              <SimilarDealRow from="Delhi"   to="New York"  dates="Jul - Sep" meta="Economy • 1 stop" orig="₹1,28,298" price="₹54,240" disc="64% off" anim={simAnim1} />
              <SimilarDealRow from="Mumbai"  to="Abu Dhabi" dates="Jul - Sep" meta="Economy • 1 stop" orig="₹1,28,298" price="₹54,240" disc="64% off" anim={simAnim2} />
              <SimilarDealRow from="Kolkata" to="Seattle"   dates="Jul - Sep" meta="Economy • 1 stop" orig="₹1,28,298" price="₹54,240" disc="64% off" anim={simAnim3} />
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        ...bottomAnim,
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        background: "#FFFFFF",
        boxShadow: `0 ${-S(2)}px ${S(2)}px rgba(0,0,0,0.08)`,
        paddingTop: S(12),
        paddingBottom: S(24),
        paddingLeft: S(16),
        paddingRight: S(16),
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 10,
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: S(2) }}>
          <div style={{ display: "flex", gap: S(8), alignItems: "flex-end" }}>
            <span style={{ fontSize: S(17), fontWeight: 700, color: "#06952B", letterSpacing: `-${0.43 * (1080 / 390)}px`, lineHeight: `${S(22)}px`, fontFamily }}>{formattedPrice}</span>
            <span style={{ fontSize: S(17), fontWeight: 400, color: "#3A3A3C", opacity: 0.5, textDecoration: "line-through", letterSpacing: `-${0.43 * (1080 / 390)}px`, lineHeight: `${S(22)}px`, fontFamily }}>{props.originalPrice}</span>
          </div>
          <span style={{ fontSize: S(12), fontStyle: "italic", color: "#3A3A3C", opacity: 0.7, lineHeight: `${S(16)}px`, fontFamily }}>Deal lasts 4 days</span>
        </div>
        <div style={{ background: "#007AFF", borderRadius: S(8), paddingLeft: S(28), paddingRight: S(28), paddingTop: S(14), paddingBottom: S(14) }}>
          <span style={{ fontSize: S(17), fontWeight: 400, color: "#FFFFFF", letterSpacing: `-${0.43 * (1080 / 390)}px`, lineHeight: `${S(22)}px`, fontFamily }}>Book Deal</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
