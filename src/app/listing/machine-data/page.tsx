"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/custom-button";
import { Cpu } from "lucide-react";

export default function MachineDataUpload() {
    const router = useRouter();

    return (
        <>
            <header className="flex items-center justify-between p-4 bg-transparent">
                <div className="flex items-center">
                    <img
                        src="/treenteq-logo.png"
                        alt="Treenteq Logo"
                        className="h-12"
                    />
                </div>
                <nav className="space-x-4">
                    <CustomButton
                        onClick={() => router.push("/listing")}
                        className="text-white"
                    >
                        Back
                    </CustomButton>
                </nav>
            </header>
            <main className="container mx-auto p-12 flex items-center justify-center max-w-6xl bg-black">
                <Card className="w-full max-w-xl p-12 space-y-8 border-[#00a340] border-2 bg-black text-center">
                    <Cpu className="h-24 w-24 mx-auto text-[#00A340]" />
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
