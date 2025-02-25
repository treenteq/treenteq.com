// components/ErrorPage.tsx
import React from 'react';
import Link from 'next/link';
import logoring from '../../public/logoring.png';
import back from '../../public/back.png';
import Image from 'next/image';

const ErrorPage: React.FC = () => {
    return (
        <main className="bg-black min-h-screen flex flex-col items-center justify-center py-12 px-4">
            {/* 404 with tree rings in the center */}
            <div className="flex items-center justify-center mb-8 sm:mb-16">
                <h1 className="text-white text-7xl sm:text-9xl md:text-[15rem] font-bold leading-none">
                    4
                </h1>
                <div className="mx-1 sm:mx-2 w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 relative flex items-center justify-center">
                    <div className="w-full h-full">
                        <Image
                            src={logoring}
                            alt="zero"
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
                <h1 className="text-white text-7xl sm:text-9xl md:text-[15rem] font-bold leading-none">
                    4
                </h1>
            </div>

            {/* Error message and back to home button */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <Link href="/">
                    <div className="w-[16rem]">
                        <Image src={back} alt="back" />
                    </div>
                </Link>

                <p className="text-white text-lg">
                    The page you are looking
                    <br />
                    for is not available
                </p>
            </div>
        </main>
    );
};

export default ErrorPage;
