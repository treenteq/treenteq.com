'use client';

import { OwnershipShare } from '@/hooks/useDatasetToken';
import { CONTRACT_ADDRESS, RPC_URL } from '@/utils/contractConfig';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    createPublicClient,
    createWalletClient,
    custom,
    defineChain,
    formatEther,
    http,
} from 'viem';
import DatasetTokenABI from '@/utils/DatasetTokenABI.json';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { FaArrowLeft } from 'react-icons/fa6';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/card';
import { DownloadIcon, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDatasetDownload } from '@/hooks/useDatasetDownload';
import Background from '@/components/background';
import NavBar from '@/components/NavBar';

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

export default function TokenDetailPage() {
    const { tokenId } = useParams();
    const [dataset, setDataset] = useState<DatasetMetadata | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const { authenticated, login, logout, user } = usePrivy();
    const { downloadDataset, downloading } = useDatasetDownload();
    const { wallets } = useWallets();

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

    const publicClient = createPublicClient({
        chain: customBaseSepolia,
        transport: http(RPC_URL),
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                // get metadata
                const metadata = (await publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: DatasetTokenABI,
                    functionName: 'tokenMetadata',
                    args: [tokenId],
                })) as RawMetadata;

                // get tags
                const tags = (await publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: DatasetTokenABI,
                    functionName: 'getTokenTags',
                    args: [tokenId],
                })) as string[];

                // get owners
                const owners = (await publicClient.readContract({
                    address: CONTRACT_ADDRESS,
                    abi: DatasetTokenABI,
                    functionName: 'getTokenOwners',
                    args: [tokenId],
                })) as OwnershipShare[];

                if (authenticated && user?.wallet?.address) {
                    const balance = (await publicClient.readContract({
                        address: CONTRACT_ADDRESS,
                        abi: DatasetTokenABI,
                        functionName: 'balanceOf',
                        args: [user.wallet.address, tokenId],
                    })) as bigint;

                    setIsOwner(balance > BigInt(0));
                }

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

                setDataset(fullMetadata);
            } catch (error) {
                console.error('Failed to fetch token metadata:', error);
                return null;
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, []);

    const handlePurchase = async () => {
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
                value: dataset?.price, // Sending the price in ETH
                chain: customBaseSepolia,
            });

            // Wait for the transaction receipt
            const receipt = await publicClient.waitForTransactionReceipt({
                hash,
            });

            if (receipt.status !== 'success') {
                throw new Error('Transaction failed on the blockchain');
            }

            // Success notification
            toast.success(
                (t: { id: string | undefined }) => (
                    <div>
                        Purchase successful! You can now access the dataset.
                        <a
                            href={`https://sepolia.basescan.org/tx/${receipt.transactionHash}`}
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

            // Refresh the page to reflect ownership
            window.location.reload();
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error(
                `Error purchasing dataset: ${(error as Error).message}`,
                { id: toastId },
            );
        }
    };

    const handleDownload = async () => {
        const userAddress = user?.wallet?.address;

        if (!userAddress) {
            toast.error('Please connect your wallet first');
            return;
        }

        const toastId = toast.loading('Downloading dataset...');
        try {
            if (typeof tokenId === 'string') {
                await downloadDataset(BigInt(tokenId), userAddress);
            } else {
                throw new Error('Invalid tokenId type');
            }
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
    if (loading) {
        return (
            <div className="flex justify-center items-center">Loading....</div>
        );
    }
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-bl from-[#373737] to-black">
            <Background />
            <div className="absolute top-0 w-full">
                <NavBar
                    authenticated={authenticated}
                    login={login}
                    logout={logout}
                    primaryButton={{ text: 'Back', link: '/market' }}
                />
                {/* main */}
                <main className="container mx-auto px-4 sm:px-6 pt-4 sm:pt-8 cursor-pointer mb-6 lg:px-40">
                    <div className="space-y-4 sm:space-y-6">
                        <Link href="/market">
                            <div className="flex justify-start gap-2 items-center cursor-pointer">
                                <FaArrowLeft className="text-[#00A340] text-base sm:text-lg" />
                                <h1 className="text-base sm:text-[20px] text-white">
                                    Back
                                </h1>
                            </div>
                        </Link>

                        {/* card display */}
                        <Card className="bg-black/30 border-white p-6 relative overflow-hidden group hover:border-green-500 hover:shadow-[0_0_10px_4px_#00A340] transition-shadow duration-300">
                            <div className="flex flex-col justify-center items-start">
                                <CardHeader className="text-white text-3xl">
                                    {dataset?.name}
                                </CardHeader>
                                <CardDescription className="mb-2 text-gray-400">
                                    {dataset?.description}
                                </CardDescription>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {dataset?.tags?.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-green-500/60 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <CardContent className="mt-4 flex flex-col justify-center items-start">
                                    <h1 className="text-gray-300 text-xl font-bold mb-2">
                                        Owners
                                    </h1>
                                    {dataset?.owners?.map((owner, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 md:grid-cols-2 md:gap-2  text-white mb-2"
                                        >
                                            {/* Owner's public key with ellipsis for truncation */}
                                            <span className="truncate overflow-hidden text-ellipsis">
                                                {owner.owner}
                                            </span>

                                            {/* Percentage value */}
                                            <span className="whitespace-nowrap">
                                                {formatPercentage(
                                                    BigInt(owner.percentage),
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>
                            </div>
                            <div className="flex justify-between items-end mt-3">
                                <div className="text-lg font-bold text-green-400">
                                    {dataset?.price
                                        ? `${formatEther(BigInt(dataset.price))} ETH`
                                        : 'Price not available'}
                                </div>
                                <div>
                                    {!isOwner ? (
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handlePurchase();
                                            }}
                                            className="bg-green-500/20 text-white border border-green-800 backdrop-blur-3xl hover:bg-green-700 text-sm font-semibold"
                                        >
                                            Purchase
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDownload();
                                            }}
                                            className="bg-green-500/20 text-white border border-green-800 backdrop-blur-3xl hover:bg-green-700 text-sm font-semibold flex gap-1"
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
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
