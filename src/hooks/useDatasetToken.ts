import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import DatasetTokenABI from "@/utils/DatasetTokenABI.json";
import { CONTRACT_ADDRESS, RPC_URL } from "@/utils/contractConfig";

export interface OwnershipShare {
    owner: string;
    percentage: number; // Percentage multiplied by 100 (e.g., 33.33% = 3333)
}

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
     * Mint a new dataset token with multiple owners
     */
    const mintDatasetToken = async (
        owners: OwnershipShare[],
        name: string,
        description: string,
        contentHash: string,
        ipfsHash: string,
        price: bigint,
        tags: string[]
    ) => {
        if (
            !owners.length ||
            !name ||
            !description ||
            !contentHash ||
            !ipfsHash ||
            !price ||
            !tags.length
        ) {
            throw new Error("All parameters are required for minting");
        }

        // Validate total percentage equals 100%
        const totalPercentage = owners.reduce(
            (sum, owner) => sum + owner.percentage,
            0
        );
        if (totalPercentage !== 10000) {
            throw new Error("Total ownership percentage must equal 100%");
        }

        const functionData = {
            abi: DatasetTokenABI,
            functionName: "mintDatasetToken",
            args: [
                owners,
                name,
                description,
                contentHash,
                ipfsHash,
                price,
                tags,
            ],
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

    /**
     * Get tokens by tag
     */
    const getTokensByTag = async (tag: string) => {
        try {
            const tokenIds = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: "getTokensByTag",
                args: [tag],
            });
            return tokenIds as bigint[];
        } catch (error) {
            console.error("Failed to get tokens by tag:", error);
            throw error;
        }
    };

    /**
     * Get token owners
     */
    const getTokenOwners = async (tokenId: bigint) => {
        try {
            const owners = await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: "getTokenOwners",
                args: [tokenId],
            });
            return owners as OwnershipShare[];
        } catch (error) {
            console.error("Failed to get token owners:", error);
            throw error;
        }
    };

    return {
        mintDatasetToken,
        getTokenMetadata,
        getTokensByTag,
        getTokenOwners,
    };
};
