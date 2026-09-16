import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { STORE } from "@/lib/constants";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoBuffer = await readFile(join(process.cwd(), "public/logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(155deg, #120d07 0%, #201509 60%, #120d07 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <img
          alt=""
          src={logoSrc}
          width={110}
          height={110}
          style={{ borderRadius: 26, marginBottom: 32 }}
        />
        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: "#faf7f1" }}>
          TechZone&nbsp;<span style={{ color: "#ff5b1f" }}>Bénin</span>
        </div>
        <div style={{ display: "flex", marginTop: 20, fontSize: 30, color: "rgba(250,247,241,0.7)" }}>
          Téléphones · Ordinateurs · Tablettes · Accessoires
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            padding: "16px 36px",
            borderRadius: 999,
            background: "#1fb855",
            color: "#fff",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Commandez directement sur WhatsApp
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 22, color: "rgba(250,247,241,0.45)" }}>
          {STORE.address}
        </div>
      </div>
    ),
    { ...size },
  );
}
