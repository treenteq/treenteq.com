/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useDatasetToken } from "../hooks/useDatasetToken";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadToPinata } from "@/services/pinata";
import { parseEther } from "viem";

interface MintDatasetTokenProps {
    contentHash: string | null;
    file: File | null;
}

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
            alert("Please fill all fields!");
            return;
        }

        try {
            setIsUploading(true);
            // Upload to Pinata
            const ipfsHash = await uploadToPinata(file);

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

            console.log("Token minted successfully:", receipt);
            alert("Token minted successfully!");

            // Reset form
            setName("");
            setDescription("");
            setPrice("");
        } catch (error) {
            console.error("Error in mint process:", error);
            alert("Error in minting process. Check console for details.");
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

                <div className="text-sm text-gray-600">
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
