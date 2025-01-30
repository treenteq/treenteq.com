// /* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { Card } from "@/components/ui/card";

// import React, { useEffect, useState } from "react";
// import { usePrivy, useWallets } from "@privy-io/react-auth";
// import { Button } from "@/components/ui/button";
// import {
//     createPublicClient,
//     createWalletClient,
//     http,
//     formatEther,
//     custom,
// } from "viem";
// import { baseSepolia } from "viem/chains";
// import DatasetTokenABI from "@/utils/DatasetTokenABI.json";
// import Link from "next/link";
// import { CONTRACT_ADDRESS, RPC_URL } from "@/utils/contractConfig";
// import { Download, Search, Tag } from "lucide-react";
// import toast, { Toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import BackgroundAnimation from "@/components/background-animation";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { OwnershipShare } from "@/hooks/useDatasetToken";

// interface RawMetadata extends Array<string | bigint> {
//     0: string; // name
//     1: string; // description
//     2: string; // contentHash
//     3: string; // ipfsHash
//     4: bigint; // price
// }

// interface DatasetMetadata {
//     name: string;
//     description: string;
//     contentHash: string;
//     ipfsHash: string;
//     price: bigint;
//     tags: string[];
//     owners: OwnershipShare[];
// }

// interface TokenData {
//     tokenId: bigint;
//     metadata: DatasetMetadata;
//     balance: bigint;
// }

// const BASE_EXPLORER_URL = "https://sepolia.basescan.org";

// const downloadFromPinata = async (ipfsHash: string, filename: string) => {
//     const toastId = toast.loading("Downloading dataset...");
//     try {
//         const response = await fetch(
//             `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch file from Pinata");

//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = filename;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//         toast.success("Dataset downloaded successfully!", { id: toastId });
//     } catch (error) {
//         console.error("Download error:", error);
//         toast.error("Failed to download the dataset. Please try again.", {
//             id: toastId,
//         });
//     }
// };

// const DatasetCard: React.FC<{
//     token: TokenData;
//     onPurchase: (tokenId: bigint, price: bigint) => Promise<void>;
//     isOwner: boolean;
// }> = ({ token, onPurchase, isOwner }) => {
//     if (!token?.metadata) {
//         return null;
//     }

//     const handleDownload = async () => {
//         const filename = `${token.metadata.name.replace(
//             /[^a-zA-Z0-9]/g,
//             "_"
//         )}.zip`;
//         await downloadFromPinata(token.metadata.ipfsHash, filename);
//     };

//     const formatPercentage = (percentage: bigint) => {
//         // Convert from basis points (10000 = 100%) to a decimal string
//         const whole = percentage / BigInt(100);
//         const fraction = percentage % BigInt(100);
//         const fractionStr = fraction.toString().padStart(2, "0");
//         return `${whole}.${fractionStr}%`;
//     };

//     return (
//         <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
//             <div className="space-y-4">
//                 <div className="space-y-2">
//                     <div className="flex justify-between items-start">
//                         <h3 className="text-lg font-semibold">
//                             {token.metadata.name}
//                         </h3>
//                         <span className="text-sm text-gray-500">
//                             ID: {token.tokenId.toString()}
//                         </span>
//                     </div>
//                     <p className="text-gray-600 line-clamp-2">
//                         {token.metadata.description}
//                     </p>

//                     <div className="flex flex-wrap gap-1 mt-2">
//                         {token.metadata.tags.map((tag) => (
//                             <span
//                                 key={tag}
//                                 className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs flex items-center gap-1"
//                             >
//                                 <Tag className="w-3 h-3" />
//                                 {tag}
//                             </span>
//                         ))}
//                     </div>

