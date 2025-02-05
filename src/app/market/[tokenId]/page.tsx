'use client';

import { OwnershipShare } from '@/hooks/useDatasetToken';
import { CONTRACT_ADDRESS, RPC_URL } from '@/utils/contractConfig';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPublicClient, defineChain, http } from 'viem';
import DatasetTokenABI from '@/utils/DatasetTokenABI.json';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import logo from '../../../../public/logo.svg';
import BackgroundAnimation from '@/components/background-animation';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { FaArrowLeft } from 'react-icons/fa6';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/card';
import { Tag } from 'lucide-react';

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
    const { authenticated, login, logout } = usePrivy();

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
                http: ['https://sepolia.base.org'],
            },
            public: {
                http: ['https://sepolia.base.org'],
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
                            src={logo}
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

            {/* main */}
            <main className="relative z-10 container mx-auto px-4 sm:px-6 pt-4 sm:pt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-4xl mx-auto"
                >
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
                        <Card className="bg-[#1A5617]/60 border-green-500 p-6 relative overflow-hidden group hover:shadow-[0_0_10px_4px_#00A340] transition-shadow duration-300 flex flex-col justify-center items-start">
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
                        </Card>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
