"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Card } from "@/components/ui/card";
import FileUploader from "@/components/FileUploader";
import MintDatasetToken from "@/components/MintingComp";
import { CustomButton } from "@/components/ui/custom-button";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/logo.svg";

export default function LegacyDataUpload() {
    const { ready, authenticated, login, logout } = usePrivy();
    const [file, setFile] = useState<File | null>(null);
    const [contentHash, setContentHash] = useState<string | null>(null);

    const handleUploadResult = (result: {
        success: boolean;
        errorDetails?: string;
        data?: string;
        file?: File;
    }) => {
        if (result.success && result.data && result.file) {
            setContentHash(result.data);
            setFile(result.file);
            toast.success("File upload successful!");
        } else {
            setContentHash(null);
            setFile(null);
            toast.error(result.errorDetails || "Upload failed");
        }
    };

    if (!ready) return null;

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
                                className="brightness-110 contrast-125"
                                priority
                            />
                            </Link>
                        </div>
                        <div>
                            <div className="flex justify-center items-center gap-5">
                                <Link href="/listing">
                                <Button className="text-white bg-[#0B170D] border border-green-900/80 hover:bg-green-700 transition duration-300 rounded-full w-auto p-3 px-7 font-semibold">Back</Button>
                                </Link>
                                <Button onClick={authenticated ? logout : login} className="bg-gradient-to-r from-[#00A340] to-[#00000080] border border-green-900 rounded-full p-3 font-semibold text-white hover:opacity-90 transition duration-300">
                                    {authenticated ? "Disconnect" : "Connect Wallet"}
                                </Button>
                            </div>
                        </div>
                </header>
            <main className="container mx-auto p-12 flex items-center justify-center max-w-6xl bg-black">
                <Card className="w-full max-w-xl p-6 space-y-6 border-[#00a340] border-2 bg-black">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white">
                            List Legacy Data
                        </h2>
                        <p className="text-sm text-gray-300">
                            Upload your data in .csv or .xlsx format. Make sure
                            your data is properly formatted and contains no
                            sensitive information.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="border-2 border-dashed rounded-lg p-8 transition-colors border-gray-200">
                            <div className="flex flex-col items-center justify-center text-center">
                                <FileUploader onUpload={handleUploadResult} />
                            </div>
                        </div>

                        <div className="text-sm text-gray-500">
                            Supported formats: .csv, .xlsx
                        </div>

                        {authenticated ? (
                            <div className="space-y-4">
                                {contentHash && (
                                    <MintDatasetToken
                                        contentHash={contentHash}
                                        file={file}
                                    />
                                )}
                            </div>
                        ) : (
                            <CustomButton onClick={login} className="w-full">
                                Connect Wallet to Continue
                            </CustomButton>
                        )}
                    </div>
                </Card>
            </main>
        </>
    );
}
