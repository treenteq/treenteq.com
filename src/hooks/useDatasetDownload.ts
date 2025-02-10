/* eslint-disable @typescript-eslint/no-explicit-any */
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

            // Get the metadata to determine file type
            const metadata = (await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: 'tokenMetadata',
                args: [tokenId],
            })) as any;

            // Get the IPFS hash
            const ipfsHash = metadata[3]; // ipfsHash is at index 3

            // Get the download URL from Pinata
            const downloadUrl = await getFromPinata(ipfsHash);

            // Download and process the file
            const response = await fetch(downloadUrl);
            const blob = await response.blob();

            // Check if this is a Twitter dataset (JSON file)
            const isTwitterData =
                metadata[0].includes('twitter dataset') ||
                metadata[1].includes('tweet history');

            let finalBlob: Blob;
            let filename: string;

            if (isTwitterData) {
                // For Twitter data, keep it as JSON
                finalBlob = blob;
                filename = `twitter_data_${tokenId}.json`;
            } else {
                // For legacy data, ensure we get the raw file
                const contentType = blob.type;
                if (
                    contentType.includes('spreadsheet') ||
                    contentType.includes('csv')
                ) {
                    finalBlob = blob;
                    filename = `dataset_${tokenId}${contentType.includes('csv') ? '.csv' : '.xlsx'}`;
                } else {
                    // If content type is not recognized, default to xlsx
                    finalBlob = blob;
                    filename = `dataset_${tokenId}.xlsx`;
                }
            }

            // Trigger download
            const url = window.URL.createObjectURL(finalBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
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
