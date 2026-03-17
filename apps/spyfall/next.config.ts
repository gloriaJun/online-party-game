import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  basePath: "/games/spyfall",
  transpilePackages: ["@repo/ui", "@repo/game-common", "@repo/supabase"],
};

export default withNextIntl(nextConfig);
