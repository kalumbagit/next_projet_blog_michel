import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "f003.backblazeb2.com",
        pathname: "/file/**",
      },
    ],
    localPatterns: [
      // Thumbnails dynamiques
      {
        // un segment dynamique obligatoire
        pathname: "/lib/routes/thumail/:id",
      },
      // Vidéos dynamiques
      {
        pathname: "/lib/routes/video/:id",
      },
      // Profil (optionnel)
      {
        pathname: "/lib/routes/profil",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
};

export default nextConfig;
