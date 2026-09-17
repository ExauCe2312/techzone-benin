"use client";

import { MessageCircle } from "lucide-react";
import { whatsappOrderLink } from "@/lib/whatsapp";
import { trackWhatsAppContact } from "@/lib/meta-pixel";

export default function WhatsAppButton({
  productName,
  price,
  category,
  className = "",
  size = "md",
}: {
  productName: string;
  price?: number;
  category?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "px-3.5 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  return (
    <a
      href={whatsappOrderLink(productName)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.stopPropagation();
        trackWhatsAppContact({ productName, price, category });
      }}
      className={`btn-whatsapp font-semibold ${sizes[size]} ${className}`}
    >
      <MessageCircle size={size === "lg" ? 20 : 16} strokeWidth={2.2} />
      Commander sur WhatsApp
    </a>
  );
}
