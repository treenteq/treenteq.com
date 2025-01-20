import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import DatasetTokenABI from "@/utils/DatasetTokenABI.json";
import { CONTRACT_ADDRESS, RPC_URL } from "@/utils/contractConfig";

// Viem configuration
const PRIVATE_KEY = (process.env.NEXT_PUBLIC_CONTRACT_OWNER_PRIVATE_KEY ||
    "") as `0x${string}`;

const walletClient = createWalletClient({
    account: privateKeyToAccount(PRIVATE_KEY),
    chain: baseSepolia,
    transport: http(RPC_URL),
});

const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
});

export const useDatasetToken = () => {
    /**
     * Mint a new dataset token
     */
    const mintDatasetToken = async (
        creator: string,
        name: string,
        description: string,
        contentHash: string,
        ipfsHash: string,
        price: bigint
    ) => {
        if (
            !creator ||
            !name ||
            !description ||
            !contentHash ||
            !ipfsHash ||
            !price
        ) {
            throw new Error("All parameters are required for minting");
        }

        const functionData = {
            abi: DatasetTokenABI,
            functionName: "mintDatasetToken",
            args: [creator, name, description, contentHash, ipfsHash, price],
        };

        try {
            const tx = await walletClient.writeContract({
                address: CONTRACT_ADDRESS,
                ...functionData,
            });
            console.log("Mint transaction submitted:", tx);
            const receipt = await publicClient.waitForTransactionReceipt({
                hash: tx,
            });
            console.log("Mint transaction confirmed:", receipt);
            return receipt;
        } catch (error) {
            console.error("Minting failed:", error);
            throw error;
        }
    };

    /**
     * Get token metadata
     */
    const getTokenMetadata = async (tokenId: bigint) => {
        try {
            const metadata = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: "tokenMetadata",
                args: [tokenId],
            });
            console.log("Token metadata:", metadata);
            return metadata;
        } catch (error) {
            console.error("Failed to get token metadata:", error);
            throw error;
        }
    };

    return { mintDatasetToken, getTokenMetadata };
};