//                     <div className="mt-4">
//                         <h4 className="text-sm font-semibold text-gray-700 mb-1">
//                             Owners
//                         </h4>
//                         <div className="space-y-1">
//                             {token.metadata.owners.map((owner, index) => (
//                                 <div
//                                     key={index}
//                                     className="flex justify-between text-xs text-gray-500"
//                                 >
//                                     <span className="truncate flex-1">
//                                         {owner.owner}
//                                     </span>
//                                     <span className="ml-2">
//                                         {formatPercentage(
//                                             BigInt(owner.percentage)
//                                         )}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     <div className="flex justify-between items-center pt-2">
//                         <div className="text-lg font-bold">
//                             {formatEther(token.metadata.price)} ETH
//                         </div>
//                         {!isOwner && (
//                             <Button
//                                 onClick={() =>
//                                     onPurchase(
//                                         token.tokenId,
//                                         token.metadata.price
//                                     )
//                                 }
//                                 className="bg-gray-700 text-white hover:bg-[#00A340] transition-colors duration-300"
//                             >
//                                 Purchase
//                             </Button>
//                         )}
//                         {isOwner && (
//                             <div className="flex items-center gap-2">
//                                 <span className="text-sm text-green-600 font-medium">
//                                     You own this
//                                 </span>
//                                 <Button
//                                     onClick={handleDownload}
//                                     variant="outline"
//                                     size="sm"
//                                     className="flex items-center gap-1"
//                                 >
//                                     <Download className="w-4 h-4" />
//                                     Download
//                                 </Button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default function Market() {
//     const { ready, authenticated, login, logout, user } = usePrivy();
//     const { wallets } = useWallets();
//     const [tokens, setTokens] = useState<TokenData[]>([]);
//     const [filteredTokens, setFilteredTokens] = useState<TokenData[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//     const [searchTerm, setSearchTerm] = useState("");
//     const router = useRouter();

//     const publicClient = createPublicClient({
//         chain: baseSepolia,
//         transport: http(RPC_URL),
//     });

//     const handlePurchase = async (tokenId: bigint, price: bigint) => {
//         if (!authenticated || !user?.wallet?.address) {
//             toast.error("Please connect your wallet first");
//             return;
//         }

//         const toastId = toast.loading("Processing purchase...");

//         try {
//             // Get the active wallet
//             const activeWallet = wallets[0]; // Usually the first wallet is the active one
//             if (!activeWallet) {
//                 throw new Error("No wallet connected");
//             }

//             // Switch to Base Sepolia
//             await activeWallet.switchChain(baseSepolia.id);

//             // Get the provider from the wallet
//             const provider = await activeWallet.getEthereumProvider();

//             // Create wallet client using Privy's provider
//             const walletClient = createWalletClient({
//                 account: user.wallet.address as `0x${string}`,
//                 chain: baseSepolia,
//                 transport: custom(provider),
//             });

//             // Call the purchase function on the contract
//             const hash = await walletClient.writeContract({
//                 address: CONTRACT_ADDRESS,
//                 abi: DatasetTokenABI,
//                 functionName: "purchaseDataset",
//                 args: [tokenId],
//                 value: price,
//             });

//             const receipt = await publicClient.waitForTransactionReceipt({
//                 hash,
//             });

//             toast.success(
//                 (t: Toast) => (
//                     <div>
//                         Purchase successful! You can now access the dataset.
//                         <a
//                             href={`${BASE_EXPLORER_URL}/tx/${receipt.transactionHash}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="block mt-2 text-blue-500 hover:underline"
//                             onClick={() => toast.dismiss(t.id)}
//                         >
//                             View on Block Explorer
//                         </a>
//                     </div>
//                 ),
//                 { id: toastId, duration: 5000 }
//             );

//             // Refresh the token list
//             window.location.reload();
//         } catch (error) {
//             console.error("Purchase error:", error);
//             if (error instanceof Error) {
//                 toast.error(`Error purchasing dataset: ${error.message}`, {
//                     id: toastId,
//                 });
//             } else {
//                 toast.error(
//                     "Error purchasing dataset. Check console for details.",
//                     {
//                         id: toastId,
//                     }
//                 );
//             }
//         }
//     };

//     const handleSearch = (term: string) => {
//         setSearchTerm(term);
//         if (!term.trim()) {
//             setFilteredTokens(tokens);
//             return;
//         }

//         const searchTerms = term.toLowerCase().split(/\s+/);
//         const filtered = tokens.filter((token) => {
//             // Check if any search term exactly matches a tag
//             const tagMatches = searchTerms.some((term) =>
//                 token.metadata.tags.some((tag) => tag.toLowerCase() === term)
//             );

//             // Check if search terms match name or description
//             const textContent = [
//                 token.metadata.name,
//                 token.metadata.description,
//             ]
//                 .join(" ")
//                 .toLowerCase();

