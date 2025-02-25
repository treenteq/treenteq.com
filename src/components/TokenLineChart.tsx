import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface ChartDataPoint {
    date: string;
    totalPrice: number;
    displayPrice: string;
}

interface TokenPriceLineChartProps {
    chartData: ChartDataPoint[];
}

const TokenPriceLineChart: React.FC<TokenPriceLineChartProps> = ({
    chartData,
}) => {
    if (!chartData || chartData.length < 0) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-400">
                <p>Not enough data to display a chart</p>
            </div>
        );
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <XAxis dataKey="date" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="totalPrice"
                        stroke="#00A440"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TokenPriceLineChart;
