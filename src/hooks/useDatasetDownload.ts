import { useState } from 'react';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import DatasetTokenABI from '@/utils/DatasetTokenABI.json';
import { getFromPinata } from '@/services/pinata';
import { CONTRACT_ADDRESS, RPC_URL } from '@/utils/contractConfig';

export const useDatasetDownload = () => {
    const [downloading, setDownloading] = useState(false);

    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(RPC_URL),
    });

    const downloadDataset = async (tokenId: bigint, userAddress: string) => {
        try {
            setDownloading(true);

            // Check if user owns the token
            const balance = (await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: 'balanceOf',
                args: [userAddress, tokenId],
            })) as bigint;

            if (balance === BigInt(0)) {
                throw new Error("You don't own this dataset");
            }

            // Get the IPFS hash
            const ipfsHash = (await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: 'getDatasetIPFSHash',
                args: [tokenId],
            })) as string;

            // Get the download URL from Pinata
            const downloadUrl = await getFromPinata(ipfsHash);

            // Trigger download
            const response = await fetch(downloadUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dataset-${tokenId}.xlsx`; // You might want to get the actual filename from metadata
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download error:', error);
            throw error;
        } finally {
            setDownloading(false);
        }
    };

    return {
        downloadDataset,
        downloading,
    };
};
