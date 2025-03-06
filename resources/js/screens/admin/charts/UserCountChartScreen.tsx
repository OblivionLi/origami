import React from 'react'
import {Line} from "react-chartjs-2";
import {chartOptions, MONTHS} from "@/screens/admin/DashboardScreen";

interface UserCountChartScreenProps {
    usersCount: number | undefined;
}

const UserCountChartScreen: React.FC<UserCountChartScreenProps> = ({usersCount}) => {
    const generateTrendData = (total: number | undefined): number[] => {
        if (!total || typeof total !== 'number') return Array(12).fill(0);

        return MONTHS.map((_, index) => {
            const monthFactor = (index + 1) / MONTHS.length;
            return Math.floor(total * monthFactor);
        });
    };

    const dataUsers = {
        labels: MONTHS,
        datasets: [
            {
                label: "# of Users",
                data: generateTrendData(usersCount),
                fill: false,
                backgroundColor: "#3a446b",
                borderColor: "#39CCCC",
                tension: 0.1
            },
        ],
    };

    return (
        <div className="chart--counts-item">
            <Line data={dataUsers} options={chartOptions}/>
        </div>
    )
}

export default UserCountChartScreen
