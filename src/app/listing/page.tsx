"use client";

import React from "react";
import { useRouter } from "next/navigation";
import legacy from "../../../public/legacy.svg";
import machine from "../../../public/machine.svg";
import social from "../../../public/social.svg";
import Link from "next/link";
import BackgroundAnimation from "@/components/background-animation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { FaArrowLeft } from "react-icons/fa6";

export default function ListingPage() {
    const { authenticated, login, logout } = usePrivy();
    const router = useRouter();

    const dataTypes = [
        {
            title: "Social Data",
            description:
                "Upload your Digital Footprint from various Social Media sources",
            icon: social,
            route: "/listing/social-data",
        },
        {
            title: "Legacy Data",
            description: "Upload traditional Excel and CSV files",
            icon: legacy,
            route: "/listing/legacy-data",
        },
        {
            title: "Machine Data",
            description: "Coming Soon!",
            icon: machine,
            route: "/listing/machine-data",
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
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
                            src="./logo.svg"
                            alt="TREENTEQ Logo"
                            width={145}
                            height={50}
                            className="brightness-110 contrast-125"
                            priority
                        />
                    </Link>
                </div>
                <div>
                    <div className="flex justify-center items-center gap-5">
                        <Link href="/">
                            <Button className="text-white bg-[#0B170D] border border-green-900/80 hover:bg-green-700 transition duration-300 rounded-full w-auto font-semibold px-7">
                                Home
                            </Button>
                        </Link>
                        <Button
                            onClick={authenticated ? logout : login}
                            className="bg-gradient-to-r from-[#00A340] to-[#00000080] border border-green-900 rounded-full p-3 font-semibold text-white hover:opacity-90 transition duration-300"
                        >
                            {authenticated ? "Disconnect" : "Connect Wallet"}
                        </Button>
                    </div>
                </div>
            </header>
            {/* main content */}
            <div className="container mx-auto px-6 py-8 relative z-10 space-y-6 max-w-4xl">
                <Link href="/market">
                    <div className="flex justify-start gap-2 items-center cursor-pointer">
                        <FaArrowLeft className="text-[#00A340] text-lg" />
                        <h1 className="text-[20px] text-white">Back</h1>
                    </div>
                </Link>
                <div className="mt-8">
                    <h1 className="text-3xl font-semibold mb-8 text-center text-white">
                        Choose Your <span className="text-[#00A340]">Data</span>{" "}
                        To Treen
                    </h1>
                    <div className="grid md:grid-cols-3 gap-8">
                        {dataTypes.map((type) => (
                            <div
                                key={type.title}
                                className="bg-[#1A5617]/60 rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-[0_0_10px_4px_#00A340] transition-shadow duration-300 backdrop-blur-[10px] border border-[#00A340]"
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
    );
}
