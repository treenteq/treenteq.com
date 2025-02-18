'use client';

import { usePathname } from 'next/navigation';
import Background from '@/components/background';
import Image from 'next/image';
import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu } from 'lucide-react';
import { BsDiscord, BsLinkedin, BsTwitterX } from 'react-icons/bs';
import { Button } from '@/components/ui/button';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

export default function Home() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Datasets', path: '/market' },
        { name: 'Listing', path: '/listing' },
        {
            name: 'Docs',
            path: 'https://www.treenteq.com/LitePaper_treenteq.pdf',
            external: true,
        },
        {
            name: 'Contact Us',
            path: 'https://docs.google.com/forms/d/e/1FAIpQLSfFGfRqMHaBRLy22fDHJvJQgagAP7sjoyVM0HETDOcz79VcVA/viewform',
            external: true,
        },
    ];

    const contacts = [
        {
            icon: <BsTwitterX className="text-white w-6 h-6" />,
            url: 'https://x.com/treenteq',
        },
        {
            icon: <BsLinkedin className="text-white w-6 h-6" />,
            url: 'https://www.linkedin.com/company/treenteq/posts/?feedView=all',
        },
        {
            icon: <BsDiscord className="text-white w-6 h-6" />,
            url: 'https://discord.com/invite/PUUpUcakmC',
        },
    ];

    return (
        <div className="h-screen w-screen overflow-auto md:overflow-hidden relative inset-0 bg-gradient-to-bl from-[#373737] to-black">
            <div className="absolute inset-0 w-full h-full overflow-auto hide-scrollbar">
                <Background />
            </div>

            <div className="absolute top-0 w-full flex flex-col justify-center items-center">
                {/* desktop header */}
                <nav className="sm:flex flex-row justify-between items-center w-5/6 py-5 hidden">
                    {/* logo */}
                    <Link href={'/'}>
                        <Image
                            src="/logo.svg"
                            alt="logo"
                            width={135}
                            height={45}
                        />
                    </Link>
                    <div className="flex flex-row gap-4">
                        {navItems.map((nav, index) =>
                            nav.external ? (
                                <a
                                    href={nav.path}
                                    key={index}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`font-semibold lg:font-lg ${
                                        pathname === nav.path
                                            ? 'text-[#00A340] font-extrabold'
                                            : 'text-white hover:text-[#00A340]'
                                    }`}
                                >
                                    {nav.name}
                                </a>
                            ) : (
                                <Link href={nav.path} key={index}>
                                    <p
                                        className={`font-semibold lg:font-lg ${
                                            pathname === nav.path
                                                ? 'text-[#00A340] font-extrabold'
                                                : 'text-white  hover:text-[#00A340]'
                                        }`}
                                    >
                                        {nav.name}
                                    </p>
                                </Link>
                            ),
                        )}
                    </div>
                    <Link href={'/data-wanted'}>
                        <Button className="bg-[#00A340] cursor-pointer hover:bg-black/30 font-bold">
                            Request Dataset
                        </Button>
                    </Link>
                </nav>
                {/* mobile header */}
                <nav className="flex justify-between items-center w-full p-5 md:hidden">
                    <div className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Menu className="text-white" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-900/80">
                                {navItems.map((nav, index) => (
                                    <Link href={nav.path} key={index}>
                                        <DropdownMenuItem
                                            className={`font-semibold ${pathname === nav.path ? 'text-[#00A340]' : 'text-white'}`}
                                        >
                                            {nav.name}
                                        </DropdownMenuItem>
                                    </Link>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Link href={'/data-wanted'}>
                        <Button className="bg-black/45 cursor-pointer">
                            Request Dataset
                        </Button>
                    </Link>
                </nav>

                {/* main content */}
                <main className="w-5/6 mx-auto grid lg:grid-cols-2 gap-12 place-items-center sm:mt-20 lg:mt-20">
                    <div className="space-y-8 ">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                            Unlock The Value Of{' '}
                            <span className="text-[#00C853]">Your</span> Data
                        </h1>
                        <p className="text-zinc-400 text-xl leading-relaxed max-w-lg">
                            Transform your raw data into valuable insights.
                            Share, analyze, and monetize your data securely on
                            our platform
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href={
                                    'https://www.treenteq.com/LitePaper_treenteq.pdf'
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button className="text-white border rounded-lg border-white p-2 font-semibold">
                                    Learn More
                                </Button>
                            </a>
                            <Link href={'/market'}>
                                <Button className="bg-[#00C853] hover:bg-[#00C853] text-white p-2 font-semibold">
                                    Treen It
                                </Button>
                            </Link>
                        </div>
                        <div className="flex flex-row gap-5">
                            {contacts.map((contact, index) => (
                                <Link href={contact.url} key={index}>
                                    {contact.icon}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <CardContainer className="inter-var">
                            <CardBody className="bg-black/50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border flex justify-center items-center">
                                <CardItem
                                    translateZ="100"
                                    className="w-5/6 h-5/6"
                                >
                                    <Image
                                        src={'/hero.png'}
                                        width={400}
                                        height={600}
                                        alt="hero"
                                        className="w-full h-full object-cover rounded-xl group-hover/card:shadow-xl"
                                    />
                                </CardItem>
                            </CardBody>
                        </CardContainer>
                    </div>
                </main>
            </div>
        </div>
    );
}
