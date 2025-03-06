import React from "react";

interface AverageRevenueScreenProps {
    revenue: number | undefined;
}

const AverageRevenueScreen: React.FC<AverageRevenueScreenProps> = ({ revenue }) => {

    return (
        <div className="chart--widgets-item">
            <h3>Average Order Revenue</h3>
            <p>{revenue?.toFixed(2)} &euro;</p>
        </div>
    );
};

export default AverageRevenueScreen;
