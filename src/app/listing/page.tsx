"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Database, Cpu, FileText } from "lucide-react";

export default function ListingPage() {
    const router = useRouter();

    const dataTypes = [
        {
            title: "Legacy Data",
            description: "Upload traditional Excel and CSV files",
            icon: <FileText className="h-12 w-12 mb-4 text-[#00A340]" />,
            route: "/listing/legacy-data",
        },
        {
            title: "Machine Data",
            description: "Coming Soon!",
            icon: <Cpu className="h-12 w-12 mb-4 text-[#00A340]" />,
            route: "/listing/machine-data",
        },
        {
            title: "Social Data",
            description: "Coming Soon!",
            icon: <Database className="h-12 w-12 mb-4 text-[#00A340]" />,
            route: "/listing/social-data",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-white">
                Choose Data Type to List
            </h1>
            <div className="grid md:grid-cols-3 gap-8">
                {dataTypes.map((type) => (
                    <div
                        key={type.title}
                        className="bg-white rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => router.push(type.route)}
                    >
                        {type.icon}
                        <h2 className="text-xl font-semibold mb-2">
                            {type.title}
                        </h2>
                        <p className="text-gray-600">{type.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
