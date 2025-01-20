import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        PRIVY_APP_ID: process.env.PRIVY_APP_ID,
        PINATA_JWT: process.env.PINATA_JWT,
        PINATA_API_KEY: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        PINATA_SECRET_KEY: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
        NEXT_PUBLIC_CONTRACT_OWNER_PRIVATE_KEY:
            process.env.NEXT_PUBLIC_CONTRACT_OWNER_PRIVATE_KEY,
    },
    /* config options here */
};

export default nextConfig;
