'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import ip from '../../../../public/ip-small.svg';
import Background from '@/components/background';
import NavBar from '@/components/NavBar';

export default function MachineDataUpload() {
    const { authenticated, login, logout } = usePrivy();

    return (
        <div className="min-h-screen relative inset-0 bg-gradient-to-bl from-[#373737] to-black flex flex-col">
            <div className="fixed inset-0 w-full h-full">
                <Background />
            </div>

            <NavBar
                authenticated={authenticated}
                login={login}
                logout={logout}
                primaryButton={{ text: 'Back', link: '/listing' }}
            />
            <main className="container mx-auto p-12 flex items-center justify-center max-w-6xl">
                <Card className="w-full max-w-xl p-12 space-y-8 border-white border-2 bg-black/30 text-center flex flex-col justify-center items-center">
                    <Image src={ip} alt="ip" width={60} height={60} />
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white">
                            Coming Soon!
                        </h2>
                        <p className="text-xl text-gray-300">
                            IP Registration on the Blockchain will be available
                            in the next update.
                        </p>
                    </div>
                </Card>
            </main>
        </div>
    );
}
