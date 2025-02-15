'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import legacy from '../../../public/legacy.svg';
import machine from '../../../public/machine.svg';
import social from '../../../public/social.svg';
import Link from 'next/link';
import Image from 'next/image';
import { usePrivy } from '@privy-io/react-auth';
import { FaArrowLeft } from 'react-icons/fa6';
import Background from '@/components/background';
import NavBar from '@/components/NavBar';

export default function ListingPage() {
    const { authenticated, login, logout } = usePrivy();
    const router = useRouter();

    const dataTypes = [
        {
            title: 'Social Data',
            description:
                'Upload your Digital Footprint from various Social Media sources',
            icon: social,
            route: '/listing/social-data',
        },
        {
            title: 'Legacy Data',
            description: 'Upload traditional Excel and CSV files',
            icon: legacy,
            route: '/listing/legacy-data',
        },
        {
            title: 'Machine Data',
            description: 'Coming Soon!',
            icon: machine,
            route: '/listing/machine-data',
        },
    ];

    return (
        <div className="relative min-h-screen overflow-y-hidden inset-0 bg-gradient-to-bl from-[#373737] to-black">
            <Background />
            <div className="w-full absolute top-0">
                <NavBar
                    authenticated={authenticated}
                    login={login}
                    logout={logout}
                    primaryButton={{ text: 'Back', link: '/market' }}
                />
                {/* main content */}
                <div className="container mx-auto px-4 py-8 relative z-10 space-y-6  lg:px-40 ">
                    <Link href="/">
                        <div className="flex justify-start gap-2 items-center cursor-pointer">
                            <FaArrowLeft className="text-[#00A340] text-lg" />
                            <h1 className="text-[20px] text-white">Back</h1>
                        </div>
                    </Link>
                    <div className="mt-8">
                        <h1 className="text-3xl font-semibold mb-8 text-center text-white">
                            Choose Your{' '}
                            <span className="text-[#00A340]">Data</span> To
                            Treen
                        </h1>
                        <div className="grid md:grid-cols-3 gap-8">
                            {dataTypes.map((type) => (
                                <div
                                    key={type.title}
                                    className="bg-black/30 rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_0_10px_4px_#00A340] transition-shadow duration-300 backdrop-blur-[10px] border border-white hover:border-green-500"
                                    onClick={() => router.push(type.route)}
                                >
                                    <div className="flex flex-row justify-center items-center gap-1 pb-7">
                                        <Image
                                            src={type.icon}
                                            alt={type.description}
                                            className="mb-2"
                                        />
                                        <h2 className="text-xl font-semibold mb-2 text-white">
                                            {type.title}
                                        </h2>
                                    </div>
                                    <p className="text-gray-300">
                                        {type.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
