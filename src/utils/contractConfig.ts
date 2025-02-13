const getRequiredEnvVar = (
    name: 'NEXT_PUBLIC_DATASET_TOKEN_CONTRACT_ADDRESS' | 'NEXT_PUBLIC_RPC_URL',
): string => {
    const datasetTokenContractAddress =
        process.env.NEXT_PUBLIC_DATASET_TOKEN_CONTRACT_ADDRESS;
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

    if (!datasetTokenContractAddress) {
        throw new Error(
            'Missing required environment variable: NEXT_PUBLIC_DATASET_TOKEN_CONTRACT_ADDRESS',
        );
    }

    if (!rpcUrl) {
        throw new Error(
            'Missing required environment variable: NEXT_PUBLIC_RPC_URL',
        );
    }

    return name === 'NEXT_PUBLIC_DATASET_TOKEN_CONTRACT_ADDRESS'
        ? datasetTokenContractAddress
        : rpcUrl;
};

export const DATASET_CONTRACT_ADDRESS = getRequiredEnvVar(
    'NEXT_PUBLIC_DATASET_TOKEN_CONTRACT_ADDRESS',
) as `0x${string}`;

export const RPC_URL = getRequiredEnvVar('NEXT_PUBLIC_RPC_URL');
