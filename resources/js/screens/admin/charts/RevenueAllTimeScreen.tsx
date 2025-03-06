import React from 'react'

interface RevenueAllTimeScreenProps {
    revenue: number | undefined;
}

const RevenueAllTimeScreen: React.FC<RevenueAllTimeScreenProps> = ({ revenue }) => {
    return (
        <div className="chart--widgets-item">
            <h3>Revenue All Time </h3>
            <p>{revenue?.toFixed(2)} &euro;</p>
        </div>
    )
}

export default RevenueAllTimeScreen
