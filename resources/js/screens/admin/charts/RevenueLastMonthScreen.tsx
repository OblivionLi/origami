import React from "react";

interface RevenueLastMonthScreenProps {
    revenue: number | undefined;
    monthName: string | undefined;
}

const RevenueLastMonthScreen: React.FC<RevenueLastMonthScreenProps> = ({ revenue, monthName }) => {
    return (
        <div className="chart--widgets-item">
            <h3>Revenue Last Month</h3>
            <p>{revenue?.toFixed(2)} &euro;</p>

            <hr />

            <h3>Month: </h3>
            <p>{monthName}</p>
        </div>
    );
};

export default RevenueLastMonthScreen;
