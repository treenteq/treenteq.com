"use client";

import React, { useState } from "react";
import { useDatasetToken, OwnershipShare } from "../hooks/useDatasetToken";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadToPinata } from "@/services/pinata";
import { parseEther } from "viem";
import toast, { Toast } from "react-hot-toast";
import { X, Plus } from "lucide-react";

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

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isMinting, setIsMinting] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [owners, setOwners] = useState<OwnershipShare[]>([
        { owner: "", percentage: 0 },
    ]);

    const addOwner = () => {
        setOwners([...owners, { owner: "", percentage: 0 }]);
    };

    const removeOwner = (index: number) => {
        if (owners.length > 1) {
            const newOwners = [...owners];
            newOwners.splice(index, 1);
            setOwners(newOwners);
        }
    };

    const updateOwner = (
        index: number,
        field: keyof OwnershipShare,
        value: string | number
    ) => {
        const newOwners = [...owners];
        if (field === "percentage") {
            // Convert percentage to basis points (e.g., 33.33% = 3333)
            const basisPoints = Math.round(parseFloat(value as string) * 100);
            newOwners[index][field] = basisPoints;
        } else {
            newOwners[index][field] = value as string;
        }
        setOwners(newOwners);
    };

    const addTag = () => {
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setNewTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const validateOwners = () => {
        const totalPercentage = owners.reduce(
            (sum, owner) => sum + owner.percentage,
            0
        );
        if (Math.abs(totalPercentage - 10000) > 1) {
            // Allow for small rounding errors
            throw new Error(
                `Total ownership must equal 100% (currently ${
                    totalPercentage / 100
                }%)`
            );
        }
        if (owners.some((owner) => !owner.owner)) {
            throw new Error("All owner addresses must be filled");
        }
    };

    const handleMint = async () => {
        if (!contentHash || !file || !price || !tags.length) {
            toast.error("Please fill all fields and add at least one tag!");
            return;
        }

        try {
            validateOwners();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
            return;
        }

        const toastId = toast.loading("Uploading to IPFS...");

        try {
            setIsUploading(true);
            // Upload to Pinata
            const ipfsHash = await uploadToPinata(file);

            toast.loading("Minting token...", { id: toastId });
            setIsMinting(true);

            // Mint token with multiple owners
            const receipt = await mintDatasetToken(
                owners,
                name,
                description,
                contentHash,
                ipfsHash,
                parseEther(price),
                tags
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
            setTags([]);
            setOwners([{ owner: "", percentage: 0 }]);
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
            <h2 className="mint-token-title">Mint Dataset Token</h2>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                        Dataset Name
                    </Label>
                    <Input
                        id="name"
                        placeholder="Dataset Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-black placeholder-gray-400"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">
                        Description
                    </Label>
                    <Input
                        id="description"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="text-black placeholder-gray-400"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-white">Dataset Owners</Label>
                    {owners.map((owner, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <Input
                                placeholder="Owner Address"
                                value={owner.owner}
                                onChange={(e) =>
                                    updateOwner(index, "owner", e.target.value)
                                }
                                className="text-black placeholder-gray-400"
                            />
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="Ownership %"
                                value={owner.percentage / 100}
                                onChange={(e) =>
                                    updateOwner(
                                        index,
                                        "percentage",
                                        e.target.value
                                    )
                                }
                                className="text-black placeholder-gray-400 w-32"
                            />
                            {owners.length > 1 && (
                                <Button
                                    // variant="outline"
                                    // size="icon"
                                    onClick={() => removeOwner(index)}
                                    className="flex-shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button
                        // variant="outline"
                        onClick={addOwner}
                        className="mt-2"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Owner
                    </Button>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price" className="text-white">
                        Price (ETH)
                    </Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.001"
                        placeholder="0.1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="text-black placeholder-gray-400"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-white">Tags</Label>
                    <div className="flex gap-2 flex-wrap mb-2">
                        {tags.map((tag) => (
                            <div
                                key={tag}
                                className="bg-[#00A340] text-white px-2 py-1 rounded-full flex items-center gap-1"
                            >
                                {tag}
                                <button
                                    onClick={() => removeTag(tag)}
                                    className="hover:text-red-200"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addTag()}
                            className="text-black placeholder-gray-400"
                        />
                        <Button
                            // variant="outline"
                            onClick={addTag}
                            disabled={!newTag}
                        >
                            Add
                        </Button>
                    </div>
                </div>

                <div className="text-sm text-gray-400 overflow-x-scroll">
                    Content Hash: {contentHash || "Not available"}
                </div>

                <Button
                    onClick={handleMint}
                    disabled={isUploading || isMinting || !contentHash || !file}
                    className={`w-full ${
                        name && description && price && tags.length > 0
                            ? "bg-[#00A340] text-white"
                            : "bg-gray-500 text-gray-300"
                    } hover:bg-[#009030] transition-colors duration-300`}
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
