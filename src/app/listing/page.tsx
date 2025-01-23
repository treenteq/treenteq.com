"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { keccak256, toHex } from "viem";
import { Card } from "@/components/ui/card";
import ExcelValidator from "@/components/ExcelValidator";
import MintDatasetToken from "@/components/MintingComp";
import { CustomButton } from "@/components/ui/custom-button";
import toast from "react-hot-toast";

interface ValidationResult {
    success: boolean;
    errorDetails?: string;
    data?: (string | number | boolean)[][];
    file?: File;
}

export default function DataUpload() {
    const { ready, authenticated, login } = usePrivy();
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [contentHash, setContentHash] = useState<string | null>(null);

    const handleValidationResult = (validationResult: ValidationResult) => {
        if (validationResult.success && validationResult.data) {
            // Convert the dataset to a hashable string and generate the content hash
            const datasetString = JSON.stringify(validationResult.data);
            const hash = toHex(
                keccak256(new TextEncoder().encode(datasetString))
            );
            setContentHash(hash);
            setFile(validationResult.file || null);
            toast.success("File validation successful!");
        } else if (!validationResult.success && validationResult.errorDetails) {
            setContentHash(null);
            setFile(null);
            toast.error(validationResult.errorDetails);
        }
    };

    if (!ready) return null;

    return (
        <main className="container mx-auto p-4 max-w-6xl bg-black">
            <Card className="w-full max-w-xl p-6 space-y-6 border-gray-800 border-2 bg-black">
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">
                        List Your Data
                    </h2>
                    <p className="text-sm text-gray-300">
                        Upload your data in .csv or .xlsx format. Make sure your
                        data is properly formatted and contains no sensitive
                        information.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="border-2 border-dashed rounded-lg p-8 transition-colors border-gray-200">
                        <div className="flex flex-col items-center justify-center text-center">
                            <ExcelValidator
                                onValidation={handleValidationResult}
                            />
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
                            variant="outline"
                            onClick={() => router.push("/")}
                            className="border-gray-500 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </CustomButton>
                    </div>
                </div>
            </Card>
        </main>
    );
}
