import { ImageResponse } from "next/og";

export const alt = "Nyaysaathi — Advocates & Legal Consultants";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%", height: "100%", background: "#F7F4EE", color: "#171717", padding: "80px", borderBottom: "16px solid #5A1824" }}>
      <div style={{ display: "flex", fontSize: 26, color: "#5A1824", marginBottom: 30 }}>ADVOCATES & LEGAL CONSULTANTS</div>
      <div style={{ display: "flex", fontSize: 100, marginBottom: 24 }}>Nyaysaathi</div>
      <div style={{ display: "flex", fontSize: 34 }}>Legal consultation for individuals, families & businesses</div>
      <div style={{ display: "flex", fontSize: 26, color: "#68645E", marginTop: 50 }}>nyaysaathi.in</div>
    </div>, size,
  );
}
