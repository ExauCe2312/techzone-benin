import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Photos produits envoyées via l'outil admin, stockées sur Supabase Storage.
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
