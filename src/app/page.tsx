"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import BackgroundAnimation from "@/components/background-animation";
import FeatureCard from "@/components/feature-card";
import { CustomButton } from "@/components/ui/custom-button";
import { CustomInput } from "@/components/ui/custom-input";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SearchIcon } from 'lucide-react';

export default function Home() {
    const { ready, authenticated, login } = usePrivy();
    const router = useRouter();

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push("/market");
    };

    function LogoutButton() {
        const { ready, authenticated, logout } = usePrivy();
        // Disable logout when Privy is not ready or the user is not authenticated
        const disableLogout = !ready || (ready && !authenticated);

        return (
            <Button disabled={disableLogout} onClick={logout}>
                Log out
            </Button>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#D8E9A8]">
            <BackgroundAnimation />

            <header className="relative z-10 flex justify-between items-center p-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold text-gray-700"
                >
                    <Link href="/">
                        <Image
                            src="/treenteq-logo.png"
                            width={130}
                            height={130}
                            alt="Treenteq Logo"
                        />
                    </Link>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link href="/market">
                        <Button
                            variant="default"
                            className="marketplace-button mr-4 border-2 border-transparent bg-[#00A340] text-white hover:bg-[#00A340] hover:border-[#00A340] transition-colors duration-300"
                        >
                            Marketplace
                        </Button>
                    </Link>

                    {ready && !authenticated ? (
                        <Button
                            size="lg"
                            className="w-full sm:w-auto connect-wallet-button border-2 border-transparent bg-[#00A340] text-white hover:bg-[#00A340] hover:border-[#00A340] transition-colors duration-300"
                            onClick={login}
                        >
                            Connect Wallet
                        </Button>
                    ) : (
                        <LogoutButton />
                    )}
                </motion.div>
            </header>

            <main className="relative z-10 container mx-auto px-6 pt-20 pb-32">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900"
                    >
                        Unlock the <span className="highlight">value</span> of your data
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="text-xl text-gray-600 max-w-2xl mx-auto"
                    >
                        Transform your raw data into valuable insights. Share,
                        analyze, and monetize your data securely on our
                        platform.
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.6 }}
                        className="text-lg text-gray-500"
                    >
                        Join thousands of users who are already benefiting from
                        our data marketplace.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <form
                            onSubmit={handleSearch}
                            className="relative flex-1 max-w-md"
                        >
                            <div className="relative">
                                <CustomInput
                                    placeholder="Search for datasets..."
                                    className="flex-1 max-w-md pl-10"
                                />
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                            </div>
                        </form>
                        <Link href="/listing">
                            <CustomButton
                                size="lg"
                                className="w-full sm:w-auto bg-[#00A340] text-white hover:bg-[#00A340] transition-colors duration-300"
                            >
                                List your data
                            </CustomButton>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 1 }}
                    className="grid md:grid-cols-3 gap-8 mt-24"
                >
                    <FeatureCard
                        icon="lock"
                        title="Secure Upload"
                        description="Upload and store your data with top-notch security."
                        color="bg-white"
                        iconColor="text-blue-500"
                    />
                    <FeatureCard
                        icon="bar-chart"
                        title="Data Analytics"
                        description="Analyze your data to uncover valuable insights."
                        color="bg-white"
                        iconColor="text-green-500"
                    />
                    <FeatureCard
                        icon="dollar-sign"
                        title="Monetize"
                        description="Turn your data into a revenue-generating asset."
                        color="bg-white"
                        iconColor="text-purple-500"
                    />
                </motion.div>
            </main>
        </div>
    );
}
