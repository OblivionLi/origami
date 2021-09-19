import React from "react";
import { Line } from "react-chartjs-2";

const RevenueLastMonthScreen = ({ revenue }) => {
    return (
        <div className="chart--widgets-item">
            <h3>Revenue Last Month</h3>
            <p>{revenue && revenue[0] ? revenue[0].sum : ''} &euro;</p>

            <hr />
            
            <h3>Month: </h3>
            <p>{revenue && revenue[0] ? revenue[0].month : ''}</p>
        </div>
    );
};

export default RevenueLastMonthScreen;
