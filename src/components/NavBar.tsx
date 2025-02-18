'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { formatEther, createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { Wallet, ChevronDown, AlertCircle, Loader2 } from 'lucide-react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RPC_URL } from '@/utils/contractConfig';

interface NavbarProps {
    primaryButton: { text: string; link: string };
}

export default function NavBar({ primaryButton }: NavbarProps) {
    const [balance, setBalance] = useState<string>('0');
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const { wallets } = useWallets();
    const { login, logout, authenticated, ready } = usePrivy();

    const activeWallet = wallets?.[0];

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
    }, []);

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

    const formatAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const WalletInfo = () => (
        <Popover>
            <PopoverTrigger asChild>
                <Button className="bg-[#00A340] border border-green-900 rounded-lg p-3 font-semibold text-white hover:opacity-90 transition duration-300 flex items-center gap-2">
                    <Wallet size={16} />
                    <span className="hidden md:inline">
                        {activeWallet?.address
                            ? formatAddress(activeWallet.address)
                            : 'Loading...'}
                    </span>
                    <ChevronDown size={16} />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 bg-[#0B170D] border border-green-900 text-white">
                <div className="space-y-3">
                    <div className="border-b border-green-900 pb-2">
                        <p className="text-sm text-gray-400">
                            Connected Address
                        </p>
                        <p className="text-sm font-medium">
                            {activeWallet?.address
                                ? formatAddress(activeWallet.address)
                                : 'Not available'}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-400">Balance</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">ETH</span>
                            <span className="text-sm font-medium">
                                {isLoadingBalance ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Loading...</span>
                                    </div>
                                ) : (
                                    Number(balance).toFixed(4)
                                )}
                            </span>
                        </div>
                    </div>
                    {error && (
                        <Alert
                            variant="destructive"
                            className="bg-red-900/20 border-red-900"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Button
                        onClick={handleLogout}
                        className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white border-none"
                    >
                        Disconnect
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );

    if (!ready) {
        return (
            <div className="w-full flex justify-center items-center">
                <header className="relative z-10 flex justify-between items-center w-5/6 py-5">
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
                    <div className="flex justify-center items-center gap-3 sm:gap-5 lg:gap-2">
                        <Button
                            disabled
                            className="bg-[#00A340] opacity-50 rounded-lg p-3 font-semibold text-white"
                        >
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                        </Button>
                    </div>
                </header>
            </div>
        );
    }

    return (
        <div className="w-full flex justify-center items-center">
            <header className="relative z-10 flex justify-between items-center w-5/6 py-5">
                {/* Logo */}
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

                {/* Buttons */}
                <div className="flex justify-center items-center gap-3 sm:gap-5 lg:gap-2">
                    <Link href={primaryButton.link}>
                        <Button className="text-white bg-[#0B170D] border border-white hover:bg-green-700 transition duration-300 rounded-lg w-auto font-semibold">
                            {primaryButton.text}
                        </Button>
                    </Link>
                    {authenticated && activeWallet ? (
                        <WalletInfo />
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
            </header>
        </div>
    );
}