//             const textMatches = searchTerms.every((term) =>
//                 textContent.includes(term)
//             );

//             return tagMatches || textMatches;
//         });

//         setFilteredTokens(filtered);
//     };

//     useEffect(() => {
//         const fetchTokens = async () => {
//             try {
//                 setError(null);
//                 console.log("Fetching tokens from contract:", CONTRACT_ADDRESS);

//                 const totalTokens = (await publicClient.readContract({
//                     address: CONTRACT_ADDRESS,
//                     abi: DatasetTokenABI,
//                     functionName: "getTotalTokens",
//                 })) as bigint;

//                 console.log("Total tokens:", totalTokens.toString());

//                 if (totalTokens === BigInt(0)) {
//                     setTokens([]);
//                     setFilteredTokens([]);
//                     setLoading(false);
//                     return;
//                 }

//                 const tokenPromises = [];
//                 for (let i = BigInt(0); i < totalTokens; i = i + BigInt(1)) {
//                     tokenPromises.push(
//                         (async () => {
//                             try {
//                                 // Get metadata
//                                 const metadata =
//                                     (await publicClient.readContract({
//                                         address: CONTRACT_ADDRESS,
//                                         abi: DatasetTokenABI,
//                                         functionName: "tokenMetadata",
//                                         args: [i],
//                                     })) as RawMetadata;

//                                 // Get tags
//                                 const tags = (await publicClient.readContract({
//                                     address: CONTRACT_ADDRESS,
//                                     abi: DatasetTokenABI,
//                                     functionName: "getTokenTags",
//                                     args: [i],
//                                 })) as string[];

//                                 // Get owners
//                                 const owners = (await publicClient.readContract(
//                                     {
//                                         address: CONTRACT_ADDRESS,
//                                         abi: DatasetTokenABI,
//                                         functionName: "getTokenOwners",
//                                         args: [i],
//                                     }
//                                 )) as OwnershipShare[];

//                                 console.log(
//                                     `Raw metadata for token ${i}:`,
//                                     metadata
//                                 );
//                                 console.log(`Tags for token ${i}:`, tags);
//                                 console.log(`Owners for token ${i}:`, owners);

//                                 // Get balance if user is authenticated
//                                 const balance =
//                                     authenticated && user?.wallet?.address
//                                         ? ((await publicClient.readContract({
//                                               address: CONTRACT_ADDRESS,
//                                               abi: DatasetTokenABI,
//                                               functionName: "balanceOf",
//                                               args: [user.wallet.address, i],
//                                           })) as bigint)
//                                         : BigInt(0);

//                                 // Combine all metadata
//                                 const fullMetadata = {
//                                     name: metadata[0],
//                                     description: metadata[1],
//                                     contentHash: metadata[2],
//                                     ipfsHash: metadata[3],
//                                     price: metadata[4],
//                                     tags,
//                                     owners,
//                                 };

//                                 console.log(
//                                     `Full metadata for token ${i}:`,
//                                     fullMetadata
//                                 );

//                                 return {
//                                     metadata: fullMetadata,
//                                     balance,
//                                 };
//                             } catch (error) {
//                                 console.error(
//                                     `Error fetching token ${i}:`,
//                                     error
//                                 );
//                                 return null;
//                             }
//                         })()
//                     );
//                 }

//                 const tokensData = await Promise.all(tokenPromises);
//                 const formattedTokens = tokensData
//                     .map((data, index) => {
//                         if (!data) return null;
//                         const { metadata, balance } = data;

//                         // Validate required fields
//                         if (
//                             !metadata ||
//                             !metadata.name ||
//                             !metadata.price ||
//                             !Array.isArray(metadata.tags) ||
//                             !Array.isArray(metadata.owners) ||
//                             metadata.owners.length === 0
//                         ) {
//                             console.error(
//                                 `Invalid metadata for token ${index}:`,
//                                 metadata
//                             );
//                             return null;
//                         }

//                         return {
//                             tokenId: BigInt(index),
//                             metadata,
//                             balance,
//                         };
//                     })
//                     .filter((token): token is TokenData => token !== null);

