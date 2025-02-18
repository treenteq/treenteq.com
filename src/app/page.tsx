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
import { Loader2, Menu } from 'lucide-react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { createPublicClient, http, formatEther } from 'viem';
import { baseSepolia } from 'viem/chains';
import { DATASET_CONTRACT_ADDRESS, RPC_URL } from '@/utils/contractConfig';
import toast from 'react-hot-toast';
import DatasetTokenABI from '@/utils/DatasetTokenABI.json';
export default function Home() {
    const [balance, setBalance] = useState<string>('0');
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [tokenIds, setTokenIds] = useState<string[]>([]);

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
        } catch {
            setIsLoggingIn(false);
            setError('Failed to connect wallet');
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

    async function getTokens() {
        try {
            const tokenIds = await publicClient.readContract({
                address: DATASET_CONTRACT_ADDRESS,
                abi: DatasetTokenABI,
                functionName: 'getTokensByOwner',
                args: [activeWallet?.address],
            });
            setTokenIds(Array.isArray(tokenIds) ? tokenIds : []);
            console.log('Token IDs:', tokenIds);
        } catch (error) {
            console.error('Error fetching tokens:', error);
        }
    }

    useEffect(() => {
        if (activeWallet?.address) {
            getTokens();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="h-screen w-screen overflow-auto md:overflow-hidden relative inset-0 bg-gradient-to-bl from-[#373737] to-black flex flex-col items-center justify-center">
            <div className="absolute inset-0 w-full h-full overflow-auto hide-scrollbar">
                <Background />
            </div>

            <div className="absolute top-0 w-full flex flex-col justify-center items-center">
                {/* desktop header */}
                <nav className="sm:flex flex-row justify-between items-center w-5/6 py-5 hidden">
                    {/* logo */}
                    <Link href={'/'}>
                        <Image
                            src="/logo.svg"
                            alt="logo"
                            width={135}
                            height={45}
                        />
                    </Link>
                    <div className="flex flex-row gap-4">
                        {navItems.map((nav, index) =>
                            nav.external ? (
                                <a
                                    href={nav.path}
                                    key={index}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`font-semibold lg:font-lg ${
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
                                        className={`font-semibold lg:font-lg ${
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
                    <div className=" flex justify-center items-center gap-2">
                        <Link href={'/market'}>
                            <Image
                                src="./menu.svg"
                                alt="menu"
                                width={40}
                                height={40}
                                className="w-10 cursor-pointer"
                            />
                        </Link>
                        <div>
                            {authenticated && activeWallet ? (
                                <Button
                                    onClick={handleLogout}
                                    className="bg-red-700 rounded-lg p-3 font-semibold text-white hover:opacity-90 transition duration-300 flex items-center gap-2"
                                >
                                    {' '}
                                    Disconnect
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleLogin}
                                    disabled={isLoggingIn}
                                    className="bg-[#00A340] border border-green-900 rounded-lg p-3 font-semibold text-white hover:opacity-90 transition duration-300 flex items-center gap-2"
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
                    </div>
                </nav>
                {/* mobile header */}
                <nav className="flex justify-between items-center w-full p-5 md:hidden">
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Menu className="text-white" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-900/80">
                                {navItems.map((nav, index) => (
                                    <Link href={nav.path} key={index}>
                                        <DropdownMenuItem
                                            className={`font-semibold ${pathname === nav.path ? 'text-[#00A340]' : 'text-white'}`}
                                        >
                                            {nav.name}
                                        </DropdownMenuItem>
                                    </Link>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Link href={'/'}>
                        <Image
                            src="./logo.svg"
                            alt="logo"
                            width={20}
                            height={20}
                            className="w-28 h-20"
                        />
                    </Link>
                </nav>

                {/* main content */}
                <main className="w-5/6 flex flex-col items-center justify-center mt-9">
                    <div className="rounded-md border bg-black/55 border-white w-full h-52 p-6">
                        {activeWallet?.address ? (
                            <>
                                <p className="text-white text-xl">
                                    {getGreeting()}, {activeWallet.address}!
                                </p>
                                <p className="text-white">
                                    Your wallet balance is:{' '}
                                    {isLoadingBalance
                                        ? 'Loading...'
                                        : `${balance} ETH`}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-white text-xl">
                                    {getGreeting()}!
                                </p>
                                <p className="text-white">
                                    Connect your wallet to check your balance.
                                </p>
                            </>
                        )}
                    </div>
                    <div className="flex justify-centre w-full items-center mt-5">
                        <div className="w-52 h-52 border border-white rounded-md text-white text-lg bg-black/60 p-4 shadow-lg flex flex-col items-center justify-center">
                            <p className="text-xl font-semibold">
                                No. of dataset purchased
                            </p>
                            <p className="text-2xl font-bold">
                                {tokenIds.length}
                            </p>
                        </div>
                        <div>{''}</div>
                    </div>
                </main>
            </div>
        </div>
    );
}
