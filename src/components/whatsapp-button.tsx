"use client";

import { MessageCircle } from "lucide-react";
import { whatsappOrderLink } from "@/lib/whatsapp";

export default function WhatsAppButton({
  productName,
  className = "",
  size = "md",
}: {
  productName: string;
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
      onClick={(e) => e.stopPropagation()}
      className={`btn-whatsapp font-semibold ${sizes[size]} ${className}`}
    >
      <MessageCircle size={size === "lg" ? 20 : 16} strokeWidth={2.2} />
      Commander sur WhatsApp
    </a>
  );
}
