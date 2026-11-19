import type { NextConfig } from "next";

if (process.env.GITHUB_PAGES === "true") {
  throw new Error("The posts dashboard uses a Next.js server and cannot be exported to GitHub Pages.");
}

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  images: { qualities: [75, 90] },
  experimental: {
    agentFeedback: true,
    serverActions: { bodySizeLimit: "24mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
