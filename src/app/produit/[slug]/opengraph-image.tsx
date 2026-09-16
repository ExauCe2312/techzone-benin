import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/lib/data";
import { formatFCFA } from "@/lib/format";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const image = product?.images?.[0];

  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "#120d07", color: "#faf7f1", fontSize: 48, fontWeight: 800, fontFamily: "sans-serif",
          }}
        >
          TechZone Bénin
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "sans-serif",
          background: "#faf7f1",
        }}
      >
        <div style={{ width: image ? "50%" : "0%", height: "100%", display: "flex" }}>
          {image ? (
            <img src={image} alt="" width={600} height={630} style={{ objectFit: "cover" }} />
          ) : null}
        </div>
        <div
          style={{
            width: image ? "50%" : "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 56px",
            background: "linear-gradient(155deg, #120d07 0%, #201509 100%)",
          }}
        >
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: "#ff5b1f", textTransform: "uppercase" }}>
            {product.subcategoryLabel}
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 46, fontWeight: 800, color: "#faf7f1", lineHeight: 1.15 }}>
            {product.name}
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 44, fontWeight: 800, color: "#ff5b1f" }}>
            {formatFCFA(product.price)}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              padding: "14px 28px",
              borderRadius: 999,
              background: "#1fb855",
              color: "#fff",
              fontSize: 22,
              fontWeight: 700,
              width: "fit-content",
            }}
          >
            Commander sur WhatsApp
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
