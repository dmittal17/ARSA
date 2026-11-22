import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        {/* Outer red ring */}
        <div
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "1.5px solid #dc2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        {/* Bold "A" glyph */}
        <div
          style={{
            fontSize: 17,
            fontWeight: 900,
            fontFamily: "Arial Black, Arial, sans-serif",
            color: "#ff2a40",
            lineHeight: 1,
            letterSpacing: "-1px",
            display: "flex",
          }}
        >
          A
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
