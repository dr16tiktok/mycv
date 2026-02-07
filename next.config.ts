import type { NextConfig } from "next";

const isGhPages = process.env.DEPLOY_TARGET === "gh-pages";

const nextConfig: NextConfig = {
  ...(isGhPages ? { output: "export" } : {}),
  ...(isGhPages ? { trailingSlash: true } : {}),
  images: {
    unoptimized: isGhPages,
  },
  basePath: isGhPages ? "/mycv" : "",
  assetPrefix: isGhPages ? "/mycv/" : "",
};

export default nextConfig;
