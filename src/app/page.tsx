"use client";


// import React from 'react';
// import { useRouter } from "next/navigation";
// import { usePrivy } from "@privy-io/react-auth";
// import { motion } from "framer-motion";
// import BackgroundAnimation from "@/components/background-animation";
// import FeatureCard from "@/components/feature-card";
// import { CustomButton } from "@/components/ui/custom-button";
// import { CustomInput } from "@/components/ui/custom-input";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaChevronRight } from "react-icons/fa6";
// import { SearchIcon } from 'lucide-react';

// export default function Home() {
//     const { ready, authenticated, login } = usePrivy();
//     const router = useRouter();

//     const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         router.push("/market");
//     };

//     function LogoutButton() {
//         const { ready, authenticated, logout } = usePrivy();
//         // Disable logout when Privy is not ready or the user is not authenticated
//         const disableLogout = !ready || (ready && !authenticated);

//         return (
//             <Button disabled={disableLogout} onClick={authenticated ? logout : login}>
//                 {authenticated ? "Log out" : "Log in"}
//             </Button>
//         );
//     }

//     return (
//         <div className="relative min-h-screen overflow-hidden bg-black">
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
            
//             <header className="relative z-10 flex justify-between items-center p-6">
//                 <div className="logo">
//                     <Image 
//                         src="/treenteq-logo.png" 
//                         alt="TREENTEQ Logo" 
//                         width={200} 
//                         height={200} 
//                         priority
//                     />
//                 </div>
//                 <div className="flex items-center mt-4">
//                     <Link href="/market">
//                         <Button
//                             variant="default"
//                             className="marketplace-button mr-4 bg-[#00A340] text-white hover:bg-[#00A340] transition-colors duration-300"
//                         >
//                             Marketplace
//                         </Button>
//                     </Link>

//                     {ready && !authenticated ? (
//                         <Button
//                             size="lg"
//                             className="connect-wallet-button border-2 border-transparent bg-[#00A340] text-white hover:bg-[#00A340] transition-colors duration-300"
//                             onClick={login}
//                         >
//                             Log In
//                         </Button>
//                     ) : (
//                         <LogoutButton />
//                     )}
//                 </div>
//             </header>

//             <main className="relative z-10 container mx-auto px-6 pt-3 pb-28">
//                 <div className="max-w-4xl mx-auto text-center space-y-8">
//                     <motion.h1
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.7, delay: 0.2 }}
//                         className="text-5xl md:text-7xl font-bold tracking-tight text-white"
//                     >
//                         Unlock the <span className="highlight">value</span> of your data
//                     </motion.h1>

//                     <motion.p
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.7, delay: 0.4 }}
//                         className="text-xl text-gray-400 max-w-2xl mx-auto"
//                     >
//                         Transform your raw data into valuable insights. Share,
//                         analyze, and monetize your data securely on our
//                         platform.
//                     </motion.p>

//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.7, delay: 0.8 }}
//                         className="flex flex-col sm:flex-row gap-4 justify-center items-center"
//                     >
//                         <form
//                             onSubmit={handleSearch}
//                             className="relative flex-1 max-w-md"
//                         >
//                             <div className="relative flex items-center">
//                                 <div className="relative flex-1">
//                                     <CustomInput
//                                         placeholder="Search for datasets..."
//                                         className="flex-1 w-full pl-10 bg-[#DEE5C9] border border-[#00A340] placeholder-gray-600 rounded-r-none"
//                                     />
//                                     <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
//                                 </div>
//                                 <Button 
//                                     type="submit"
//                                     className="h-12 rounded-l-none bg-[#00A340] text-white hover:bg-[#00A340]/90 transition-colors duration-300"
//                                 >
//                                     Search
//                                 </Button>
//                             </div>
//                         </form>
//                         <Link href="/listing">
//                             <CustomButton
//                                 size="lg"
//                                 className="h-12 w-full sm:w-auto bg-[#00A340] text-white hover:bg-[#00A340] transition-colors duration-300"
//                             >
//                                 List your data
//                             </CustomButton>
//                         </Link>
//                     </motion.div>
//                 </div>

