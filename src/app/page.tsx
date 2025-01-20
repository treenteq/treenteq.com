"use client";
import React, { useState } from "react";
import ExcelValidator from "@/components/ExcelValidator";
import MintDatasetToken from "@/components/MintingComp";
import { Button } from "@/components/ui/button";
import { usePrivy } from "@privy-io/react-auth";
import { keccak256, toHex } from "viem";

export default function Home() {
    const { ready, authenticated, login } = usePrivy();
    const [contentHash, setContentHash] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleValidationResult = (validationResult: {
        success: boolean;
        errorDetails?: string;
        data?: (string | number | boolean)[][];
        file?: File;
    }) => {
        if (validationResult.success && validationResult.data) {
            // Convert the dataset to a hashable string and generate the content hash
            const datasetString = JSON.stringify(validationResult.data);
            const hash = toHex(
                keccak256(new TextEncoder().encode(datasetString))
            );
            setContentHash(hash);
            setSelectedFile(validationResult.file || null);
            console.log("Content hash generated:", hash);
        } else if (!validationResult.success && validationResult.errorDetails) {
            setContentHash(null);
            setSelectedFile(null);
            alert(`Validation failed:\n${validationResult.errorDetails}`);
        }
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
        <main className="container mx-auto p-4 max-w-3xl">
            <div className="space-y-6">
                <LogoutButton />
                {ready && !authenticated ? (
                    <Button onClick={login} className="w-full">
                        Connect Wallet
                    </Button>
                ) : null}

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold">
                        Dataset Validator & Tokenizer
                    </h1>
                    <p className="text-gray-600">
                        Upload your Excel file to validate and tokenize your
                        dataset.
                    </p>
                </div>

                <div className="border rounded-lg p-4 bg-white shadow-sm">
                    <ExcelValidator onValidation={handleValidationResult} />
                </div>

                {authenticated && (
                    <div className="border rounded-lg p-4 bg-white shadow-sm">
                        <MintDatasetToken
                            contentHash={contentHash}
                            file={selectedFile}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
