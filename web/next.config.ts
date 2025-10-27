import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: 'removeViewBox', active: false },
                { name: 'removeDimensions', active: true },
              ],
            },
            titleProp: true,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
