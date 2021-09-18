import React from 'react'
import { Line } from "react-chartjs-2";

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};

const OrderCountChartScreen = ({ orders }) => {

    const dataOrders = {
        labels: MONTHS,
        datasets: [
            {
                label: "# of Paid Orders",
                data: orders,
                fill: false,
                backgroundColor: "#3a446b",
                borderColor: "#39CCCC",
            },
        ],
    };

    return (
        <div className="chart--counts-item">
            <Line data={dataOrders} options={options} />
        </div>
    )
}

export default OrderCountChartScreen
