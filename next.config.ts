import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        PRIVY_APP_ID: process.env.PRIVY_APP_ID,
    },
    /* config options here */
};

export default nextConfig;
