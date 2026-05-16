import React from "react";
import { createRoot } from "react-dom/client";
import { SplashScreen } from "./screens/SplashScreen";
import { ListScreen } from "./screens/ListScreen";
import { DetailsScreen } from "./screens/DetailsScreen";
import { ClosingScreen } from "./screens/ClosingScreen";
import type { DealInput } from "./types/DealInput";

const SCALE = 390 / 1080;

const DEFAULT_PROPS: DealInput = {
  destinationImageUrl: "/figma-casablanca.png",
  destination: "Casablanca",
  departure: "New Delhi",
  price: "₹98,240",
  originalPrice: "₹1,28,298",
  months: "Jan, Mar - Jun",
};

const screens = [
  { label: "Splash",  component: SplashScreen,  hasProps: false },
  { label: "List",    component: ListScreen,     hasProps: true },
  { label: "Details", component: DetailsScreen,  hasProps: true },
  { label: "Closing", component: ClosingScreen,  hasProps: false },
];

function PhoneFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ flexShrink: 0 }}>
      <p style={{ color: "#fff", marginBottom: 10, fontSize: 13, opacity: 0.5, letterSpacing: "0.05em", textTransform: "uppercase" }}>
        {label}
      </p>
      <div style={{ borderRadius: 44, overflow: "hidden", boxShadow: "0 0 0 2px rgba(255,255,255,0.08), 0 24px 64px rgba(0,0,0,0.6)", width: 390, height: Math.round(390 * (1920 / 1080)) }}>
        <div style={{ width: 1080, height: 1920, transformOrigin: "top left", transform: `scale(${SCALE})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ display: "flex", gap: 32, padding: 32, overflowX: "auto", minHeight: "100vh", alignItems: "flex-start" }}>
      {screens.map(({ label, component: Screen, hasProps }) => (
        <PhoneFrame key={label} label={label}>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Screen {...(hasProps ? DEFAULT_PROPS : {}) as any} />
        </PhoneFrame>
      ))}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
