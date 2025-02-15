/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/custom-button';
import { Copy } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { QRCodeCanvas } from 'qrcode.react';
import { ReclaimProofRequest } from '@reclaimprotocol/js-sdk';
import MintDatasetToken from '@/components/MintingComp';
import { uploadToPinata } from '@/services/pinata';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { RiTwitterXFill } from 'react-icons/ri';
import { BsTwitterX } from 'react-icons/bs';
import Background from '@/components/background';
import NavBar from '@/components/NavBar';

// Replace these with your actual Reclaim Protocol credentials
const APP_ID = process.env.NEXT_PUBLIC_RECLAIM_APP_ID as string;
const APP_SECRET = process.env.NEXT_PUBLIC_RECLAIM_APP_SECRET as string;
const TWITTER_PROVIDER_ID = process.env
    .NEXT_PUBLIC_RECLAIM_TWITTER_PROVIDER_ID as string;

export default function SocialDataUpload() {
    const { ready, authenticated, login, logout } = usePrivy();
    const [reclaimProofRequest, setReclaimProofRequest] = useState<any>(null);
    const [requestUrl, setRequestUrl] = useState('');
    const [verificationComplete, setVerificationComplete] = useState(false);
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [contentHash, setContentHash] = useState<string | null>(null);
    const [tweetData, setTweetData] = useState<any>(null);

    useEffect(() => {
        async function initializeReclaim() {
            try {
                const proofRequest = await ReclaimProofRequest.init(
                    APP_ID,
                    APP_SECRET,
                    TWITTER_PROVIDER_ID,
                );
                setReclaimProofRequest(proofRequest);
            } catch (error) {
                console.error('Failed to initialize Reclaim:', error);
                toast.error('Failed to initialize verification');
            }
        }

        if (authenticated) {
            initializeReclaim();
        }
    }, [authenticated]);

    async function generateVerificationRequest() {
        if (!reclaimProofRequest) {
            toast.error('Verification system not initialized');
            return;
        }

        setLoading(true);
        try {
            reclaimProofRequest.addContext(
                'X account verification',
                'Verify X account ownership',
            );

            const url = await reclaimProofRequest.getRequestUrl();
            setRequestUrl(url);

            await reclaimProofRequest.startSession({
                onSuccess: async (proof: any) => {
                    console.log('Verification success', proof);
                    try {
                        // Parse the context from claimData
                        const contextData = JSON.parse(proof.claimData.context);
                        const extractedUsername =
                            contextData.extractedParameters.screen_name;

                        if (!extractedUsername) {
                            throw new Error(
                                'Username not found in verification data',
                            );
                        }

                        setUsername(extractedUsername);
                        setVerificationComplete(true);
                        await scrapeTweets(extractedUsername);
                    } catch (error) {
                        console.error('Error extracting username:', error);
                        toast.error(
                            'Failed to extract username from verification data',
                        );
                        setLoading(false);
                    }
                },
                onFailure: (error: any) => {
                    console.error('Verification failed', error);
                    toast.error('Verification failed. Please try again.');
                    setLoading(false);
                },
            });
        } catch (error) {
            console.error('Error generating verification request:', error);
            toast.error('Failed to start verification');
            setLoading(false);
        }
    }

    async function scrapeTweets(username: string) {
        try {
            const response = await fetch('https://api.treenteq.com/v1/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            if (!response.ok) {
                throw new Error('Failed to scrape tweets');
            }

            const tweetData = await response.json();
            setTweetData(tweetData);

            // Convert tweet data to file for Pinata
            const tweetBlob = new Blob([JSON.stringify(tweetData)], {
                type: 'application/json',
            });
            const tweetFile = new File([tweetBlob], `${username}-tweets.json`, {
                type: 'application/json',
            });

            // Upload to Pinata
            const ipfsHash = await uploadToPinata(tweetFile);
            setContentHash(ipfsHash);
            setLoading(false);
            toast.success('X data collected successfully!');
        } catch (error) {
            console.error('Error scraping tweets:', error);
            toast.error('Failed to collect tweet data');
            setLoading(false);
        }
    }

    if (!ready) return null;
    console.log('Req URL: ', requestUrl);
    console.log('Username: ', username);
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
            <main className="container mx-auto p-12 flex items-center justify-center max-w-6xl">
                <Card className="w-full max-w-xl p-6 space-y-6 border-white border-2 bg-black/30">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-white flex flex-row gap-1 items-center">
                            List <RiTwitterXFill /> Data
                        </h2>
                        <p className="text-sm text-gray-300">
                            Connect your X account to create a dataset from your
                            tweets. Your data will be securely verified using
                            zero-knowledge proofs.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {!authenticated ? (
                            <CustomButton onClick={login} className="w-full">
                                Connect Wallet to Continue
                            </CustomButton>
                        ) : !requestUrl && !verificationComplete ? (
                            <div className="flex flex-col items-center gap-4">
                                <BsTwitterX className="h-16 w-16 text-[#00A340]" />
                                <CustomButton
                                    onClick={generateVerificationRequest}
                                    className="w-full"
                                    disabled={loading}
                                >
                                    {loading
                                        ? 'Initializing...'
                                        : 'Verify X Account'}
                                </CustomButton>
                            </div>
                        ) : requestUrl && !verificationComplete ? (
                            <div className="flex flex-col items-center gap-4">
                                <p className="text-white">
                                    Scan QR code to verify your Twitter account
                                </p>
                                {requestUrl && (
                                    <QRCodeCanvas
                                        value={requestUrl}
                                        size={200}
                                        style={{
                                            padding: 10,
                                            background: 'white',
                                        }}
                                        level="H"
                                    />
                                )}
                                <div className="flex items-center gap-2 mt-2 w-full">
                                    <p className="text-xs text-gray-400 break-all flex-grow">
                                        Verification URL:{' '}
                                        <a
                                            href={requestUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#00A340] hover:underline"
                                        >
                                            {requestUrl}
                                        </a>
                                    </p>
                                    <Button
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                requestUrl,
                                            );
                                            toast.success(
                                                'URL copied to clipboard!',
                                            );
                                        }}
                                        className="bg-[#00A340] hover:bg-[#009030] p-2"
                                        size="sm"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : verificationComplete && contentHash ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-100 rounded-lg">
                                    <p className="text-green-800">
                                        ✓ X account @{username} verified
                                        successfully
                                    </p>
                                </div>
                                <MintDatasetToken
                                    contentHash={contentHash}
                                    file={
                                        new File(
                                            [JSON.stringify(tweetData)],
                                            `${username}-tweets.json`,
                                            {
                                                type: 'application/json',
                                            },
                                        )
                                    }
                                    defaultName={`@${username}'s twitter dataset`}
                                    defaultDescription={`Complete tweet history for @${username}`}
                                    defaultTags={[
                                        'twitter',
                                        'social-data',
                                        username,
                                    ]}
                                />
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00A340]" />
                            </div>
                        )}
                    </div>
                </Card>
            </main>
        </div>
    );
}
