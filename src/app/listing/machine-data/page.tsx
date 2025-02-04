'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import logo from '../../../../public/logo.svg';
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import Link from 'next/link';
import machine from '../../../../public/machine.svg';

export default function MachineDataUpload() {
    const { authenticated, login, logout } = usePrivy();

    return (
        <>
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
                    <div className="flex justify-center items-center gap-5">
                        <Link href="/listing">
                            <Button className="text-white bg-[#0B170D] border border-green-900/80 hover:bg-green-700 transition duration-300 rounded-full w-auto p-3 px-7 font-semibold">
                                Back
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
            <main className="container mx-auto p-12 flex items-center justify-center max-w-6xl bg-black">
                <Card className="w-full max-w-xl p-12 space-y-8 border-[#00a340] border-2 bg-black text-center flex flex-col justify-center items-center">
                    <Image
                        src={machine}
                        alt="machine"
                        width={150}
                        height={200}
                    />
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white">
                            Coming Soon!
                        </h2>
                        <p className="text-xl text-gray-300">
                            Machine Data upload functionality will be available
                            in the next update.
                        </p>
                    </div>
                </Card>
            </main>
        </>
    );
}
