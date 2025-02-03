'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FaChevronRight } from 'react-icons/fa6';

export default function Home() {
    const pathname = usePathname();

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
            <nav className="fixed top-4 mt-8 left-1/2 transform -translate-x-1/2 w-[80%] rounded-full gradient-bg border border-white/20 shadow-lg z-50">
                <div className="container flex justify-between items-center pt-3 pb-3">
                    {/* Logo */}
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="TREENTEQ Logo"
                            layout="intrinsic"
                            width={145}
                            height={50}
                            className="contrast-200"
                            objectFit="fit"
                            quality={100}
                            priority
                        />
                    </Link>

                    {/* Navigation Links */}
                    <ul className="flex space-x-6">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    target={item.target}
                                    className={`px-4 py-2 rounded-md transition duration-300 ${
                                        pathname === item.path
                                            ? 'text-[#00A340] font-semibold'
                                            : 'text-white hover:text-[#00A340]'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-32 w-full grid grid-cols-1 md:grid-cols-2 h-screen">
                {/* Left Part */}
                <div className="flex flex-col justify-center gap-5 ml-[135px]">
                    <div className="flex px-[10px] py-[15px] gap-[10px]">
                        <Button className="text-white bg-[#0B170D] border border-green-900/30 rounded-full w-auto p-3 text-lg disable">
                            Lightning-fast, secure, easy.
                        </Button>
                    </div>
                    <div className="flex flex-col justify-center space-y-0 leading-tight">
                        <h1 className="text-white text-[72px] font-semibold m-0">
                            Unlock The
                        </h1>
                        <div className="flex flex-row gap-[20px] m-0">
                            <h1 className="text-white text-[72px] font-semibold">
                                Value of
                            </h1>
                            <span className="text-[#00A340] text-[72px] font-semibold">
                                Your
                            </span>
                        </div>
                        <h1 className="text-white text-[72px] font-semibold m-0">
                            Data
                        </h1>
                    </div>
                    <div>
                        <h1 className="text-white">
                            Transform your raw data into valuable insights.
                            Share,
                        </h1>
                        <h1 className="text-white">
                            analyze, and monetize your data securely on our
                            platform
                        </h1>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                        <Link href="/listing">
                            <Button className="border border-[#00A340] text-white rounded-full bg-black flex items-center">
                                <h1 className="font-semibold">Treen It now</h1>
                                <FaChevronRight />
                            </Button>
                        </Link>
                        <Link href="/market">
                            <div className="flex justify-center items-center gap-3 cursor-pointer">
                                <h1 className="font-semibold text-white flex justify-center items-center border-green-900/80">
                                    Explore
                                </h1>
                                <FaChevronRight className="text-white" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Right Part (Image) */}
                <div className="flex justify-center items-center w-full h-full bg-gradient-to-t-r from-[#00A340] to-black">
                    <div className="relative w-full h-full">
                        <div className="absolute inset-[10px] bg-image mt-[10rem]"></div>
                        <Image
                            src="/rightrobot.svg"
                            alt="main image"
                            layout="responsive"
                            width={600}
                            height={500}
                            quality={100}
                            className="relative w-full h-full contrast-125"
                        />
                    </div>
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
                .bg-image {
                    background: radial-gradient(
                        ellipse 90% 120%,
                        rgba(0, 163, 64, 0.3) 40%,
                        rgba(0, 0, 0, 0) 50%
                    );
                }
            `}</style>
        </div>
    );
}
