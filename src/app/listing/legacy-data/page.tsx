"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import FileUploader from "@/components/FileUploader";
import MintDatasetToken from "@/components/MintingComp";
import { CustomButton } from "@/components/ui/custom-button";
import toast from "react-hot-toast";

export default function LegacyDataUpload() {
    const { ready, authenticated, login, logout } = usePrivy();
    const router = useRouter();
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
                        onClick={() => router.push("/")}
                        className="text-white"
                    >
                        Home
                    </CustomButton>
                    <CustomButton
                        onClick={authenticated ? logout : login}
                        className="text-white"
                    >
                        {authenticated ? "Log out" : "Log in"}
                    </CustomButton>
                </nav>
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

                        <div className="flex justify-end space-x-4">
                            <CustomButton
                                onClick={() => router.push("/listing")}
                                className="border-gray-500 text-gray-700 hover:bg-gray-50"
                            >
                                Back
                            </CustomButton>
                        </div>
                    </div>
                </Card>
            </main>
        </>
    );
}
