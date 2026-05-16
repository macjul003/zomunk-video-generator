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
      <input
        style={inputStyle}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function DealForm({ deal, onChange, imageFile, onImageChange }: {
  deal: DealInput;
  onChange: (patch: Partial<DealInput>) => void;
  imageFile: File | null;
  onImageChange: (f: File | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) onImageChange(f);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Image upload */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label style={labelStyle}>Destination Image</label>
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={{
            border: "1.5px dashed rgba(255,255,255,0.15)",
            borderRadius: 12,
            height: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            cursor: "pointer",
            overflow: "hidden",
            background: imageFile ? "#1a1a1a" : "transparent",
            position: "relative",
          }}
        >
          {imageFile ? (
            <img
              src={URL.createObjectURL(imageFile)}
              style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
            />
          ) : (
            <>
              <span style={{ fontSize: 28, opacity: 0.3 }}>↑</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                Drop image or click to upload
              </span>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={(e) => onImageChange(e.target.files?.[0] ?? null)} />
      </div>

      {/* Two-column row: destination + departure */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Destination" value={deal.destination} onChange={(v) => onChange({ destination: v })} placeholder="Casablanca" />
        <Field label="Departure" value={deal.departure} onChange={(v) => onChange({ departure: v })} placeholder="New Delhi" />
      </div>

      {/* Two-column row: price + original price */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Price" value={deal.price} onChange={(v) => onChange({ price: v })} placeholder="₹98,240" />
        <Field label="Original Price" value={deal.originalPrice} onChange={(v) => onChange({ originalPrice: v })} placeholder="₹1,28,298" />
      </div>

      <Field label="Travel Months" value={deal.months} onChange={(v) => onChange({ months: v })} placeholder="Jan, Mar - Jun" />

    </div>
  );
}
