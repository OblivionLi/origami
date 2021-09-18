import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper } from "@material-ui/core";
import Loader from "../../components/alert/Loader";
import { makeStyles } from "@material-ui/core/styles";
import OrderCountChartScreen from "./charts/OrderCountChartScreen";
import RevenueLastMonthScreen from "./charts/RevenueLastMonthScreen";
import RevenueAllTimeScreen from "./charts/RevenueAllTimeScreen";
import AverageRevenueScreen from "./charts/AverageRevenueScreen";
import UserCountChartScreen from "./charts/UserCountChartScreen";

const useStyles = makeStyles((theme) => ({
    divider: {
        marginBottom: "20px",
        borderBottom: "1px solid #855C1B",
        paddingBottom: "10px",
        width: "30%",

        [theme.breakpoints.down("sm")]: {
            width: "90%",
            margin: "0 auto 20px auto",
        },

        color: "#855C1B",
        fontFamily: "Quicksand",
    },
}));

const DashboardScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [isAdmin, setIsAdmin] = useState(false);
    const [ordersCount, setOrdersCount] = useState([]);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            setIsAdmin(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.data.access_token}`,
                },
            };

            const promise1 = axios.get("/api/orderCharts", config);

            async function fetchData() {
                const response = await Promise.all([promise1]);

                setOrdersCount(response[0].data);
            }
            fetchData();
        }
    }, [dispatch]);

    return (
        <>
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader />
                </div>
            ) : (
                <>
                    <Paper className="admin-content">
                        <h2 className={classes.divider}>Dashboard</h2>

                        <div className="chart">
                            <div className="chart--widgets">
                                <RevenueLastMonthScreen
                                    revenue={ordersCount.revenueLastMonth}
                                />
                                <RevenueAllTimeScreen
                                    revenue={ordersCount.revenueAllTime}
                                />
                                <AverageRevenueScreen
                                    revenue={ordersCount.averageRevenue}
                                />
                            </div>
                            <div className="chart--counts">
                                <OrderCountChartScreen
                                    orders={ordersCount.orderCount}
                                />
                                <UserCountChartScreen
                                    users={ordersCount.userCount}
                                />
                            </div>
                        </div>
                    </Paper>
                </>
            )}
        </>
    );
};

export default DashboardScreen;
