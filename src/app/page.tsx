'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaChevronRight } from 'react-icons/fa6';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useState } from 'react';

export default function Home() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { name: 'Home', path: '/', target: '' },
        { name: 'Datasets', path: '/market', target: '' },
        { name: 'Listing', path: '/listing', target: '' },
        {
            name: 'Docs',
            path: 'https://www.treenteq.com/LitePaper_treenteq.pdf',
            target: '_blank',
        },
        {
            name: 'Contact Us',
            path: 'https://docs.google.com/forms/d/e/1FAIpQLSfFGfRqMHaBRLy22fDHJvJQgagAP7sjoyVM0HETDOcz79VcVA/viewform',
            target: '_blank',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient">
            {/* Navbar */}
            <nav className="fixed top-0 mt-4 sm:mt-8 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[80%] rounded-full gradient-bg border border-white/20 shadow-lg z-50">
                <div className="container flex justify-between items-center py-3 px-4 sm:px-6">
                    {/* Logo */}
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="TREENTEQ Logo"
                            width={140}
                            height={45}
                            className="contrast-200"
                            objectFit="contain"
                            quality={100}
                            priority
                        />
                    </Link>

                    {/* Hamburger Menu for Mobile */}
                    <button
                        className="sm:hidden text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <GiHamburgerMenu className="w-20 h-8" />
                    </button>

                    {/* Navigation Links */}
                    <ul
                        className={`sm:flex space-y-2 sm:space-y-0 sm:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} absolute sm:relative top-full left-0 sm:top-auto sm:left-auto w-full sm:w-auto bg-black sm:bg-transparent rounded-b-lg sm:rounded-none p-4 sm:p-0`}
                    >
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    target={item.target}
                                    className={`block px-4 py-2 rounded-md transition duration-300 lg:text-lg ${
                                        pathname === item.path
                                            ? 'text-[#00A340] font-semibold'
                                            : 'text-white hover:text-[#00A340]'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Main Content */}
            <main className="min-w-4xl grid grid-cols-1 lg:grid-cols-2 min-h-screen pt-32 lg:pt-24">
                {/* Left Part */}
                <div className="flex flex-col justify-center items-center lg:items-start gap-5 px-6 sm:px-10 lg:ml-[135px] mb-10 lg:mb-0">
                    <div className="flex gap-[10px]">
                        <Button className="text-white bg-[#0B170D] border border-green-900/30 rounded-full w-auto p-3 text-lg disable">
                            Lightning-fast, secure, easy.
                        </Button>
                    </div>
                    <div className="flex flex-col justify-center space-y-0 leading-tight">
                        <h1 className="text-white text-5xl lg:text-[72px] font-semibold m-0">
                            Unlock The
                        </h1>
                        <div className="flex flex-row gap-[10px] sm:gap-[20px] m-0">
                            <h1 className="text-white text-5xl lg:text-[72px] font-semibold">
                                Value of
                            </h1>
                            <span className="text-[#00A340] text-5xl sm:text-5xl lg:text-[72px] font-semibold">
                                Your
                            </span>
                        </div>
                        <h1 className="text-white text-5xl lg:text-[72px] font-semibold m-0">
                            Data
                        </h1>
                    </div>
                    <div className='hidden sm:block'>
                        <h1 className="text-white text-sm sm:text-base">
                            Transform your raw data into valuable insights.
                            Share,
                        </h1>
                        <h1 className="text-white text-sm sm:text-base">
                            analyze, and monetize your data securely on our
                            platform
                        </h1>
                    </div>
                    <div className="block flex-col justify-center items-center px-6 md:hidden">
                        <h1 className="text-white text-sm text-center">
                            Transform your raw data into valuable insights. Share, Analyze, and monetize your data securely on our platform.
                        </h1>
                    </div>

                    <div className="flex flex-row items-center gap-4">
                        <Link href="/listing">
                            <Button className="border border-[#00A340] text-white rounded-full bg-black flex items-center">
                                <h1 className="font-semibold text-sm sm:text-base">
                                    Treen It now
                                </h1>
                                <FaChevronRight />
                            </Button>
                        </Link>
                        <Link href="/market">
                            <div className="flex justify-center items-center gap-3 cursor-pointer">
                                <h1 className="font-semibold text-white flex justify-center items-center border-green-900/80 text-sm sm:text-base">
                                    Explore
                                </h1>
                                <FaChevronRight className="text-white" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Right Part (Image) */}
                <div className="flex flex-col justify-center items-center relative w-full max-h-screen">
                    {/* Gradient background */}
                    <Image
                        src="/ellipse.svg"
                        alt="gradient"
                        width={100}
                        height={400}
                        quality={100}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full object-cover bg-blend-lighten"
                    />

                    {/* Robot image */}
                    <Image
                        src="/rightrobot.svg"
                        alt="main image"
                        width={400}
                        height={450}
                        quality={100}
                        className="relative lg:absolute bottom-0 z-10 object-cover w-auto h-auto contrast-100 brightness-105 mx-auto"
                    />
                </div>

            </main>

            <style jsx>{`
                .bg-gradient {
                    background: radial-gradient(
                            50% 30% at 50% 0%,
                            rgba(0, 163, 64, 0.2) 0%,
                            rgba(0, 0, 0, 1) 100%
                        ),
                        radial-gradient(
                            circle at 30% 0%,
                            rgba(0, 163, 64, 0.3) 0%,
                            transparent 70%
                        ),
                        black;
                }
                .gradient-bg {
                    background: radial-gradient(
                            100% 100% at 30% 0%,
                            rgba(0, 163, 64, 0.15) 0%,
                            rgba(0, 0, 0, 0.1) 100%
                        ),
                        linear-gradient(
                            to bottom,
                            rgba(255, 255, 255, 0.1),
                            rgba(255, 255, 255, 0.1)
                        );
                    backdrop-filter: blur(8px);
                }
            `}</style>
        </div>
    );
}