//                 <motion.div
//                     initial={{ opacity: 0, y: 40 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.7, delay: 1 }}
//                     className="grid md:grid-cols-3 gap-8 mt-24"
//                 >
//                     <FeatureCard
//                         icon="lock"
//                         title="Secure Upload"
//                         description="Upload and store your data with top-notch security."
//                         color="bg-[#DEE5C9]"
//                         iconColor="text-[#00a340]"
//                     />
//                     <FeatureCard
//                         icon="bar-chart"
//                         title="Data Analytics"
//                         description="Analyze your data to uncover valuable insights."
//                         color="bg-[#DEE5C9]"
//                         iconColor="text-[#00a340]"
//                     />
//                     <FeatureCard
//                         icon="dollar-sign"
//                         title="Monetize"
//                         description="Turn your data into a revenue-generating asset."
//                         color="bg-[#DEE5C9]"
//                         iconColor="text-[#00a340]"
//                     />
//                 </motion.div>
//             </main>
//         </div>
//     );
// }


export default function Home() {
    const pathname = usePathname(); // Get the current route

    

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Datasets", path: "/market" },
        { name: "Pricing", path: "/pricing" },
        { name: "Docs", path: "/docs" },
        { name: "Contact Us", path: "/contact" }
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
            width={150}
            height={150}
            className="brightness-110 contrast-125"
            priority
          />
          </Link>

          {/* Navigation Links */}
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`px-4 py-2 rounded-md transition duration-300 ${
                    pathname === item.path
                      ? "text-[#00A340] font-semibold"
                      : "text-white hover:text-[#00A340]"
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
          <div className="flex flex-col justify-center">
            <h1 className="text-white text-[72px] font-semibold">unlock the</h1>
            <div className="flex flex-row gap-[20px]">
              <h1 className="text-white text-[72px] font-semibold">value of</h1>
              <span className="text-[#00A340] text-[72px] font-semibold">your</span>
            </div>
            <h1 className="text-white text-[72px] font-semibold">data</h1>
          </div>
          <div>
            <h1 className="text-white">
              Transform your raw data into valuable insights. Share,
            </h1>
            <h1 className="text-white">analyze, and monetize your data securely on our platform</h1>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Link href="/market">
            <Button className="border border-[#00A340] text-white rounded-full bg-black px-4 py-2 flex items-center">
              <h1 className="font-semibold text-lg">Treen It now</h1>
              <FaChevronRight />
            </Button>
            </Link>
            <div className="flex justify-center items-center gap-3">
              <h1 className="font-semibold text-lg text-white flex justify-center items-center border-green-900/80">Explore</h1>
              <FaChevronRight className="text-white" />
            </div>
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
              width={690} 
              height={650} 
              objectFit="cover"
              className="relative w-full h-full"
            />
          </div>
        </div>
      </main>

      <style jsx>{`
        .bg-gradient {
            background: radial-gradient(50% 30% at 50% 0%, rgba(0, 163, 64, 0.2) 0%, rgba(0, 0, 0, 1) 100%),
                        radial-gradient(circle at 30% 0%, rgba(0, 163, 64, 0.3) 0%, transparent 70%),
                        black;
        }
        .gradient-bg {
            background: radial-gradient(100% 100% at 30% 0%, rgba(0, 163, 64, 0.15) 0%, rgba(0, 0, 0, 0.1) 100%),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
            backdrop-filter: blur(8px);
        }
        .bg-image {
            background: radial-gradient(ellipse 90% 120%, rgba(0, 163, 64, 0.3) 40%, rgba(0, 0, 0, 0) 50%);
        }
      `}</style>
    </div>
  );
}