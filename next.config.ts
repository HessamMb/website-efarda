import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const basePath = githubPages ? "/website-efarda" : "";

const nextConfig: NextConfig = {
  ...(githubPages ? { output: "export", trailingSlash: true } : {}),
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: { unoptimized: githubPages },
  experimental: { agentFeedback: true },
  cacheComponents: !githubPages,
  partialPrefetching: !githubPages,
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
