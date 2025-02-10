const getRequiredEnvVar = (
    name: 'NEXT_PUBLIC_CONTRACT_ADDRESS' | 'NEXT_PUBLIC_RPC_URL',
): string => {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

    if (!contractAddress) {
        throw new Error(
            'Missing required environment variable: NEXT_PUBLIC_CONTRACT_ADDRESS',
        );
    }
    if (!rpcUrl) {
        throw new Error(
            'Missing required environment variable: NEXT_PUBLIC_RPC_URL',
        );
    }

    return name === 'NEXT_PUBLIC_CONTRACT_ADDRESS' ? contractAddress : rpcUrl;
};

export const CONTRACT_ADDRESS = getRequiredEnvVar(
    'NEXT_PUBLIC_CONTRACT_ADDRESS',
) as `0x${string}`;

export const RPC_URL = getRequiredEnvVar('NEXT_PUBLIC_RPC_URL');
