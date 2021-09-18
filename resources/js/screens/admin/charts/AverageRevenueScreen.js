import React from "react";

const AverageRevenueScreen = ({ revenue }) => {
    let price = revenue && revenue[0].sum;

    return (
        <div className="chart--widgets-item">
            <h3>Average Order Revenue</h3>
            <p>{price && Number(price).toFixed(2)} &euro;</p>
        </div>
    );
};

export default AverageRevenueScreen;
