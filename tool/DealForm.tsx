import React, { useRef } from "react";
import type { DealInput } from "../src/types/DealInput";

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#1a1a1a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "12px 14px",
  color: "#fff",
  fontSize: 15,
  fontFamily: "inherit",
  outline: "none",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "rgba(255,255,255,0.4)",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 6,
  display: "block",
};

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <select style={selectStyle} value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.4)", pointerEvents: "none", fontSize: 12 }}>▾</span>
      </div>
    </div>
  );
}

function ImageUpload({ label, file, onFileChange, height = 120 }: {
  label: string; file: File | null; onFileChange: (f: File | null) => void; height?: number;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) onFileChange(f);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={labelStyle}>{label}</label>
      <div
        onClick={() => ref.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: "1.5px dashed rgba(255,255,255,0.15)", borderRadius: 12, height,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 8, cursor: "pointer", overflow: "hidden",
          background: file ? "#1a1a1a" : "transparent", position: "relative",
        }}
      >
        {file ? (
          <img src={URL.createObjectURL(file)} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
        ) : (
          <>
            <span style={{ fontSize: 22, opacity: 0.3 }}>↑</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "0 8px" }}>Drop or click to upload</span>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)} />
    </div>
  );
}

export function DealForm({ deal, onChange, imageFile, onImageChange, airlineLogoFile, onAirlineLogoChange }: {
  deal: DealInput;
  onChange: (patch: Partial<DealInput>) => void;
  imageFile: File | null;
  onImageChange: (f: File | null) => void;
  airlineLogoFile: File | null;
  onAirlineLogoChange: (f: File | null) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Images */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 88px", gap: 12, alignItems: "end" }}>
        <ImageUpload label="Destination Image" file={imageFile} onFileChange={onImageChange} height={120} />
        <ImageUpload label="Airline Logo" file={airlineLogoFile} onFileChange={onAirlineLogoChange} height={88} />
      </div>

      {/* Destination + Country */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Destination" value={deal.destination} onChange={(v) => onChange({ destination: v })} placeholder="Casablanca" />
        <Field label="Country" value={deal.country} onChange={(v) => onChange({ country: v })} placeholder="Morocco" />
      </div>

      {/* Departure */}
      <Field label="Departure City" value={deal.departure} onChange={(v) => onChange({ departure: v })} placeholder="New Delhi" />

      {/* Price + Original Price */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Price" value={deal.price} onChange={(v) => onChange({ price: v })} placeholder="₹98,240" />
        <Field label="Original Price" value={deal.originalPrice} onChange={(v) => onChange({ originalPrice: v })} placeholder="₹1,28,298" />
      </div>

      {/* Stops + Travel Class */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <SelectField label="Stops" value={deal.stops} onChange={(v) => onChange({ stops: v })} options={["direct", "1 stop", "2 stops"]} />
        <SelectField label="Travel Class" value={deal.travelClass} onChange={(v) => onChange({ travelClass: v })} options={["Economy", "Business", "First"]} />
      </div>

      {/* Travel Period + Months */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Travel Period" value={deal.travelPeriod} onChange={(v) => onChange({ travelPeriod: v })} placeholder="Sept – Dec 2026" />
        <Field label="Travel Months" value={deal.months} onChange={(v) => onChange({ months: v })} placeholder="Jan, Mar - Jun" />
      </div>

      {/* Airline Name */}
      <Field label="Airline Name" value={deal.airlineName} onChange={(v) => onChange({ airlineName: v })} placeholder="Air India" />

    </div>
  );
}
