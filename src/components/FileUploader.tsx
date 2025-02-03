'use client';

import React from 'react';
import { Upload } from 'lucide-react';
import { keccak256, toHex } from 'viem';

interface FileUploaderProps {
    onUpload: (result: {
        success: boolean;
        errorDetails?: string;
        data?: string;
        file?: File;
    }) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // Read file content
            const arrayBuffer = await file.arrayBuffer();
            const content = new TextDecoder().decode(
                new Uint8Array(arrayBuffer),
            );

            // Generate content hash
            const contentHash = toHex(
                keccak256(new TextEncoder().encode(content)),
            );

            onUpload({
                success: true,
                data: contentHash,
                file: file,
            });
        } catch (error) {
            console.error('Error processing file:', error);
            onUpload({
                success: false,
                errorDetails: 'Error processing file. Please try again.',
            });
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
            >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                    Click to upload Excel or CSV file
                </span>
            </label>
            <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
            />
        </div>
    );
};

export default FileUploader;
