import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface DatasetMetadata {
    name: string;
    description: string;
    contentHash: string;
}

interface DatasetCardProps {
    tokenId: bigint;
    metadata: DatasetMetadata;
    balance: bigint;
    onVerify: (tokenId: bigint, uploadedDataHash: string) => Promise<void>;
}

const DatasetCard: React.FC<DatasetCardProps> = ({
    tokenId,
    metadata,
    balance,
    onVerify,
}) => {
    const [verifying, setVerifying] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleVerify = async () => {
        if (!selectedFile) {
            alert('Please select a file to verify');
            return;
        }

        setVerifying(true);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const dataString = JSON.stringify(Array.from(data));
                const uploadedDataHash = dataString; // You should use the same hashing method as when minting
                await onVerify(tokenId, uploadedDataHash);
            };
            reader.readAsArrayBuffer(selectedFile);
        } catch (error) {
            console.error('Error verifying dataset:', error);
            alert('Error verifying dataset');
        } finally {
            setVerifying(false);
            setSelectedFile(null);
        }
    };

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-2">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{metadata.name}</h3>
                    <span className="text-sm text-gray-500">
                        Token ID: {tokenId.toString()}
                    </span>
                </div>
                <p className="text-gray-600">{metadata.description}</p>
                <div className="text-sm text-gray-500 break-all">
                    <span className="font-medium">Content Hash:</span>{' '}
                    {metadata.contentHash}
                </div>
                <div className="text-sm text-gray-500">
                    <span className="font-medium">Your Balance:</span>{' '}
                    {balance.toString()}
                </div>
                <div className="space-y-2">
                    <input
                        type="file"
                        onChange={handleFileSelect}
                        className="w-full text-sm"
                        accept=".xlsx,.xls"
                    />
                    <Button
                        className="w-full"
                        variant="outline"
                        onClick={handleVerify}
                        disabled={verifying || !selectedFile}
                    >
                        {verifying ? 'Verifying...' : 'Verify Dataset'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DatasetCard;
