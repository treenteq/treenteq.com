'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Card } from '@/components/ui/card';
import FileUploader from '@/components/FileUploader';
import MintDatasetToken from '@/components/MintingComp';
import { CustomButton } from '@/components/ui/custom-button';
import toast from 'react-hot-toast';
import Background from '@/components/background';
import NavBar from '@/components/NavBar';

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
            toast.success('File upload successful!');
        } else {
            setContentHash(null);
            setFile(null);
            toast.error(result.errorDetails || 'Upload failed');
        }
    };

    if (!ready) return null;

    return (
        <div className="min-h-screen relative inset-0 bg-gradient-to-bl from-[#373737] to-black flex flex-col">
            <div className="absolute inset-0 -z-0 min-h-screen w-full overflow-hidden pointer-events-none">
                <Background />
            </div>

            <NavBar
                authenticated={authenticated}
                login={login}
                logout={logout}
                primaryButton={{ text: 'Back', link: '/listing' }}
            />

            <main className="container mx-auto p-12 flex flex-grow items-center justify-center max-w-6xl">
                <Card className="w-full max-w-xl p-6 space-y-6 border-[#00a340] border-2 bg-black/30">
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
        </div>
    );
}
