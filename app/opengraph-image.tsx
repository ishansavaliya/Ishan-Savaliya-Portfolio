import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ishan Savaliya — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(120% 120% at 75% 15%, #3a2b6b 0%, #1b1d4e 45%, #0a0c1f 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9aa3b2",
          }}
        >
          Ishan OS · Portfolio
        </div>
        <div style={{ fontSize: 84, fontWeight: 800, marginTop: 16 }}>
          Ishan Savaliya
        </div>
        <div style={{ fontSize: 40, color: "#ff4d8d", marginTop: 8 }}>
          Full-Stack Developer
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#c2c8d4",
            marginTop: 28,
            maxWidth: 900,
          }}
        >
          React · Next.js · Spring Boot · Java · Node.js · PostgreSQL · AWS
        </div>
        <div style={{ fontSize: 24, color: "#7dd3a0", marginTop: 40 }}>
          www.ishansavaliya.me
        </div>
      </div>
    ),
    { ...size }
  );
}
