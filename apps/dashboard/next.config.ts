import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/supabase"],
  async rewrites() {
    return [
      {
        source: "/games/spyfall/:path*",
        destination: `${process.env.SPYFALL_URL ?? "http://localhost:3001"}/games/spyfall/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
