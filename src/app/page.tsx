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
            <Button disabled={disableLogout} onClick={authenticated ? logout : login}>
                {authenticated ? "Log out" : "Log in"}
            </Button>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
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
            
            <header className="relative z-10 flex justify-between items-center p-6">
                <div className="logo">
                    <Image 
                        src="/treenteq-logo.png" 
                        alt="TREENTEQ Logo" 
                        width={200} 
                        height={200} 
                        priority
                    />
                </div>
                <div className="flex items-center mt-4">
                    <Link href="/market">
                        <Button
                            variant="default"
                            className="marketplace-button mr-4 bg-[#00A340] text-white hover:bg-[#00A340] transition-colors duration-300"
                        >
                            Marketplace
                        </Button>
                    </Link>

                    {ready && !authenticated ? (
                        <Button
                            size="lg"
                            className="connect-wallet-button border-2 border-transparent bg-[#00A340] text-white hover:bg-[#00A340] transition-colors duration-300"
                            onClick={login}
                        >
                            Log In
                        </Button>
                    ) : (
                        <LogoutButton />
                    )}
                </div>
            </header>

            <main className="relative z-10 container mx-auto px-6 pt-3 pb-28">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight text-white"
                    >
                        Unlock the <span className="highlight">value</span> of your data
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.4 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Transform your raw data into valuable insights. Share,
                        analyze, and monetize your data securely on our
                        platform.
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
                            <div className="relative flex items-center">
                                <div className="relative flex-1">
                                    <CustomInput
                                        placeholder="Search for datasets..."
                                        className="flex-1 w-full pl-10 bg-[#DEE5C9] border border-[#00A340] placeholder-gray-600 rounded-r-none"
                                    />
                                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                                </div>
                                <Button 
                                    type="submit"
                                    className="h-12 rounded-l-none bg-[#00A340] text-white hover:bg-[#00A340]/90 transition-colors duration-300"
                                >
                                    Search
                                </Button>
                            </div>
                        </form>
                        <Link href="/listing">
                            <CustomButton
                                size="lg"
                                className="h-12 w-full sm:w-auto bg-[#00A340] text-white hover:bg-[#00A340] transition-colors duration-300"
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
                        color="bg-[#DEE5C9]"
                        iconColor="text-[#00a340]"
                    />
                    <FeatureCard
                        icon="bar-chart"
                        title="Data Analytics"
                        description="Analyze your data to uncover valuable insights."
                        color="bg-[#DEE5C9]"
                        iconColor="text-[#00a340]"
                    />
                    <FeatureCard
                        icon="dollar-sign"
                        title="Monetize"
                        description="Turn your data into a revenue-generating asset."
                        color="bg-[#DEE5C9]"
                        iconColor="text-[#00a340]"
                    />
                </motion.div>
            </main>
        </div>
    );
}
