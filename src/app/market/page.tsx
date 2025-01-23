/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import {
    createPublicClient,
    createWalletClient,
    http,
    formatEther,
    custom,
} from "viem";
import { baseSepolia } from "viem/chains";
import DatasetTokenABI from "@/utils/DatasetTokenABI.json";
import Link from "next/link";
import { CONTRACT_ADDRESS, RPC_URL } from "@/utils/contractConfig";
import { Download } from "lucide-react";
import toast, { Toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import BackgroundAnimation from "@/components/background-animation";
import Image from "next/image";

interface DatasetMetadata {
    name: string;
    description: string;
    contentHash: string;
    ipfsHash: string;
    price: bigint;
    creator: string;
}

interface TokenData {
    tokenId: bigint;
    metadata: DatasetMetadata;
    balance: bigint;
}

const BASE_EXPLORER_URL = "https://sepolia.basescan.org";

const downloadFromPinata = async (ipfsHash: string, filename: string) => {
    const toastId = toast.loading("Downloading dataset...");
    try {
        const response = await fetch(
            `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
        );
        if (!response.ok) throw new Error("Failed to fetch file from Pinata");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Dataset downloaded successfully!", { id: toastId });
    } catch (error) {
        console.error("Download error:", error);
        toast.error("Failed to download the dataset. Please try again.", {
            id: toastId,
        });
    }
};

const DatasetCard: React.FC<{
    token: TokenData;
    onPurchase: (tokenId: bigint, price: bigint) => Promise<void>;
    isOwner: boolean;
}> = ({ token, onPurchase, isOwner }) => {
    if (!token?.metadata) {
        return null; // Don't render invalid cards
    }

    const handleDownload = async () => {
        const filename = `${token.metadata.name.replace(
            /[^a-zA-Z0-9]/g,
            "_"
        )}.zip`;
        await downloadFromPinata(token.metadata.ipfsHash, filename);
    };

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold">
                            {token.metadata.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                            ID: {token.tokenId.toString()}
                        </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2">
                        {token.metadata.description}
                    </p>

                    <div className="flex justify-between items-center pt-2">
                        <div className="text-lg font-bold">
                            {formatEther(token.metadata.price)} ETH
                        </div>
                        {!isOwner && (
                            <Button
                                onClick={() =>
                                    onPurchase(
                                        token.tokenId,
                                        token.metadata.price
                                    )
                                }
                                variant="default"
                            >
                                Purchase
                            </Button>
                        )}
                        {isOwner && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-green-600 font-medium">
                                    You own this
                                </span>
                                <Button
                                    onClick={handleDownload}
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-gray-500 truncate">
                        Creator: {token.metadata.creator}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Market() {
    const { ready, authenticated, login, user } = usePrivy();
    const { wallets } = useWallets();
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(RPC_URL),
    });

    const handlePurchase = async (tokenId: bigint, price: bigint) => {
        if (!authenticated || !user?.wallet?.address) {
            toast.error("Please connect your wallet first");
            return;
        }

        const toastId = toast.loading("Processing purchase...");

        try {
            // Get the active wallet
            const activeWallet = wallets[0]; // Usually the first wallet is the active one
            if (!activeWallet) {
                throw new Error("No wallet connected");
            }

            // Switch to Base Sepolia
            await activeWallet.switchChain(baseSepolia.id);

            // Get the provider from the wallet
            const provider = await activeWallet.getEthereumProvider();

            // Create wallet client using Privy's provider
            const walletClient = createWalletClient({
                account: user.wallet.address as `0x${string}`,
                chain: baseSepolia,
                transport: custom(provider),
            });

            // Call the purchase function on the contract
            const hash = await walletClient.writeContract({
                address: CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: "purchaseDataset",
                args: [tokenId],
                value: price,
            });

            const receipt = await publicClient.waitForTransactionReceipt({
                hash,
            });

            toast.success(
                (t: Toast) => (
                    <div>
                        Purchase successful! You can now access the dataset.
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

            // Refresh the token list
            window.location.reload();
        } catch (error) {
            console.error("Purchase error:", error);
            if (error instanceof Error) {
                toast.error(`Error purchasing dataset: ${error.message}`, {
                    id: toastId,
                });
            } else {
                toast.error(
                    "Error purchasing dataset. Check console for details.",
                    {
                        id: toastId,
                    }
                );
            }
        }
    };

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                setError(null);
                console.log("Fetching tokens from contract:", CONTRACT_ADDRESS);

                const totalTokens = (await publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: DatasetTokenABI,
                    functionName: "getTotalTokens",
                })) as bigint;

                console.log("Total tokens:", totalTokens.toString());

                if (totalTokens === BigInt(0)) {
                    setTokens([]);
                    setLoading(false);
                    return;
                }

                const tokenPromises = [];
                for (let i = BigInt(0); i < totalTokens; i = i + BigInt(1)) {
                    tokenPromises.push(
                        (async () => {
                            try {
                                // Get metadata - it comes as an array from the contract
                                const metadataArray =
                                    (await publicClient.readContract({
                                        address: CONTRACT_ADDRESS,
                                        abi: DatasetTokenABI,
                                        functionName: "tokenMetadata",
                                        args: [i],
                                    })) as [
                                        string,
                                        string,
                                        string,
                                        string,
                                        bigint,
                                        string
                                    ];

                                console.log(
                                    `Raw metadata for token ${i}:`,
                                    metadataArray
                                );

                                // Convert array to object
                                const metadata = {
                                    name: metadataArray[0],
                                    description: metadataArray[1],
                                    contentHash: metadataArray[2],
                                    ipfsHash: metadataArray[3],
                                    price: metadataArray[4],
                                    creator: metadataArray[5],
                                };

                                console.log(
                                    `Parsed metadata for token ${i}:`,
                                    metadata
                                );

                                // Get balance if user is authenticated
                                const balance =
                                    authenticated && user?.wallet?.address
                                        ? ((await publicClient.readContract({
                                              address: CONTRACT_ADDRESS,
                                              abi: DatasetTokenABI,
                                              functionName: "balanceOf",
                                              args: [user.wallet.address, i],
                                          })) as bigint)
                                        : BigInt(0);

                                return {
                                    metadata,
                                    balance,
                                };
                            } catch (error) {
                                console.error(
                                    `Error fetching token ${i}:`,
                                    error
                                );
                                return null;
                            }
                        })()
                    );
                }

                const tokensData = await Promise.all(tokenPromises);
                const formattedTokens = tokensData
                    .map((data, index) => {
                        if (!data) return null;
                        const { metadata, balance } = data;

                        // Basic validation
                        if (
                            !metadata ||
                            typeof metadata.name !== "string" ||
                            !metadata.price
                        ) {
                            console.error(
                                `Invalid metadata for token ${index}:`,
                                metadata
                            );
                            return null;
                        }

                        return {
                            tokenId: BigInt(index),
                            metadata: {
                                name: metadata.name,
                                description: metadata.description,
                                contentHash: metadata.contentHash,
                                ipfsHash: metadata.ipfsHash,
                                price: metadata.price,
                                creator: metadata.creator,
                            },
                            balance,
                        };
                    })
                    .filter((token): token is TokenData => token !== null);

                console.log("Final formatted tokens:", formattedTokens);
                setTokens(formattedTokens);
            } catch (error) {
                console.error("Error fetching tokens:", error);
                setError(
                    "Failed to load marketplace data. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        if (ready) {
            fetchTokens();
        }
    }, [ready, authenticated, user?.wallet?.address, publicClient]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Left side background */}
                <div className="absolute left-0 top-0 w-2/5 h-full">
                    <div className="absolute inset-0 bg-[url('/background.svg')] bg-left bg-no-repeat opacity-30 transform scale-150 animate-float-left bg-svg" />
                </div>
                {/* Center background pattern */}
                <div className="absolute left-1/3 right-1/3 top-0 h-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00A340]/5 to-transparent" />
                </div>
                {/* Right side background */}
                <div className="absolute -right-1/4 -top-1/4 w-2/3 h-full">
                    <div className="absolute inset-0 bg-[url('/background.svg')] bg-right bg-no-repeat opacity-30 transform scale-150 rotate-90 animate-float-right bg-svg" />
                </div>
            </div>

            <BackgroundAnimation />

            {/* Header */}
            <header className="relative z-10 flex justify-between items-center p-6">
                <div className="logo">
                    <Link href="/">
                        <Image 
                            src="/treenteq-logo.png" 
                            alt="TREENTEQ Logo" 
                            width={200} 
                            height={200}
                            priority 
                        />
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/listing">
                        <Button
                            variant="default"
                            className="bg-[#00A340] text-white hover:bg-[#00A340] transition-colors duration-300"
                        >
                            List your data
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-6 pt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        Data Marketplace
                    </h1>
                    
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <Link
                                href="/"
                                className="text-white hover:text-gray-300"
                            >
                                ← Back to Upload
                            </Link>
                            {ready && !authenticated ? (
                                <Button onClick={login}>Connect Wallet</Button>
                            ) : null}
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-300">
                                Browse and purchase tokenized datasets
                            </p>
                        </div>

                        {error ? (
                            <div className="text-center py-8 text-red-500">{error}</div>
                        ) : loading ? (
                            <div className="text-center py-8">Loading datasets...</div>
                        ) : tokens.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No datasets available yet
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tokens.map((token) => (
                                    <DatasetCard
                                        key={token.tokenId.toString()}
                                        token={token}
                                        onPurchase={handlePurchase}
                                        isOwner={token.balance > BigInt(0)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
