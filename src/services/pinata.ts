import axios from "axios";

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

interface PinataResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
}

export const uploadToPinata = async (file: File): Promise<string> => {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        throw new Error("Pinata API keys not configured");
    }

    try {
        // Create form data
        const formData = new FormData();
        formData.append("file", file);

        // Upload file to IPFS
        const res = await axios.post<PinataResponse>(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                headers: {
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_KEY,
                    "Content-Type": "multipart/form-data",
                },
                maxBodyLength: Infinity, // Required for large files
            }
        );

        if (!res.data.IpfsHash) {
            throw new Error("Failed to get IPFS hash from Pinata");
        }

        return res.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        if (axios.isAxiosError(error)) {
            throw new Error(
                `Failed to upload to Pinata: ${
                    error.response?.data?.message || error.message
                }`
            );
        }
        throw new Error("Failed to upload to Pinata");
    }
};

export const getFromPinata = async (ipfsHash: string): Promise<string> => {
    if (!ipfsHash) {
        throw new Error("IPFS hash is required");
    }
    // Use public gateway for downloads
    return `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
};