//                 console.log("Final formatted tokens:", formattedTokens);
//                 setTokens(formattedTokens);
//                 setFilteredTokens(formattedTokens);
//             } catch (error) {
//                 console.error("Error fetching tokens:", error);
//                 setError(
//                     "Failed to load marketplace data. Please try again later."
//                 );
//             } finally {
//                 setLoading(false);
//             }
//         };

//         if (ready) {
//             fetchTokens();
//         }
//     }, [ready, authenticated, user?.wallet?.address, publicClient]);

//     if (!ready) return null;

//     return (
//         <div className="relative min-h-screen overflow-hidden bg-black">
//             {/* Background Elements */}
//             <div className="absolute inset-0 z-0">
//                 {/* Left side background */}
//                 <div className="absolute left-0 top-0 w-2/5 h-full">
//                     <div className="absolute inset-0 bg-[url('/background.svg')] bg-left bg-no-repeat opacity-30 transform scale-150 animate-float-left bg-svg" />
//                 </div>
//                 {/* Center background pattern */}
//                 <div className="absolute left-1/3 right-1/3 top-0 h-full">
//                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00A340]/5 to-transparent" />
//                 </div>
//                 {/* Right side background */}
//                 <div className="absolute -right-1/4 -top-1/4 w-2/3 h-full">
//                     <div className="absolute inset-0 bg-[url('/background.svg')] bg-right bg-no-repeat opacity-30 transform scale-150 rotate-90 animate-float-right bg-svg" />
//                 </div>
//             </div>

//             <BackgroundAnimation />

//             {/* Header */}
//             <header className="relative z-10 flex justify-between items-center p-6">
//                 <div className="logo">
//                     <Link href="/">
//                         <Image
//                             src="/treenteq-logo.png"
//                             alt="TREENTEQ Logo"
//                             width={200}
//                             height={200}
//                             priority
//                         />
//                     </Link>
//                 </div>
//                 <div className="flex items-center gap-4">
//                     <Link href="/listing">
//                         <Button
//                             variant="default"
//                             className="bg-[#00A340] text-white hover:bg-[#00A340] transition-colors duration-300"
//                         >
//                             List your data
//                         </Button>
//                     </Link>
//                     <Button
//                         onClick={authenticated ? logout : login}
//                         className="bg-[#00A340] text-white hover:bg-[#009030] transition-colors duration-300"
//                     >
//                         {authenticated ? "Log out" : "Log in"}
//                     </Button>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="relative z-10 container mx-auto px-6 pt-8">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.7 }}
//                     className="max-w-4xl mx-auto"
//                 >
//                     <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
//                         Data Marketplace
//                     </h1>

//                     <div className="space-y-6">
//                         <div className="flex justify-between items-center">
//                             <Link
//                                 href="/"
//                                 className="text-white hover:text-gray-300"
//                             >
//                                 ← Back to Upload
//                             </Link>
//                         </div>

//                         <div className="relative">
//                             <Input
//                                 type="text"
//                                 placeholder="Search by name, description, or tags..."
//                                 value={searchTerm}
//                                 onChange={(e) => handleSearch(e.target.value)}
//                                 className="pl-10 bg-white text-black"
//                             />
//                             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                         </div>

