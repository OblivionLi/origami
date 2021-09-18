import React from 'react'

const RevenueAllTimeScreen = ({ revenue }) => {
    return (
        <div className="chart--widgets-item">
            <h3>Revenue All Time </h3>
            <p>{revenue && revenue[0].sum} &euro;</p>
        </div>
    )
}

export default RevenueAllTimeScreen
