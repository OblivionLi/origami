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

const UserCountChartScreen = ({ users }) => {

    const dataUsers = {
        labels: MONTHS,
        datasets: [
            {
                label: "# of Users",
                data: users,
                fill: false,
                backgroundColor: "#3a446b",
                borderColor: "#39CCCC",
            },
        ],
    };

    return (
        <div className="chart--counts-item">
            <Line data={dataUsers} options={options} />
        </div>
    )
}

export default UserCountChartScreen
