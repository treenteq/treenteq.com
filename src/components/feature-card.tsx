"use client";

import { LucideIcon, Lock, BarChart, DollarSign } from "lucide-react";

interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
    color: string;
    iconColor: string;
}

const iconMap: Record<string, LucideIcon> = {
    lock: Lock,
    "bar-chart": BarChart,
    "dollar-sign": DollarSign,
};

export default function FeatureCard({
    icon,
    title,
    description,
    color,
    iconColor,
}: FeatureCardProps) {
    const Icon = iconMap[icon];

    return (
        <div
            className={`p-6 rounded-lg ${color} transition-transform hover:scale-105`}
        >
            <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${iconColor} bg-white`}>
                    {Icon && <Icon className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <p className="mt-4 text-gray-600">{description}</p>
        </div>
    );
}
