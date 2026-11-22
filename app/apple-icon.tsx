import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0c0e15 0%, #1a0005 100%)",
          borderRadius: 36,
        }}
      >
        {/* Outer red ring */}
        <div
          style={{
            position: "absolute",
            width: 158,
            height: 158,
            borderRadius: "50%",
            border: "6px solid #dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        {/* Inner glow ring */}
        <div
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            borderRadius: "50%",
            border: "1px solid rgba(220,38,38,0.3)",
            display: "flex",
          }}
        />
        {/* Bold "A" glyph */}
        <div
          style={{
            fontSize: 90,
            fontWeight: 900,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ff2a40",
            lineHeight: 1,
            letterSpacing: "-4px",
            display: "flex",
            textShadow: "0 0 30px rgba(255,42,64,0.6)",
          }}
        >
          A
        </div>
        {/* "ARSA" text below */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            fontSize: 20,
            fontWeight: 700,
            fontFamily: "Arial, sans-serif",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "6px",
            display: "flex",
          }}
        >
          ARSA
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
