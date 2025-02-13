import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    env: {
        PRIVY_APP_ID: process.env.PRIVY_APP_ID,
        PINATA_JWT: process.env.PINATA_JWT,
        PINATA_API_KEY: process.env.NEXT_PUBLIC_PINATA_API_KEY,
        PINATA_SECRET_KEY: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY,
        NEXT_PUBLIC_CONTRACT_OWNER_PRIVATE_KEY:
            process.env.NEXT_PUBLIC_CONTRACT_OWNER_PRIVATE_KEY,
        NEXT_PUBLIC_RECLAIM_APP_ID: process.env.NEXT_PUBLIC_RECLAIM_APP_ID,
        NEXT_PUBLIC_RECLAIM_APP_SECRET:
            process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET,
        NEXT_PUBLIC_RECLAIM_TWITTER_PROVIDER_ID:
            process.env.NEXT_PUBLIC_RECLAIM_TWITTER_PROVIDER_ID,
        NEXT_PUBLIC_DATASET_TOKEN_CONTRACT_ADDRESS:
            process.env.NEXT_PUBLIC_DATASET_TOKEN_CONTRACT_ADDRESS,
        NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    },
    /* config options here */
};

export default nextConfig;
