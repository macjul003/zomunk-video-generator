import { useState } from "react";
import { ListScreen } from "../src/screens/ListScreen";
import { DetailsScreen } from "../src/screens/DetailsScreen";
import type { DealInput } from "../src/types/DealInput";
import { DealForm } from "./DealForm";
import { useObjectUrl } from "./useObjectUrl";

const DEFAULT_DEAL: DealInput = {
  destinationImageUrl: "/images/figma-casablanca.png",
  destination: "Casablanca",
  country: "Morocco",
  departure: "New Delhi",
  price: "₹98,240",
  originalPrice: "₹1,28,298",
  months: "Jan, Mar - Jun",
  stops: "1 stop",
  travelClass: "Economy",
  travelPeriod: "Sept – Dec 2026",
  airlineLogoUrl: "/images/airline-air-india.png",
  airlineName: "Emirates",
  userCountry: "India",
  userCountryCode: "IN",
};

const SCALE = 390 / 1080;
const W = 390;
const H = Math.round(390 * (1920 / 1080));

function PhonePreview({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</p>
      <div style={{
        borderRadius: 40, overflow: "hidden", width: W, height: H, flexShrink: 0,
        boxShadow: "0 0 0 1.5px rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.7)",
      }}>
        <div style={{ width: 1080, height: 1920, transformOrigin: "top left", transform: `scale(${SCALE})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ToolApp() {
  const [deal, setDeal] = useState<DealInput>(DEFAULT_DEAL);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [airlineLogoFile, setAirlineLogoFile] = useState<File | null>(null);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageUrl = useObjectUrl(imageFile);
  const airlineLogoUrl = useObjectUrl(airlineLogoFile);
  const inputProps: DealInput = {
    ...deal,
    destinationImageUrl: imageUrl ?? deal.destinationImageUrl,
    airlineLogoUrl: airlineLogoUrl ?? deal.airlineLogoUrl,
  };

  async function handleRender() {
    setRendering(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("deal", JSON.stringify(inputProps));
      if (imageFile) fd.append("destImage", imageFile);
      if (airlineLogoFile) fd.append("airlineLogo", airlineLogoFile);

      const renderUrl = `http://${window.location.hostname}:3003/render`;
      const res = await fetch(renderUrl, { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `zomunk-${deal.destination.toLowerCase().replace(/\s+/g, "-")}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Render failed");
    } finally {
      setRendering(false);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Left panel: form */}
      <div style={{
        width: 420, flexShrink: 0, padding: "32px 28px",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column", gap: 32,
        overflowY: "auto",
      }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px" }}>Zomunk Video Generator</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Fill in the deal details and render your reel</p>
        </div>

        <DealForm
          deal={deal}
          onChange={(patch) => setDeal((d) => ({ ...d, ...patch }))}
          imageFile={imageFile}
          onImageChange={setImageFile}
          airlineLogoFile={airlineLogoFile}
          onAirlineLogoChange={setAirlineLogoFile}
        />

        {error && (
          <p style={{ fontSize: 13, color: "#ff6b6b", background: "rgba(255,80,80,0.1)", padding: "10px 14px", borderRadius: 8 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleRender}
          disabled={rendering}
          style={{
            background: rendering ? "rgba(255,255,255,0.05)" : "#fff",
            color: rendering ? "rgba(255,255,255,0.3)" : "#000",
            border: "none",
            borderRadius: 10,
            padding: "14px 24px",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: rendering ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {rendering ? "Rendering… (~30s)" : "Render Video"}
        </button>
      </div>

      {/* Right panel: live preview */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "flex-start",
        gap: 40, padding: "40px 32px", overflowY: "auto",
      }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", alignSelf: "flex-start" }}>
          Preview
        </p>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
          <PhonePreview label="List">
            <ListScreen {...inputProps} />
          </PhonePreview>
          <PhonePreview label="Details">
            <DetailsScreen {...inputProps} />
          </PhonePreview>
        </div>
      </div>

    </div>
  );
}
