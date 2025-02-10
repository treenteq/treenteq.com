/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import {
    createPublicClient,
    createWalletClient,
    http,
    formatEther,
    custom,
    Chain,
    defineChain,
} from 'viem';
import { baseSepolia } from 'viem/chains';
import DatasetTokenABI from '@/utils/DatasetTokenABI.json';
import Link from 'next/link';
import { CONTRACT_ADDRESS, RPC_URL } from '@/utils/contractConfig';
import { Download, Search, SlidersHorizontal, Tag } from 'lucide-react';
import toast, { Toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import BackgroundAnimation from '@/components/background-animation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { OwnershipShare } from '@/hooks/useDatasetToken';
import { FaArrowLeft } from 'react-icons/fa6';
import { Card } from '@/components/ui/card';
import { IoSearchSharp } from 'react-icons/io5';
import { useDatasetDownload } from '@/hooks/useDatasetDownload';

interface RawMetadata extends Array<string | bigint> {
    0: string; // name
    1: string; // description
    2: string; // contentHash
    3: string; // ipfsHash
    4: bigint; // price
}

interface DatasetMetadata {
    name: string;
    description: string;
    contentHash: string;
    ipfsHash: string;
    price: bigint;
    tags: string[];
    owners: OwnershipShare[];
}

interface TokenData {
    tokenId: bigint;
    metadata: DatasetMetadata;
    balance: bigint;
}

const BASE_EXPLORER_URL = 'https://sepolia.basescan.org';

const customBaseSepolia = defineChain({
    id: 84532,
    name: 'Base Sepolia',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: [RPC_URL],
        },
        public: {
            http: [RPC_URL],
        },
    },
    blockExplorers: {
        default: {
            name: 'Basescan',
            url: 'https://sepolia.basescan.org',
            apiUrl: 'https://api-sepolia.basescan.org/api',
        },
    },
    testnet: true,
});

