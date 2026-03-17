import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/games/spyfall",
  transpilePackages: ["@repo/ui", "@repo/game-common", "@repo/supabase"],
};

export default nextConfig;
