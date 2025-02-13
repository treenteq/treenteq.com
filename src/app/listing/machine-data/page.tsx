'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import machine from '../../../../public/machine.svg';
import Background from '@/components/background';
import NavBar from '@/components/NavBar';

export default function MachineDataUpload() {
    const { authenticated, login, logout } = usePrivy();

    return (
        <div className="inset-0 bg-gradient-to-bl from-[#373737] to-black">
            <Background />
            <div className="absolute top-0 w-full">
                <NavBar
                    authenticated={authenticated}
                    login={login}
                    logout={logout}
                    primaryButton={{ text: 'Back', link: '/listing' }}
                />
                <main className="container mx-auto p-12 flex items-center justify-center max-w-6xl">
                    <Card className="w-full max-w-xl p-12 space-y-8 border-white border-2 bg-black/30 text-center flex flex-col justify-center items-center">
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
                                Machine Data upload functionality will be
                                available in the next update.
                            </p>
                        </div>
                    </Card>
                </main>
            </div>
        </div>
    );
}