const DatasetCard: React.FC<{
    token: TokenData;
    onPurchase: (tokenId: bigint, price: bigint) => Promise<void>;
    isOwner: boolean;
    userAddress?: string;
}> = ({ token, onPurchase, isOwner, userAddress }) => {
    const { downloadDataset, downloading } = useDatasetDownload();

    if (!token?.metadata) {
        return null;
    }

    const handleDownload = async () => {
        if (!userAddress) {
            toast.error('Please connect your wallet first');
            return;
        }

        const toastId = toast.loading('Downloading dataset...');
        try {
            await downloadDataset(token.tokenId, userAddress);
            toast.success('Dataset downloaded successfully!', { id: toastId });
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Failed to download the dataset. Please try again.', {
                id: toastId,
            });
        }
    };

    const formatPercentage = (percentage: bigint) => {
        // Convert from basis points (10000 = 100%) to a decimal string
        const whole = percentage / BigInt(100);
        const fraction = percentage % BigInt(100);
        const fractionStr = fraction.toString().padStart(2, '0');
        return `${whole}.${fractionStr}%`;
    };

    return (
        <Card className="bg-[#1A5617]/60 border-green-500 p-6 relative  group hover:shadow-[0_0_10px_4px_#00A340] transition-shadow duration-300 w-70 h-[350px] flex flex-col mb-6">
            <div className="flex-1 overflow-hidden">
                <div className="space-y-4">
                    {/* Header Section */}
                    <div className="flex justify-between items-start">
                        <h3 className="text-white font-medium line-clamp-2">
                            {token.metadata.name}
                        </h3>
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                            ID: {token.tokenId.toString()}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm line-clamp-3">
                        {token.metadata.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                        {token.metadata.tags?.map((tag) => (
                            <span
                                key={tag}
                                className="bg-green-500/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
                            >
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Owners */}
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-1">
                            Owners
                        </h4>
                        <div className="space-y-1">
                            {token.metadata.owners
                                ?.slice(0, 2)
                                .map((owner, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-xs text-gray-400"
                                    >
                                        <span className="truncate flex-1">
                                            {owner.owner}
                                        </span>
                                        <span className="ml-2">
                                            {formatPercentage(
                                                BigInt(owner.percentage),
                                            )}
                                        </span>
                                    </div>
                                ))}
                            {/* Show "+X more" if more than 2 owners exist */}
                            {token.metadata.owners?.length > 2 && (
                                <p className="text-xs text-gray-500">
                                    +{token.metadata.owners.length - 2} more
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer Section */}
            <div className="flex justify-between items-center pt-2">
                {/* Price */}
                <div className="text-lg font-bold text-green-400">
                    {formatEther(BigInt(token?.metadata?.price))} ETH
                </div>

                {/* Purchase or Download Button */}
                {!isOwner ? (
                    <Button
                        onClick={() =>
                            onPurchase(token?.tokenId, token.metadata.price)
                        }
                        className="bg-green-500/20 text-white border border-green-800 backdrop-blur-3xl hover:bg-green-700 text-sm font-semibold"
                    >
                        Collect Now
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="bg-green-500/20 text-white border border-green-800 backdrop-blur-3xl hover:bg-green-700 text-sm font-semibold"
                        >
                            <div className="flex flex-row gap-1">
                                <p>
                                    {downloading
                                        ? 'Downloading...'
                                        : 'Download Now'}
                                </p>
                                <Image
                                    src="/download.svg"
                                    alt="download"
                                    width={25}
                                    height={20}
                                />
                            </div>
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default function Market() {
    const { ready, authenticated, login, logout, user } = usePrivy();
    const { wallets } = useWallets();
    const [tokens, setTokens] = useState<TokenData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tag, setTag] = useState<string>();
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const router = useRouter();

    const publicClient = createPublicClient({
        chain: customBaseSepolia,
        transport: http(RPC_URL),
    });

    const handlePurchase = async (tokenId: bigint, price: bigint) => {
        if (!authenticated || !user?.wallet?.address) {
            toast.error('Please connect your wallet first');
            return;
        }

        const toastId = toast.loading('Processing purchase...');

        try {
            // Get the active wallet
            const activeWallet = wallets[0];
            if (!activeWallet) {
                throw new Error('No wallet connected');
            }

            // Switch to Base Sepolia
            await activeWallet.switchChain(customBaseSepolia.id);

            // Get the provider from the wallet
            const provider = await activeWallet.getEthereumProvider();

            // Create wallet client using Privy's provider
            const walletClient = createWalletClient({
                account: user.wallet.address as `0x${string}`,
                chain: customBaseSepolia,
                transport: custom(provider),
            });

            // Call the purchase function on the contract
            const hash = await walletClient.writeContract({
                address: CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: 'purchaseDataset',
                args: [tokenId],
                value: price,
                chain: customBaseSepolia,
            });

            const receipt = await publicClient.waitForTransactionReceipt({
                hash,
            });

            console.log(`transaction:${hash}`);

            if (receipt.status !== 'success') {
                throw new Error('Transaction failed on the blockchain');
            }

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
                { id: toastId, duration: 5000 },
            );

            // Refresh the token list
            window.location.reload();
        } catch (error) {
            console.error('Purchase error:', error);
            if (error instanceof Error) {
                toast.error(`Error purchasing dataset: ${error.message}`, {
                    id: toastId,
                });
            } else {
                toast.error(
                    'Error purchasing dataset. Check console for details.',
                    {
                        id: toastId,
                    },
                );
            }
        }
    };

    const fetchTokens = async () => {
        try {
            if (isSearchActive) return;

            setError(null);
            console.log('Fetching tokens from contract:', CONTRACT_ADDRESS);

            const totalTokens = (await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: 'getTotalTokens',
            })) as bigint;

            console.log('Total tokens:', totalTokens.toString());

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
                            // Get metadata
                            const metadata = (await publicClient.readContract({
                                address: CONTRACT_ADDRESS,
                                abi: DatasetTokenABI,
                                functionName: 'tokenMetadata',
                                args: [i],
                            })) as RawMetadata;

                            // Get tags
                            const tags = (await publicClient.readContract({
                                address: CONTRACT_ADDRESS,
                                abi: DatasetTokenABI,
                                functionName: 'getTokenTags',
                                args: [i],
                            })) as string[];

                            // Get owners
                            const owners = (await publicClient.readContract({
                                address: CONTRACT_ADDRESS,
                                abi: DatasetTokenABI,
                                functionName: 'getTokenOwners',
                                args: [i],
                            })) as OwnershipShare[];

                            // Get balance if user is authenticated
                            const balance =
                                authenticated && user?.wallet?.address
                                    ? ((await publicClient.readContract({
                                          address: CONTRACT_ADDRESS,
                                          abi: DatasetTokenABI,
                                          functionName: 'balanceOf',
                                          args: [user.wallet.address, i],
                                      })) as bigint)
                                    : BigInt(0);

                            // Combine all metadata
                            const fullMetadata = {
                                name: metadata[0],
                                description: metadata[1],
                                contentHash: metadata[2],
                                ipfsHash: metadata[3],
                                price: metadata[4],
                                tags,
                                owners,
                            };

                            return {
                                tokenId: i,
                                metadata: fullMetadata,
                                balance,
                            };
                        } catch (error) {
                            console.error(`Error fetching token ${i}:`, error);
                            return null;
                        }
                    })(),
                );
            }

            const tokensData = await Promise.all(tokenPromises);
            const formattedTokens = tokensData
                .filter((token): token is TokenData => token !== null)
                .filter(
                    (token) =>
                        token.metadata.name &&
                        token.metadata.price &&
                        Array.isArray(token.metadata.tags) &&
                        Array.isArray(token.metadata.owners) &&
                        token.metadata.owners.length > 0,
                );

            console.log('Final formatted tokens:', formattedTokens);
            setTokens(formattedTokens);
        } catch (error) {
            console.error('Error fetching tokens:', error);
            setError(
                'Failed to load marketplace data. Please try again later.',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isSearchActive) {
            if (ready) {
                fetchTokens();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready]);

    if (!ready) return null;

    const handleSearch = async () => {
        if (!tag || tag.trim() === '') {
            toast.error('Please enter a tag to search.');
            return;
        }

        setSearchLoading(true);
        setSearchError(null);
        setIsSearchActive(true);
        setTokens([]); // Clear previous results

        try {
            // Fetch token IDs by tag
            const tokenIds = (await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: 'getTokensByTag',
                args: [tag],
            })) as bigint[];

            if (!tokenIds || tokenIds.length === 0) {
                toast('No datasets found for this tag.', { icon: '🔍' });
                setTokens([]);
                setLoading(false);
                return;
            }

            // Fetch metadata for each token
            const tokenPromises = tokenIds.map(async (tokenId) => {
                try {
                    // Get metadata
                    const metadata = (await publicClient.readContract({
                        address: CONTRACT_ADDRESS,
                        abi: DatasetTokenABI,
                        functionName: 'tokenMetadata',
                        args: [tokenId],
                    })) as RawMetadata;

                    // Get tags
                    const tags = (await publicClient.readContract({
                        address: CONTRACT_ADDRESS,
                        abi: DatasetTokenABI,
                        functionName: 'getTokenTags',
                        args: [tokenId],
                    })) as string[];

                    // Get owners
                    const owners = (await publicClient.readContract({
                        address: CONTRACT_ADDRESS,
                        abi: DatasetTokenABI,
                        functionName: 'getTokenOwners',
                        args: [tokenId],
                    })) as OwnershipShare[];

                    // Get balance if user is authenticated
                    const balance =
                        authenticated && user?.wallet?.address
                            ? ((await publicClient.readContract({
                                  address: CONTRACT_ADDRESS,
                                  abi: DatasetTokenABI,
                                  functionName: 'balanceOf',
                                  args: [user.wallet.address, tokenId],
                              })) as bigint)
                            : BigInt(0);

                    // Format metadata
                    const fullMetadata = {
                        name: metadata[0],
                        description: metadata[1],
                        contentHash: metadata[2],
                        ipfsHash: metadata[3],
                        price: metadata[4],
                        tags,
                        owners,
                    };

                    return { tokenId, metadata: fullMetadata, balance };
                } catch (err) {
                    console.error(
                        `Error fetching metadata for token ${tokenId}:`,
                        err,
                    );
                    return null;
                }
            });

            const tokensData = (await Promise.all(tokenPromises)).filter(
                Boolean,
            ) as TokenData[];

            setTokens(tokensData);
        } catch (error) {
            console.error('Error fetching tokens by tag:', error);
            setError('Failed to search datasets. Please try again.');
        } finally {
            setIsSearchActive(false);
            setSearchLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const renderContent = () => {
        if (searchLoading) {
            return (
                <div className="text-center py-8 text-white">
                    Searching datasets...
                </div>
            );
        }
        if (error) {
            return <div className="text-center py-8 text-red-500">{error}</div>;
        }
        if (loading) {
            return (
                <div className="text-center py-8 text-white">
                    Loading datasets...
                </div>
            );
        }
        if (tokens.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    No datasets available yet
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokens.map((token) => (
                    <DatasetCard
                        key={token.tokenId.toString()}
                        token={token}
                        onPurchase={handlePurchase}
                        isOwner={token.balance > BigInt(0)}
                        userAddress={user?.wallet?.address}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-black bg-gradient">
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
                {/* logo */}
                <div>
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="TREENTEQ Logo"
                            width={145}
                            height={50}
                            className="hidden sm:block brightness-110 contrast-125 p-1"
                            priority
                        />
                    </Link>
                </div>
                <div>
                    <div className="flex justify-center items-center sm:gap-5 gap-1">
                        <Link href="/listing">
                            <Button className="text-white bg-[#0B170D] border border-green-900/80 hover:bg-green-700 transition duration-300 rounded-full w-auto font-semibold">
                                List your data
                            </Button>
                        </Link>
                        <Button
                            onClick={authenticated ? logout : login}
                            className="bg-gradient-to-r from-[#00A340] to-[#00000080] border border-green-900 rounded-full p-3 font-semibold text-white hover:opacity-90 transition duration-300"
                        >
                            {authenticated ? 'Disconnect' : 'Connect Wallet'}
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="space-y-4 sm:space-y-6">
                        <Link href="/">
                            <div className="flex justify-start gap-2 items-center cursor-pointer">
                                <FaArrowLeft className="text-[#00A340] text-base sm:text-lg" />
                                <h1 className="text-base sm:text-[20px] text-white">
                                    Back
                                </h1>
                            </div>
                        </Link>

                        {/* search bar */}
                        <div className="relative mb-4 sm:mb-8">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input
                                type="text"
                                onChange={(e) => setTag(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search for Datasets, tags......"
                                className="w-full h-10 sm:h-12 bg-black/40 border-green-800/80 pl-12 pr-12 py-2 sm:py-3 text-white placeholder:text-gray-500 focus:border-green-500 rounded-full text-sm sm:text-lg"
                            />
                            <Button
                                variant="ghost"
                                onClick={handleSearch}
                                type="submit"
                                size="icon"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-400 hover:bg-transparent"
                            >
                                <IoSearchSharp className="w-20 h-14" />
                            </Button>
                        </div>

                        {/* Render Content */}
                        {renderContent()}
                    </div>
                </motion.div>
            </main>
            <style jsx>{`
                .bg-gradient {
                    background: radial-gradient(
                            50% 30% at 50% 0%,
                            rgba(0, 163, 64, 0.2) 0%,
                            rgba(0, 0, 0, 1) 100%
                        ),
                        radial-gradient(
                            circle at 30% 0%,
                            rgba(0, 163, 64, 0.3) 0%,
                            transparent 70%
                        ),
                        black;
                }
            `}</style>
        </div>
    );
}
