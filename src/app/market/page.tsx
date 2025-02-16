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
    defineChain,
} from 'viem';
import DatasetTokenABI from '@/utils/DatasetTokenABI.json';
import Link from 'next/link';
import { DATASET_CONTRACT_ADDRESS, RPC_URL } from '@/utils/contractConfig';
import { DownloadIcon, Loader, Search, Tag } from 'lucide-react';
import toast, { Toast } from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { OwnershipShare } from '@/hooks/useDatasetToken';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import { Card } from '@/components/ui/card';
import { IoSearchSharp } from 'react-icons/io5';
import { useDatasetDownload } from '@/hooks/useDatasetDownload';
import Navbar from '@/components/NavBar';
import Background from '@/components/background';
import { Skeleton } from '@/components/ui/skeleton';

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
    hasPurchased: boolean;
    isOwner: boolean;
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
        <Card className="bg-black/30 border-white p-4 relative  group hover:shadow-[0_0_10px_4px_#00A340] hover:border-green-400 transition-shadow duration-300 w-72 h-64 flex flex-col mb-6">
            <div className="flex-1 overflow-hidden">
                <div className="space-y-4">
                    {/* Header Section */}
                    <div className="flex justify-between gap-1 items-start">
                        <h3 className="text-white font-medium line-clamp-1">
                            {token.metadata.name}
                        </h3>
                        <span className="text-xs flex flex-row bg-green-500/20 text-green-500 px-2 py-1 rounded">
                            <div>ID:</div> <div>{token.tokenId.toString()}</div>
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm line-clamp-1">
                        {token.metadata.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-1 mt-2">
                        {token.metadata.tags?.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="bg-green-500/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
                            >
                                <Tag className="w-3 h-3" />
                                {tag}
                            </span>
                        ))}
                        {token.metadata.tags?.length > 2 && (
                            <p className="text-xs text-gray-500">
                                +{token.metadata.tags?.length - 2} more
                            </p>
                        )}
                    </div>

                    {/* Owners */}
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-300 mb-1">
                            Owners
                        </h4>
                        <div className="space-y-1">
                            {token.metadata.owners
                                ?.slice(0, 1)
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
                            {token.metadata.owners?.length > 1 && (
                                <p className="text-xs text-gray-500">
                                    +{token.metadata.owners.length - 1} more
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
                {!token.hasPurchased && !token.isOwner ? (
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            onPurchase(token?.tokenId, token.metadata.price);
                        }}
                        className="bg-green-500/20 text-white border border-green-800 backdrop-blur-3xl hover:bg-green-700 text-sm font-semibold"
                    >
                        Purchase
                    </Button>
                ) : (
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                handleDownload();
                            }}
                            disabled={downloading}
                            className="bg-green-500/20 text-white border border-green-800 backdrop-blur-3xl hover:bg-green-700 text-sm font-semibold"
                        >
                            <div className="flex flex-row justify-center items-center gap-1">
                                <p>
                                    {downloading
                                        ? 'Downloading...'
                                        : 'Download Now'}
                                </p>
                                <DownloadIcon />
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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [tag, setTag] = useState<string>();
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchLoading, setSearchLoading] = useState<boolean>(false);
    const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(9);
    const [totalTokens, setTotalTokens] = useState<number>(0);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

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
                address: DATASET_CONTRACT_ADDRESS,
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
                toast.error(`Error purchasing dataset`, {
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
            setIsPageLoading(true);

            setError(null);
            console.log(
                'Fetching tokens from contract:',
                DATASET_CONTRACT_ADDRESS,
            );

            const totalTokens = (await publicClient.readContract({
                address: DATASET_CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: 'getTotalTokens',
            })) as bigint;

            setTotalTokens(Number(totalTokens));
            console.log('Total tokens:', totalTokens.toString());

            if (totalTokens === BigInt(0)) {
                setTokens([]);
                setLoading(false);
                return;
            }

            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            const tokenPromises = [];
            for (
                let i = BigInt(startIndex);
                i < BigInt(endIndex);
                i = i + BigInt(1)
            ) {
                tokenPromises.push(
                    (async () => {
                        try {
                            // Get metadata
                            const metadata = (await publicClient.readContract({
                                address: DATASET_CONTRACT_ADDRESS,
                                abi: DatasetTokenABI,
                                functionName: 'getDatasetMetadata',
                                args: [i],
                            })) as RawMetadata;

                            // Get tags
                            const tags = (await publicClient.readContract({
                                address: DATASET_CONTRACT_ADDRESS,
                                abi: DatasetTokenABI,
                                functionName: 'getTokenTags',
                                args: [i],
                            })) as string[];

                            // Get owners
                            const owners = (await publicClient.readContract({
                                address: DATASET_CONTRACT_ADDRESS,
                                abi: DatasetTokenABI,
                                functionName: 'getTokenOwners',
                                args: [i],
                            })) as OwnershipShare[];

                            // Get hasPurchased and balance
                            const [hasPurchased, balance] = await Promise.all([
                                authenticated && user?.wallet?.address
                                    ? ((await publicClient.readContract({
                                          address: DATASET_CONTRACT_ADDRESS,
                                          abi: DatasetTokenABI,
                                          functionName: 'hasPurchased',
                                          args: [user.wallet.address, i],
                                      })) as boolean)
                                    : false,
                                authenticated && user?.wallet?.address
                                    ? ((await publicClient.readContract({
                                          address: DATASET_CONTRACT_ADDRESS,
                                          abi: DatasetTokenABI,
                                          functionName: 'balanceOf',
                                          args: [user.wallet.address, i],
                                      })) as bigint)
                                    : BigInt(0),
                            ]);

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
                                hasPurchased,
                                isOwner: balance > BigInt(0),
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
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        if (!isSearchActive) {
            if (ready) {
                fetchTokens();
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready, currentPage]);

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
                address: DATASET_CONTRACT_ADDRESS,
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
                        address: DATASET_CONTRACT_ADDRESS,
                        abi: DatasetTokenABI,
                        functionName: 'getDatasetMetadata',
                        args: [tokenId],
                    })) as RawMetadata;

                    // Get tags
                    const tags = (await publicClient.readContract({
                        address: DATASET_CONTRACT_ADDRESS,
                        abi: DatasetTokenABI,
                        functionName: 'getTokenTags',
                        args: [tokenId],
                    })) as string[];

                    // Get owners
                    const owners = (await publicClient.readContract({
                        address: DATASET_CONTRACT_ADDRESS,
                        abi: DatasetTokenABI,
                        functionName: 'getTokenOwners',
                        args: [tokenId],
                    })) as OwnershipShare[];

                    // Get hasPurchased and balance
                    const [hasPurchased, balance] = await Promise.all([
                        authenticated && user?.wallet?.address
                            ? ((await publicClient.readContract({
                                  address: DATASET_CONTRACT_ADDRESS,
                                  abi: DatasetTokenABI,
                                  functionName: 'hasPurchased',
                                  args: [user.wallet.address, tokenId],
                              })) as boolean)
                            : false,
                        authenticated && user?.wallet?.address
                            ? ((await publicClient.readContract({
                                  address: DATASET_CONTRACT_ADDRESS,
                                  abi: DatasetTokenABI,
                                  functionName: 'balanceOf',
                                  args: [user.wallet.address, tokenId],
                              })) as bigint)
                            : BigInt(0),
                    ]);

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

                    return {
                        tokenId,
                        metadata: fullMetadata,
                        hasPurchased,
                        isOwner: balance > BigInt(0),
                    };
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
                <div className="flex flex-row flex-wrap overflow-hidden gap-3 justify-center items-center">
                    <div>
                        <Skeleton className="h-64 w-72 rounded-xl bg-neutral-400/50" />
                    </div>
                    <div>
                        <Skeleton className="h-64 w-72 rounded-xl bg-neutral-400/50" />
                    </div>
                    <div>
                        <Skeleton className="h-64 w-72 rounded-xl bg-neutral-400/50" />
                    </div>
                </div>
            );
        }
        if (error) {
            return <div className="text-center py-8 text-red-500">{error}</div>;
        }
        if (loading) {
            return (
                <div className="flex flex-row flex-wrap gap-3 overflow-hidden justify-center items-center">
                    <div>
                        <Skeleton className="h-64 w-72 rounded-xl bg-neutral-400/50" />
                    </div>
                    <div>
                        <Skeleton className="h-64 w-72 rounded-xl bg-neutral-400/50" />
                    </div>
                    <div>
                        <Skeleton className="h-64 w-72 rounded-xl bg-neutral-400/50" />
                    </div>
                    <div>
                        <Skeleton className="h-64 w-72 rounded-xl bg-neutral-400/50" />
                    </div>
                    <div>
                        <Skeleton className="h-64 w-72 rounded-xl bg-neutral-400/50" />
                    </div>
                    <div>
                        <Skeleton className="h-64 w-72 rounded-xl bg-neutral-400/50" />
                    </div>
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
                    <Link
                        key={token.tokenId.toString()}
                        href={`/market/${token.tokenId.toString()}`}
                    >
                        <DatasetCard
                            token={token}
                            onPurchase={handlePurchase}
                            isOwner={token.isOwner || token.hasPurchased}
                            userAddress={user?.wallet?.address}
                        />
                    </Link>
                ))}
            </div>
        );
    };

    const totalPages = Math.ceil(totalTokens / itemsPerPage);

    return (
        <div className="relative min-h-screen w-screen overflow-y-scroll overflow-x-hidden inset-0 bg-gradient-to-bl from-[#373737] to-black flex flex-col justify-center items-center">
            <div className="fixed inset-0 w-full h-full pointer-events-none">
                <Background />
            </div>

            <Navbar
                primaryButton={{
                    text: 'List your data',
                    link: '/listing',
                }}
            />
            {/* Main Content */}
            <main className="min-h-screen overflow-x-hidden px-0 sm:px-6 pt-4 sm:pt-8 flex flex-col justify-center items-center h-full max-w-7xl">
                <div className="flex flex-col justify-center items-center h-full w-full px-4 lg:px-40 sm:px-0">
                    <div className="w-full">
                        <Link href="/">
                            <div className="flex justify-start gap-2 items-center cursor-pointer mb-6">
                                <FaArrowLeft className="text-[#00A340] text-base sm:text-lg" />
                                <h1 className="text-base sm:text-[20px] text-white">
                                    Back
                                </h1>
                            </div>
                        </Link>

                        {/* search bar */}
                        <div className="relative mb-4 sm:mb-8 w-full">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <Input
                                type="text"
                                onChange={(e) => setTag(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search for Datasets, tags......"
                                className="w-full h-10 sm:h-12 bg-black/40 border-whitex pl-12 pr-12 py-2 sm:py-3 text-white placeholder:text-gray-500 focus:border-green-500 rounded-full text-sm sm:text-lg"
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
                        <div className="flex justify-center items-center w-full">
                            {renderContent()}
                        </div>

                        <div
                            className={`bottom-0 left-0 w-full px-4 pb-5  lg:px-40 flex justify-center items-center gap-5 mb-6 ${searchLoading ? 'hidden' : ''}`}
                        >
                            <Button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1),
                                    )
                                }
                                disabled={currentPage === 1 || isPageLoading}
                                className="bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                            >
                                <FaArrowLeft />
                            </Button>

                            <div className="flex items-center justify-center gap-2">
                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1,
                                )
                                    .filter(
                                        (page) =>
                                            page === 1 ||
                                            page === totalPages ||
                                            (page >= currentPage - 2 &&
                                                page <= currentPage + 2),
                                    )
                                    .map((page, idx, arr) => (
                                        <div
                                            key={idx}
                                            className="flex justify-center gap-2"
                                        >
                                            {idx > 0 &&
                                                page !== arr[idx - 1] + 1 && (
                                                    <span
                                                        key={`ellipsis-${idx}`}
                                                        className="text-white text-lg"
                                                    >
                                                        ...
                                                    </span>
                                                )}

                                            <Button
                                                key={page}
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }
                                                className={`px-3 py-1 rounded-lg ${
                                                    page === currentPage
                                                        ? 'bg-green-700 text-white'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-green-600 hover:text-white'
                                                }`}
                                            >
                                                {page}
                                            </Button>
                                        </div>
                                    ))}
                            </div>

                            <Button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        prev * itemsPerPage < totalTokens
                                            ? prev + 1
                                            : prev,
                                    )
                                }
                                disabled={
                                    currentPage * itemsPerPage >= totalTokens ||
                                    isPageLoading
                                }
                                className="bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                            >
                                <FaArrowRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