//                         {error ? (
//                             <div className="text-center py-8 text-red-500">
//                                 {error}
//                             </div>
//                         ) : loading ? (
//                             <div className="text-center py-8 text-white">
//                                 Loading datasets...
//                             </div>
//                         ) : filteredTokens.length === 0 ? (
//                             <div className="text-center py-8 text-gray-500">
//                                 {searchTerm
//                                     ? "No datasets found matching your search"
//                                     : "No datasets available yet"}
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {filteredTokens.map((token) => (
//                                     <DatasetCard
//                                         key={token.tokenId.toString()}
//                                         token={token}
//                                         onPurchase={handlePurchase}
//                                         isOwner={token.balance > BigInt(0)}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </motion.div>
//             </main>
//         </div>
//     );
// }


export default function Market() {
    const datasets = [
        { id: 1, name: "Dataset Name", description: "dataset description", price: "3.27 ETH", purchased: false },
        { id: 2, name: "Dataset Name", description: "dataset description", price: "3.27 ETH", purchased: true },
        { id: 3, name: "Dataset Name", description: "dataset description", price: "3.27 ETH", purchased: true },
        { id: 4, name: "Dataset Name", description: "dataset description", price: "3.27 ETH", purchased: false },
        { id: 5, name: "Dataset Name", description: "dataset description", price: "3.27 ETH", purchased: false },
        { id: 6, name: "Dataset Name", description: "dataset description", price: "3.27 ETH", purchased: false },
        { id: 7, name: "Dataset Name", description: "dataset description", price: "3.27 ETH", purchased: false },
        { id: 8, name: "Dataset Name", description: "dataset description", price: "3.27 ETH", purchased: true },
        { id: 9, name: "Dataset Name", description: "dataset description", price: "3.27 ETH", purchased: false },
      ]
    return (
        <div className="min-h-screen bg-gradient">
            {/* Navbar */}
            <nav className="flex flex-row justify-between items-center p-10">
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
                        <Link href="/listing">
                        <Button className="text-white bg-[#0B170D] border border-green-900/80 rounded-full w-auto p-3 text-lg font-semibold">List Your Data</Button>
                        </Link>
                        <Button className="bg-gradient-to-r from-[#00A340] to-[#00000080] border border-green-900 rounded-full px-6 py-3 text-lg font-semibold text-white hover:opacity-90 transition duration-300">
                            Connect Wallet
                        </Button>

                    </div>
                </div>
            </nav>

            {/* Main Section */}
            <main className="flex flex-col justify-center items-center relative">
                <div className="absolute bg-image inset-0"></div>
                <div className="w-[60%] relative z-10">
                    <div className="flex flex-row justify-start items-center gap-2 mb-3">
                        <FaArrowLeft className="text-[#00A340] text-lg"/>
                        <h1 className="text-[20px] text-white">Back</h1>
                    </div>
                    {/* search bar */}
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <Input
                            type="search"
                            placeholder="Search for Datasets, tags......"
                            className="w-full bg-black/40 border-green-900/30 pl-12 pr-12 py-6 text-white placeholder:text-gray-500 focus:border-green-500 rounded-full"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 hover:text-green-400 hover:bg-transparent"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </Button>
                        </div>
                        {/* tags */}
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                        {Array(5)
                            .fill("climate datasets")
                            .map((tag, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                className="border-green-900/30 bg-black/40 text-white hover:bg-green-900/20 hover:text-white whitespace-nowrap rounded-full"
                            >
                                <Image src="./tag.svg" alt="tag" width={13} height={13}/>
                                <span className="text-lg">{tag}</span>
                            </Button>
                            ))}
                        </div>
                        {/* listings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {datasets.map((dataset) => (
                                <Card
                                key={dataset.id}
                                className="bg-black/40 border-green-500 p-6 relative overflow-hidden group hover:shadow-[0_0_10px_4px_#00A340] transition-shadow duration-300"
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-white font-medium">{dataset.name}</h3>
                                    <Image src="./verify.svg" alt="image" width={12} height={13}/>
                                  </div>
                                  {dataset.purchased && (
                                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Purchased</span>
                                  )}
                                </div>
                                <p className="text-gray-500 text-sm mb-4">{dataset.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-green-500 font-medium">{dataset.price}</span>
                                  {dataset.purchased ? (
                                    <div className="text-white flex justify-center items-center gap-1">
                                      <h1 className="text-sm">Download Now</h1>
                                      <div>
                                        <Image src="./download.svg" alt="download" width={10} height={12}/>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button
                                      variant="default"
                                      size="sm"
                                      className="bg-green-500/20 text-white border border-green-800 backdrop-blur-3xl hover:bg-green-700 text-sm font-semibold"
                                    >
                                      Collect Now
                                    </Button>
                                  )}
                                </div>
                              </Card>
                                ))}
                        </div>         
                </div>          
            </main>

            {/* Gradient Styles */}
            <style jsx>{`
                .bg-gradient {
                    background: radial-gradient(50% 30% at 50% 0%, rgba(0, 163, 64, 0.2) 0%, rgba(0, 0, 0, 1) 100%),
                                radial-gradient(circle at 30% 0%, rgba(0, 163, 64, 0.3) 0%, transparent 70%),
                                black;
                }
                
                .bg-image {
                    background: 
                        radial-gradient(circle at 0% 50%, rgba(0, 163, 64, 0.3) 30%, rgba(0, 0, 0, 0) 60%),
                }
            `}</style>
        </div>
    );
}

