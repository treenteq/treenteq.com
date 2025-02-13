import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

interface NavbarProps {
    authenticated: boolean;
    login: () => void;
    logout: () => void;
    primaryButton: { text: string; link: string };
}

export default function NavBar({
    authenticated,
    login,
    logout,
    primaryButton,
}: NavbarProps) {
    return (
        <div className="w-full flex justify-center items-center">
            <header className="relative z-10 flex justify-between items-center w-5/6 py-5">
                {/* Logo */}
                <div>
                    <Link href="/">
                        <Image
                            src="/logo.svg"
                            alt="TREENTEQ Logo"
                            width={145}
                            height={50}
                            className="hidden sm:block brightness-110 contrast-125 p-1"
                            priority
                        />
                    </Link>
                </div>

                {/* Buttons */}
                <div className="flex justify-center items-center gap-3 sm:gap-5 lg:gap-2">
                    <Link href={primaryButton.link}>
                        <Button className="text-white bg-[#0B170D] border border-white hover:bg-green-700 transition duration-300 rounded-lg w-auto font-semibold">
                            {primaryButton.text}
                        </Button>
                    </Link>
                    <Button
                        onClick={authenticated ? logout : login}
                        className="bg-[#00A340] border border-green-900 rounded-lg p-3 font-semibold text-white hover:opacity-90 transition duration-300"
                    >
                        {authenticated ? 'Disconnect' : 'Connect Wallet'}
                    </Button>
                </div>
            </header>
        </div>
    );
}
