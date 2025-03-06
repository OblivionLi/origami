import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Paper} from "@mui/material";
import Loader from "@/components/alert/Loader.js";
import {AppDispatch, RootState} from "@/store";
import {useNavigate} from "react-router-dom";
import {fetchOrderCharts} from "@/features/chart/chartSlice";
import {StyledDivider} from "@/styles/muiStyles";
import Message from "@/components/alert/Message";
import RevenueLastMonthScreen from "@/screens/admin/charts/RevenueLastMonthScreen";
import RevenueAllTimeScreen from "@/screens/admin/charts/RevenueAllTimeScreen";
import AverageRevenueScreen from "@/screens/admin/charts/AverageRevenueScreen";
import OrderCountChartScreen from "@/screens/admin/charts/OrderCountChartScreen";
import UserCountChartScreen from "@/screens/admin/charts/UserCountChartScreen";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const MONTHS = [
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

export const chartOptions: ChartOptions<'line'> = {
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                precision: 0
            }
        }
    },
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: false
        }
    }
};

interface DashboardScreenProps {
}

const DashboardScreen: React.FC<DashboardScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const {
        orderStats,
        loading,
        error,
    } = useSelector((state: RootState) => state.chart);

    const {
        userInfo,
    } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (!userInfo || userInfo?.data?.is_admin != 1) {
            navigate("/login");
        } else {
            setIsAdmin(true);
            dispatch(fetchOrderCharts());
        }
    }, [dispatch, userInfo, navigate]);

    return (
        <>
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader/>
                </div>
            ) : (
                <>
                    <Paper className="admin-content">
                        <StyledDivider>Dashboard</StyledDivider>

                        {loading ? (
                            <Loader/>
                        ) : error ? (
                            <Message variant="error">{error}</Message>
                        ) : (
                            <div className="chart">
                                <div className="chart--widgets">
                                    <RevenueLastMonthScreen
                                        revenue={orderStats?.revenueLastMonth}
                                        monthName={orderStats?.revenueLastMonthName}
                                    />
                                    <RevenueAllTimeScreen
                                        revenue={orderStats?.revenueAllTime}
                                    />
                                    <AverageRevenueScreen
                                        revenue={orderStats?.averageRevenue}
                                    />
                                </div>
                                <div className="chart--counts">
                                    <OrderCountChartScreen
                                        ordersCount={orderStats?.orderCount}
                                    />
                                    <UserCountChartScreen
                                        usersCount={orderStats?.userCount}
                                    />
                                </div>
                            </div>
                        )}
                    </Paper>
                </>
            )}
        </>
    );
};

export default DashboardScreen;
