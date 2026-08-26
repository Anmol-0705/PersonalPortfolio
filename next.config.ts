import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zlipdsnwsxvfiwnyzfxn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // This network resolves *.supabase.co to NAT64-synthesized IPv6
    // addresses (64:ff9b::/96, mapping to real public IPv4 addresses —
    // Cloudflare, which fronts Supabase Storage). Next 16's SSRF guard
    // misclassifies that prefix as a private/local address and blocks
    // the fetch with a 400. remotePatterns above already restricts
    // fetches to this one Supabase hostname+path, so this isn't opening
    // up arbitrary local-network access — it's working around a false
    // positive in the private-IP heuristic for a real public endpoint.
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
