"use client";

import React, { useState } from "react";
import { useDatasetToken } from "../hooks/useDatasetToken";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadToPinata } from "@/services/pinata";
import { parseEther } from "viem";
import toast, { Toast } from "react-hot-toast";

interface MintDatasetTokenProps {
    contentHash: string | null;
    file: File | null;
}

const BASE_EXPLORER_URL = "https://sepolia.basescan.org";

const MintDatasetToken: React.FC<MintDatasetTokenProps> = ({
    contentHash,
    file,
}) => {
    const { mintDatasetToken } = useDatasetToken();
    const { user } = usePrivy();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isMinting, setIsMinting] = useState(false);

    const handleMint = async () => {
        if (
            !user?.wallet?.address ||
            !name ||
            !description ||
            !contentHash ||
            !file ||
            !price
        ) {
            toast.error("Please fill all fields!");
            return;
        }

        const toastId = toast.loading("Uploading to IPFS...");

        try {
            setIsUploading(true);
            // Upload to Pinata
            const ipfsHash = await uploadToPinata(file);

            toast.loading("Minting token...", { id: toastId });
            setIsMinting(true);

            // Mint token
            const receipt = await mintDatasetToken(
                user.wallet.address,
                name,
                description,
                contentHash,
                ipfsHash,
                parseEther(price)
            );

            toast.success(
                (t: Toast) => (
                    <div>
                        Token minted successfully!
                        <a
                            href={`${BASE_EXPLORER_URL}/tx/${receipt.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-2 text-blue-500 hover:underline"
                            onClick={() => toast.dismiss(t.id)}
                        >
                            View on Block Explorer
                        </a>
                    </div>
                ),
                { id: toastId, duration: 5000 }
            );

            // Reset form
            setName("");
            setDescription("");
            setPrice("");
        } catch (error) {
            console.error("Error in mint process:", error);
            toast.error(
                "Error minting token. Please check console for details.",
                { id: toastId }
            );
        } finally {
            setIsUploading(false);
            setIsMinting(false);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Mint Dataset Token</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Dataset Name</Label>
                    <Input
                        id="name"
                        placeholder="Dataset Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price (ETH)</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.001"
                        placeholder="0.1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>

                <div className="text-sm text-gray-600 overflow-x-scroll">
                    Content Hash: {contentHash || "Not available"}
                </div>

                <Button
                    onClick={handleMint}
                    disabled={isUploading || isMinting || !contentHash || !file}
                    className="w-full"
                >
                    {isUploading
                        ? "Uploading to IPFS..."
                        : isMinting
                        ? "Minting..."
                        : "Mint Token"}
                </Button>
            </div>
        </div>
    );
};

export default MintDatasetToken;
