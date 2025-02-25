'use client';

import { usePathname } from 'next/navigation';
import Background from '@/components/background';
import Image from 'next/image';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    CreditCard,
    Loader2,
    Menu,
    StampIcon,
    Wallet,
    RefreshCw,
    Filter,
    ArrowUpRight,
} from 'lucide-react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { DATASET_CONTRACT_ADDRESS, RPC_URL } from '@/utils/contractConfig';
import toast from 'react-hot-toast';
import DatasetTokenABI from '@/utils/DatasetTokenABI.json';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import TokenPriceLineChart from '@/components/TokenLineChart';

interface tokenMetadata {
    0: string; // name
    1: string; // description
    5: string[]; //tags
}

interface tokenCardProps {
    metadata: tokenMetadata | null;
    tokenId: string;
    isLoading?: boolean;
}

interface PriceHistoryEntry {
    totalPrice: string;
    timestamp: number;
}

interface ChartDataPoint {
    totalPrice: number;
    displayPrice: string;
    date: string;
}

const PRICE_HISTORY_KEY = 'tokenTotalPriceHistory';
const DATA_RETENTION_DAYS = 1;

const TokenCard: React.FC<tokenCardProps> = ({
    metadata,
    tokenId,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="shadow-lg rounded-xl p-4 w-full h-64 border border-gray-800 bg-black/60">
                <Skeleton className="h-6 w-3/4 bg-gray-700 mb-2" />
                <Skeleton className="h-4 w-full bg-gray-700 mb-4" />
                <Skeleton className="h-4 w-1/3 bg-gray-700 mb-8" />
                <Skeleton className="h-20 w-full bg-gray-700 mb-4" />
                <Skeleton className="h-8 w-28 bg-gray-700" />
            </div>
        );
    }

    // Generate a color based on the token ID
    const generateColor = (id: string) => {
        const colors = ['green', 'blue', 'purple', 'orange', 'pink'];
        const sum = Array.from(id).reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0,
        );
        return colors[sum % colors.length];
    };

    const color = generateColor(tokenId);
    const colorClasses = {
        green: {
            border: 'border-green-400',
            shadow: 'shadow-green-400/20',
            hover: 'hover:shadow-green-400/40',
            badge: 'bg-green-900 text-green-300',
            button: 'bg-green-700 hover:bg-green-800',
        },
        blue: {
            border: 'border-blue-400',
            shadow: 'shadow-blue-400/20',
            hover: 'hover:shadow-blue-400/40',
            badge: 'bg-blue-900 text-blue-300',
            button: 'bg-blue-700 hover:bg-blue-800',
        },
        purple: {
            border: 'border-purple-400',
            shadow: 'shadow-purple-400/20',
            hover: 'hover:shadow-purple-400/40',
            badge: 'bg-purple-900 text-purple-300',
            button: 'bg-purple-700 hover:bg-purple-800',
        },
        orange: {
            border: 'border-orange-400',
            shadow: 'shadow-orange-400/20',
            hover: 'hover:shadow-orange-400/40',
            badge: 'bg-orange-900 text-orange-300',
            button: 'bg-orange-700 hover:bg-orange-800',
        },
        pink: {
            border: 'border-pink-400',
            shadow: 'shadow-pink-400/20',
            hover: 'hover:shadow-pink-400/40',
            badge: 'bg-pink-900 text-pink-300',
            button: 'bg-pink-700 hover:bg-pink-800',
        },
    };
    return (
        <Card
            className={`shadow-lg p-4 w-full h-64 border bg-black/60 transition-all duration-300 ${colorClasses[color as keyof typeof colorClasses].border} ${colorClasses[color as keyof typeof colorClasses].shadow} hover:shadow-lg ${colorClasses[color as keyof typeof colorClasses].hover}`}
        >
            <CardHeader className="p-3 pb-1">
                <div className="flex justify-between items-start mb-1">
                    <CardTitle className="text-lg font-semibold text-white line-clamp-1">
                        {metadata?.[0]}
                    </CardTitle>
                    <Badge
                        variant="outline"
                        className={`${colorClasses[color as keyof typeof colorClasses].badge} text-xs`}
                    >
                        Token #{tokenId}
                    </Badge>
                </div>
                <CardDescription className="text-gray-300 text-sm line-clamp-2">
                    {metadata?.[1]}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-1">
                <div className="flex flex-wrap gap-1 my-2">
                    {metadata?.[5] &&
                        metadata[5].slice(0, 3).map((tag, index) => (
                            <Badge
                                key={index}
                                className="bg-gray-800 hover:bg-gray-700 text-xs"
                            >
                                #{tag}
                            </Badge>
                        ))}
                    {metadata?.[5] && metadata[5].length > 3 && (
                        <Badge className="bg-gray-800 hover:bg-gray-700 text-xs">
                            +{metadata[5].length - 3} more
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0">
                <Link href={`/market/${tokenId}`} className="w-full">
                    <Button
                        className={`w-full ${colorClasses[color as keyof typeof colorClasses].button} flex gap-2 items-center justify-center`}
                    >
                        View Details
                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default function Home() {
    const [balance, setBalance] = useState<string>('0');
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [mintedTokenIds, setMintedTokenIds] = useState<string[]>([]);
    const [purchasedTokenIds, setPurchasedTokenIds] = useState<string[]>([]);
    const [purchasedTokenMetadata, setPurchasedTokenMetadata] = useState<
        tokenMetadata[] | null
    >(null);
    const [mintedTokenMetadata, setMintedTokenMetadata] = useState<
        tokenMetadata[] | null
    >(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [dataSort, setDataSort] = useState('az');
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [currentTotalPrice, setCurrentTotalPrice] = useState<string>('0');
    const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isPriceLoading, setIsPriceLoading] = useState(true);

    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', path: '/' },
        { name: 'Datasets', path: '/market' },
        { name: 'Listing', path: '/listing' },
        {
            name: 'Docs',
            path: 'https://www.treenteq.com/LitePaper_treenteq.pdf',
            external: true,
        },
        {
            name: 'Contact Us',
            path: 'https://docs.google.com/forms/d/e/1FAIpQLSfFGfRqMHaBRLy22fDHJvJQgagAP7sjoyVM0HETDOcz79VcVA/viewform',
            external: true,
        },
    ];

    const wallets = useWallets();
    const { logout, authenticated, login, ready } = usePrivy();

    const activeWallet = wallets?.wallets[0];

    const publicClient = createPublicClient({
        chain: baseSepolia,
        transport: http(RPC_URL),
    });

    useEffect(() => {
        const fetchBalance = async () => {
            if (!activeWallet?.address) return;

            setIsLoadingBalance(true);
            setError(null);

            try {
                const balanceValue = await publicClient.getBalance({
                    address: activeWallet.address as `0x${string}`,
                });
                setBalance(formatEther(balanceValue));
            } catch (error) {
                console.error('Error fetching balance:', error);
                setError('Failed to fetch wallet balance');

                setBalance('0');
            } finally {
                setIsLoadingBalance(false);
            }
        };

        if (activeWallet?.address) {
            fetchBalance();
            const interval = setInterval(fetchBalance, 30000);
            return () => clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWallet?.address]);

    // Handle authentication state changes
    useEffect(() => {
        if (ready && authenticated && isLoggingIn) {
            setIsLoggingIn(false);
            window.location.reload();
        }
    }, [ready, authenticated, isLoggingIn]);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        try {
            await login();
        } catch (error) {
            console.error('Login error:', error);
            setError((error as Error).message || 'Failed to connect wallet');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            window.location.reload();
        } catch (error) {
            console.error('Error during logout:', error);
            setError('Failed to disconnect wallet');
        }
    };

    if (error) {
        toast.error(error);
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const fetchAllData = async () => {
        if (!activeWallet?.address) return;

        setIsDataLoading(true);
        setIsRefreshing(true);

        try {
            // minted Token
            const mintedTokenPromise = publicClient.readContract({
                address: DATASET_CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: 'getTokensByOwner',
                args: [activeWallet?.address],
            });

            // purchased token
            const purchasedTokenPromise = publicClient.readContract({
                address: DATASET_CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: 'getPurchasedTokens',
                args: [activeWallet?.address],
            });

            // Run all promises in parallel
            const [mintedTokenIds, purchasedTokenIds] = await Promise.all([
                mintedTokenPromise,
                purchasedTokenPromise,
            ]);

            const mintedTokenIdsArray = Array.isArray(mintedTokenIds)
                ? mintedTokenIds
                : [];
            const purchasedTokenIdsArray = Array.isArray(purchasedTokenIds)
                ? purchasedTokenIds
                : [];

            const fetchMetadata = async (tokenIds: string[]) => {
                return Promise.all(
                    tokenIds.map((tokenId) =>
                        publicClient.readContract({
                            address: DATASET_CONTRACT_ADDRESS,
                            abi: DatasetTokenABI,
                            functionName: 'getDatasetMetadata',
                            args: [tokenId],
                        }),
                    ),
                );
            };

            const [purchasedTokenMetadata, mintedTokenMetadata] =
                await Promise.all([
                    fetchMetadata(purchasedTokenIdsArray),
                    fetchMetadata(mintedTokenIdsArray),
                ]);

            setMintedTokenIds(mintedTokenIdsArray);
            setPurchasedTokenIds(purchasedTokenIdsArray);
            setPurchasedTokenMetadata(
                purchasedTokenMetadata as tokenMetadata[],
            );
            setMintedTokenMetadata(mintedTokenMetadata as tokenMetadata[]);

            toast.success('Data refreshed successfully');
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to refresh data');
        } finally {
            setIsDataLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        if (activeWallet?.address) {
            fetchAllData();

            // Simulate data loading for demo
            setTimeout(() => {
                setIsDataLoading(false);
            }, 1500);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWallet]);
    // Sort tokens based on selected sort option
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortTokens = (tokens: string[], metadata: any[]) => {
        if (!tokens || !metadata) return [];

        const paired = tokens.map((token: string, index: number) => ({
            token,
            metadata: metadata[index],
        }));

        switch (dataSort) {
            case 'az':
                return [...paired].sort((a, b) =>
                    a.metadata[0].localeCompare(b.metadata[0]),
                );
            case 'za':
                return [...paired].sort((a, b) =>
                    b.metadata[0].localeCompare(a.metadata[0]),
                );
            default:
                return paired;
        }
    };

    const sortedPurchased = sortTokens(
        purchasedTokenIds,
        purchasedTokenMetadata || [],
    );
    const sortedMinted = sortTokens(mintedTokenIds, mintedTokenMetadata || []);

    // Get shortened address
    const getShortenedAddress = (address: string) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    useEffect(() => {
        // Load existing history from localStorage immediately
        const storedHistory = localStorage.getItem(PRICE_HISTORY_KEY);
        if (storedHistory) {
            try {
                const history: PriceHistoryEntry[] = JSON.parse(storedHistory);
                setPriceHistory(history);
                processChartData(history);

                // Get most recent total price
                if (history.length > 0) {
                    const sortedHistory = [...history].sort(
                        (a, b) => b.timestamp - a.timestamp,
                    );
                    setCurrentTotalPrice(sortedHistory[0].totalPrice);
                }
            } catch (error) {
                console.error('Failed to parse stored price history:', error);
            }
        }

        setIsInitialized(true);
    }, []);

    // Function to get the current summed price of all minted tokens
    const getTotalTokenPrice = async () => {
        try {
            // If there are no minted tokens, we can return early
            if (!mintedTokenIds || mintedTokenIds.length === 0) {
                setIsPriceLoading(false);
                return '0';
            }

            setIsPriceLoading(true);

            // Create an array of promises to fetch prices for all tokens
            const pricePromises = mintedTokenIds.map(async (tokenId) => {
                try {
                    const result = await publicClient.readContract({
                        address: DATASET_CONTRACT_ADDRESS,
                        abi: DatasetTokenABI,
                        functionName: 'getCurrentPrice',
                        args: [[tokenId]],
                    });

                    return result as string;
                } catch (error) {
                    console.error(
                        `Failed to get price for token ${tokenId}:`,
                        error,
                    );
                    return '0';
                }
            });

            // Wait for all promises to resolve
            const results = await Promise.all(pricePromises);

            // Sum all prices
            const totalPrice = results
                .reduce((sum: bigint, price: string) => {
                    const priceValue = BigInt(price || '0');
                    return sum + priceValue;
                }, BigInt(0))
                .toString();
            setCurrentTotalPrice(totalPrice);
            updatePriceHistory(totalPrice);
            setIsPriceLoading(false);

            return totalPrice;
        } catch (error) {
            console.error('Failed to get total token price:', error);
            setIsPriceLoading(false);
            return '0';
        }
    };

    // Update price history and save to localStorage
    const updatePriceHistory = (totalPrice: string) => {
        // Get existing history from localStorage
        const storedHistory = localStorage.getItem(PRICE_HISTORY_KEY);
        let history: PriceHistoryEntry[] = storedHistory
            ? JSON.parse(storedHistory)
            : [];

        // Add new price point
        const newEntry: PriceHistoryEntry = {
            totalPrice,
            timestamp: Date.now(),
        };

        history.push(newEntry);

        // Limit history to prevent excessive storage
        if (history.length > 100) {
            const retentionPeriod =
                Date.now() - DATA_RETENTION_DAYS * 24 * 60 * 60 * 1000;
            history = history
                .filter((entry) => entry.timestamp > retentionPeriod)
                .slice(-100);
        }

        // Save updated history to localStorage
        localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(history));
        setPriceHistory(history);

        // Update chart data
        processChartData(history);
    };

    // Process price history into chart data format
    const processChartData = (history: PriceHistoryEntry[]) => {
        let chartPoints: ChartDataPoint[] = [];
        let highestPrice = 0;

        // Get the most recent price points (up to 10)
        const recentPrices = [...history]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 10)
            .reverse();

        recentPrices.forEach((pricePoint) => {
            const priceInEth = parseFloat(pricePoint.totalPrice) / 1e18;

            // Update highest price if needed
            if (priceInEth > highestPrice) {
                highestPrice = priceInEth;
            }

            chartPoints.push({
                totalPrice: priceInEth,
                displayPrice: priceInEth.toFixed(4),
                date: new Date(pricePoint.timestamp).toLocaleDateString(
                    undefined,
                    {
                        month: 'short',
                        day: 'numeric',
                    },
                ),
            });
        });

        // Group by date and take the latest price for each date
        const dateMap = new Map<string, ChartDataPoint>();
        chartPoints.forEach((point) => {
            // Either set this point or replace with a higher price for the same date
            if (
                !dateMap.has(point.date) ||
                dateMap.get(point.date)!.totalPrice < point.totalPrice
            ) {
                dateMap.set(point.date, point);
            }
        });

        // Convert map back to array and sort by date
        chartPoints = Array.from(dateMap.values()).sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateA - dateB;
        });

        setChartData(chartPoints);
    };

    useEffect(() => {
        // Wait until component is initialized before fetching new data
        if (!isInitialized) return;

        // Initial fetch if we have minted tokens
        if (mintedTokenIds && mintedTokenIds.length > 0) {
            getTotalTokenPrice();
        } else {
            setIsPriceLoading(false);
        }

        // Set up periodic fetching every hour
        let intervalId: NodeJS.Timeout | null = null;

        if (mintedTokenIds && mintedTokenIds.length > 0) {
            intervalId = setInterval(
                () => {
                    getTotalTokenPrice();
                },
                60 * 60 * 1000,
            ); // 1 hour
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mintedTokenIds, isInitialized]);

    const hasChartData = chartData.length > 0;
    const priceInEth = parseFloat(currentTotalPrice) / 1e18;

    return (
        <div className="h-screen w-screen overflow-auto relative inset-0 bg-gradient-to-bl from-[#373737] to-black flex flex-col items-center justify-center">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Background />
            </div>

            <div className="absolute top-0 w-full flex flex-col justify-center items-center">
                {/* desktop header */}
                <nav className="sm:flex flex-row justify-between items-center w-11/12 lg:w-5/6 py-5 hidden">
                    {/* logo */}
                    <Link href={'/'}>
                        <Image
                            src="/logo.svg"
                            alt="TREENTEQ"
                            width={135}
                            height={45}
                            className="hover:opacity-80 transition-opacity"
                        />
                    </Link>
                    <div className="flex flex-row gap-6">
                        {navItems.map((nav, index) =>
                            nav.external ? (
                                <a
                                    href={nav.path}
                                    key={index}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`font-semibold lg:font-lg transition-colors hover:text-[#00A340] ${
                                        pathname === nav.path
                                            ? 'text-[#00A340] font-extrabold'
                                            : 'text-white'
                                    }`}
                                >
                                    {nav.name}
                                </a>
                            ) : (
                                <Link href={nav.path} key={index}>
                                    <p
                                        className={`font-semibold lg:font-lg transition-colors hover:text-[#00A340] ${
                                            pathname === nav.path
                                                ? 'text-[#00A340] font-extrabold'
                                                : 'text-white'
                                        }`}
                                    >
                                        {nav.name}
                                    </p>
                                </Link>
                            ),
                        )}
                    </div>
                    <div>
                        {authenticated && activeWallet ? (
                            <Button
                                onClick={handleLogout}
                                className="bg-red-700 rounded-lg p-3 font-semibold text-white hover:bg-red-800 transition duration-300 flex items-center gap-2 w-full"
                            >
                                Disconnect
                            </Button>
                        ) : (
                            <Button
                                onClick={handleLogin}
                                disabled={isLoggingIn}
                                className="bg-[#00A340] border border-green-900 rounded-lg p-3 font-semibold text-white hover:bg-green-800 transition duration-300 flex items-center gap-2 w-full"
                            >
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Connecting...
                                    </>
                                ) : (
                                    'Connect Wallet'
                                )}
                            </Button>
                        )}
                    </div>
                </nav>
                {/* mobile header */}
                <nav className="flex justify-between items-center w-full p-5 md:hidden">
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Menu className="text-white" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-900/80 border border-gray-800">
                                {navItems.map((nav, index) => (
                                    <Link href={nav.path} key={index}>
                                        <DropdownMenuItem
                                            className={`font-semibold ${pathname === nav.path ? 'text-[#00A340]' : 'text-white'}`}
                                        >
                                            {nav.name}
                                        </DropdownMenuItem>
                                    </Link>
                                ))}
                                <DropdownMenuItem>
                                    {authenticated && activeWallet ? (
                                        <Button
                                            onClick={handleLogout}
                                            className="bg-red-700 rounded-lg p-3 font-semibold text-white hover:bg-red-800 transition duration-300 flex items-center gap-2 w-full"
                                        >
                                            Disconnect
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleLogin}
                                            disabled={isLoggingIn}
                                            className="bg-[#00A340] border border-green-900 rounded-lg p-3 font-semibold text-white hover:bg-green-800 transition duration-300 flex items-center gap-2 w-full"
                                        >
                                            {isLoggingIn ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Connecting...
                                                </>
                                            ) : (
                                                'Connect Wallet'
                                            )}
                                        </Button>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Link href={'/'}>
                        <Image
                            src="/logo.svg"
                            alt="logo"
                            width={20}
                            height={20}
                            className="w-28 h-20"
                        />
                    </Link>

                    <div>{''}</div>
                </nav>

                {/* main content */}
                <div className="w-full max-w-7xl mx-auto flex flex-col justify-center mt-6 px-4 pb-16 overflow-x-hidden">
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-2">
                            <div>
                                <h1 className="text-white text-2xl md:text-4xl font-bold mb-1">
                                    {getGreeting()}, {'anon'}
                                </h1>
                                {activeWallet?.address && (
                                    <div className="flex items-center gap-2">
                                        <p className="text-white text-sm md:text-base">
                                            <span className="text-gray-400">
                                                Wallet:
                                            </span>{' '}
                                            {getShortenedAddress(
                                                activeWallet?.address,
                                            )}
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className="text-xs bg-gray-800 border-gray-700 text-gray-400"
                                        >
                                            Base Sepolia
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {activeWallet?.address && (
                                <Button
                                    onClick={fetchAllData}
                                    variant="outline"
                                    className="flex items-center gap-2 text-white bg-gray-800 border-gray-700 hover:bg-gray-700"
                                    disabled={isRefreshing}
                                >
                                    {isRefreshing ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-4 w-4" />
                                    )}
                                    Refresh
                                </Button>
                            )}
                        </div>

                        {activeWallet?.address ? (
                            <div className="flex flex-col items-start">
                                <p className="text-slate-300 text-sm mb-6">
                                    Here is an overview of your digital datasets
                                    and analytics
                                </p>

                                {/* Top Row - Analytics Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-6">
                                    <Card className="transition-all duration-300 p-4 w-full text-white bg-black/60 border-gray-800 hover:shadow-lg hover:border-green-400 hover:shadow-green-400/20">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Wallet Balance
                                            </CardTitle>
                                            <div className="rounded-full bg-green-900/60 p-1.5">
                                                <Wallet className="h-4 w-4 text-green-300" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="text-2xl font-bold truncate">
                                                {isLoadingBalance ? (
                                                    <Skeleton className="h-8 w-20 bg-gray-700" />
                                                ) : (
                                                    `${parseFloat(balance).toFixed(5)} ETH`
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="transition-all duration-300 p-4 w-full text-white bg-black/60 border-gray-800 hover:shadow-lg hover:border-blue-400 hover:shadow-blue-400/20">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Purchased datasets
                                            </CardTitle>
                                            <div className="rounded-full bg-blue-900/60 p-2">
                                                <CreditCard className="h-4 w-4 text-blue-300" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="text-2xl font-bold">
                                                {isDataLoading ? (
                                                    <Skeleton className="h-8 w-20 bg-gray-700" />
                                                ) : (
                                                    purchasedTokenIds?.length ||
                                                    0
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="transition-all duration-300 p-4 w-full text-white bg-black/60 border-gray-800 hover:shadow-lg hover:border-purple-400 hover:shadow-purple-400/20">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium">
                                                Minted datasets
                                            </CardTitle>
                                            <div className="rounded-full bg-purple-900/60 p-1.5">
                                                <StampIcon className="h-4 w-4 text-purple-300" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="text-2xl font-bold">
                                                {isDataLoading ? (
                                                    <Skeleton className="h-8 w-20 bg-gray-700" />
                                                ) : (
                                                    mintedTokenIds?.length || 0
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Middle Section - Chart and Activity */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full mb-6">
                                    {/* Chart Card - Takes up 2/3 of the space on large screens */}
                                    <Card className="lg:col-span-2 bg-black/60 border-gray-800 text-white p-5">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <CardTitle className="text-lg">
                                                    Minted Token Value
                                                </CardTitle>
                                                {isPriceLoading ? (
                                                    <span className="text-xs text-gray-400">
                                                        Updating...
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={
                                                            getTotalTokenPrice
                                                        }
                                                        className="text-xs text-blue-400 hover:text-blue-300"
                                                    >
                                                        Refresh
                                                    </button>
                                                )}
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="bg-black/40 p-4 rounded-lg border border-gray-800 mb-6">
                                                <h3 className="font-semibold text-sm">
                                                    Total Value (
                                                    {mintedTokenIds.length}{' '}
                                                    token
                                                    {mintedTokenIds.length !== 1
                                                        ? 's'
                                                        : ''}
                                                    )
                                                </h3>
                                                <p className="text-2xl font-bold">
                                                    {priceInEth.toFixed(6)} ETH
                                                </p>
                                                {priceHistory.length > 1 && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {priceHistory.length}{' '}
                                                        data points tracked
                                                    </p>
                                                )}
                                            </div>

                                            {isPriceLoading && !hasChartData ? (
                                                <div className="flex justify-center items-center h-64">
                                                    <p className="text-gray-400">
                                                        Loading price data...
                                                    </p>
                                                </div>
                                            ) : !hasChartData ? (
                                                <div className="flex justify-center items-center h-64">
                                                    <p className="text-gray-400">
                                                        No price history
                                                        available yet
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Simple bar chart for total price history */}
                                                    <TokenPriceLineChart
                                                        chartData={chartData}
                                                    />

                                                    {/* Price change indicators */}
                                                    {chartData.length >= 2 && (
                                                        <div className="mt-4 text-center">
                                                            {(() => {
                                                                const firstPrice =
                                                                    chartData[0]
                                                                        .totalPrice;
                                                                const lastPrice =
                                                                    chartData[
                                                                        chartData.length -
                                                                            1
                                                                    ]
                                                                        .totalPrice;
                                                                const priceChange =
                                                                    lastPrice -
                                                                    firstPrice;
                                                                const percentChange =
                                                                    (priceChange /
                                                                        firstPrice) *
                                                                    100;

                                                                if (
                                                                    priceChange ===
                                                                    0
                                                                )
                                                                    return (
                                                                        <p className="text-gray-400 text-sm">
                                                                            No
                                                                            price
                                                                            change
                                                                        </p>
                                                                    );

                                                                const isPositive =
                                                                    priceChange >
                                                                    0;
                                                                return (
                                                                    <p
                                                                        className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}
                                                                    >
                                                                        {isPositive
                                                                            ? '↑'
                                                                            : '↓'}{' '}
                                                                        {Math.abs(
                                                                            priceChange,
                                                                        ).toFixed(
                                                                            6,
                                                                        )}{' '}
                                                                        ETH (
                                                                        {isPositive
                                                                            ? '+'
                                                                            : ''}
                                                                        {percentChange.toFixed(
                                                                            2,
                                                                        )}
                                                                        %) since{' '}
                                                                        {
                                                                            chartData[0]
                                                                                .date
                                                                        }
                                                                    </p>
                                                                );
                                                            })()}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Bottom Section - Datasets */}
                                <div className="w-full">
                                    <Tabs
                                        defaultValue="purchased"
                                        className="w-full"
                                    >
                                        <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-2">
                                            <TabsList className="bg-gray-800">
                                                <TabsTrigger
                                                    value="purchased"
                                                    className="data-[state=active]:bg-blue-600"
                                                >
                                                    Purchased Datasets
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="minted"
                                                    className="data-[state=active]:bg-purple-600"
                                                >
                                                    Minted Datasets
                                                </TabsTrigger>
                                            </TabsList>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-white bg-gray-800 border-gray-700 hover:bg-gray-700"
                                                >
                                                    <Filter className="h-4 w-4 mr-2" />
                                                    Filter
                                                </Button>
                                                <Select
                                                    value={dataSort}
                                                    onValueChange={setDataSort}
                                                >
                                                    <SelectTrigger className="w-36 bg-gray-800 border-gray-700 text-white">
                                                        <SelectValue placeholder="Sort by" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-gray-900 border-gray-800 text-white">
                                                        <SelectItem value="az">
                                                            A-Z
                                                        </SelectItem>
                                                        <SelectItem value="za">
                                                            Z-A
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <TabsContent
                                            value="purchased"
                                            className="mt-0"
                                        >
                                            {isDataLoading ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {[1, 2, 3].map((item) => (
                                                        <TokenCard
                                                            key={item}
                                                            metadata={null}
                                                            tokenId=""
                                                            isLoading={true}
                                                        />
                                                    ))}
                                                </div>
                                            ) : purchasedTokenIds &&
                                              purchasedTokenIds.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {sortedPurchased.map(
                                                        (
                                                            { token, metadata },
                                                            index,
                                                        ) => (
                                                            <TokenCard
                                                                key={index}
                                                                metadata={
                                                                    metadata
                                                                }
                                                                tokenId={token}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
                                                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                                    <h3 className="text-xl font-medium text-white mb-2">
                                                        No purchased datasets
                                                    </h3>
                                                    <p className="text-gray-400 max-w-md mx-auto">
                                                        You haven&apos;t
                                                        purchased any datasets
                                                        yet. Browse the
                                                        marketplace to find
                                                        high-quality datasets.
                                                    </p>
                                                    <Link href="/market">
                                                        <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                                                            Browse Marketplace
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent
                                            value="minted"
                                            className="mt-0"
                                        >
                                            {isDataLoading ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {[1, 2, 3].map((item) => (
                                                        <TokenCard
                                                            key={item}
                                                            metadata={null}
                                                            tokenId=""
                                                            isLoading={true}
                                                        />
                                                    ))}
                                                </div>
                                            ) : mintedTokenIds &&
                                              mintedTokenIds.length > 0 ? (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {sortedMinted.map(
                                                        (
                                                            { token, metadata },
                                                            index,
                                                        ) => (
                                                            <TokenCard
                                                                key={index}
                                                                metadata={
                                                                    metadata
                                                                }
                                                                tokenId={token}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
                                                    <StampIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                                    <h3 className="text-xl font-medium text-white mb-2">
                                                        No minted datasets
                                                    </h3>
                                                    <p className="text-gray-400 max-w-md mx-auto">
                                                        You haven&apos;t minted
                                                        any datasets yet. Create
                                                        a new dataset listing to
                                                        start sharing your data.
                                                    </p>
                                                    <Link href="/listing">
                                                        <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                                                            Create New Listing
                                                        </Button>
                                                    </Link>
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="max-w-md">
                                    <Image
                                        src="/logo.svg"
                                        alt="TREENTEQ"
                                        width={180}
                                        height={60}
                                        className="mx-auto mb-6"
                                    />
                                    <h2 className="text-white text-2xl font-bold mb-4">
                                        Connect your wallet to access the
                                        dashboard
                                    </h2>
                                    <p className="text-gray-300 mb-6">
                                        The TREENTEQ platform allows you to
                                        create, mint, purchase and manage data
                                        assets securely on the blockchain.
                                    </p>
                                    <Button
                                        onClick={handleLogin}
                                        disabled={isLoggingIn}
                                        className="bg-[#00A340] border border-green-900 rounded-lg py-2 px-4 font-semibold text-white hover:bg-green-800 transition duration-300 flex items-center gap-2 mx-auto"
                                    >
                                        {isLoggingIn ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            'Connect Wallet'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
