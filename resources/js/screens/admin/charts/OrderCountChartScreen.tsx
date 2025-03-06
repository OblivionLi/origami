import React from 'react'
import { Line } from "react-chartjs-2";
import {chartOptions, MONTHS} from "@/screens/admin/DashboardScreen";

interface OrderCountChartScreenProps {
    ordersCount: number | undefined;
}

const OrderCountChartScreen: React.FC<OrderCountChartScreenProps> = ({ ordersCount }) => {
    const generateTrendData = (total: number | undefined): number[] => {
        if (!total || typeof total !== 'number') return Array(12).fill(0);

        return MONTHS.map((_, index) => {
            const monthFactor = (index + 1) / MONTHS.length;
            return Math.floor(total * monthFactor);
        });
    };

    const dataOrders = {
        labels: MONTHS,
        datasets: [
            {
                label: "# of Paid Orders",
                data: generateTrendData(ordersCount),
                fill: false,
                backgroundColor: "#3a446b",
                borderColor: "#39CCCC",
                tension: 0.1
            },
        ],
    };

    return (
        <div className="chart--counts-item">
            <Line data={dataOrders} options={chartOptions} />
        </div>
    )
}

export default OrderCountChartScreen
