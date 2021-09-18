import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, Button, TextField, Paper, Breadcrumbs, Typography } from "@material-ui/core";
import { Link } from 'react-router-dom';
import MaterialTable from "material-table";
import Navbar from "./../../../components/Navbar";
import Message from "./../../../components/alert/Message";
import Loader from "./../../../components/alert/Loader";
import NavbarCategories from "./../../../components/NavbarCategories";
import { listUserOrders } from "../../../actions/orderActions";
import Moment from "react-moment";
import Footer from './../../../components/Footer';

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
    },

    input: {
        color: "#855C1B",

        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#855C1B",
        },

        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#388667",
        },

        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
                borderColor: "#388667",
            },

        "& .MuiInputLabel-outlined": {
            color: "#855C1B",
            fontWeight: "600",
            fontFamily: "Quicksand",
        },

        "&:hover .MuiInputLabel-outlined": {
            color: "#388667",
        },

        "& .MuiInputLabel-outlined.Mui-focused": {
            color: "#388667",
        },
    },

    checkbox: {
        color: "#855C1B",
    },

    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },

    label: {
        fontFamily: "Quicksand",
        color: "#855C1B",
        marginLeft: 0,
    },

    link: {
        color: "#855C1B",
        fontWeight: '600',

        "&:hover": {
            color: "#388667",
        },
    },
}));

const OrderHistoryScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [isOrderEmpty, setIsOrderEmpty] = useState(true);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderUserList = useSelector((state) => state.orderUserList);
    const { loading, error, orders } = orderUserList;

    useEffect(() => {
        !userInfo && history.push("/login");

        if (isOrderEmpty) {
            dispatch(listUserOrders());
            setIsOrderEmpty(false);
        }
    }, [history, isOrderEmpty]);

    return (
        <>
            <Navbar />
            <NavbarCategories />

            <section className="ctn">
                {loading ? (
                    <div className="product">
                        <Loader />
                    </div>
                ) : error ? (
                    <Message variant="error">{error}</Message>
                ) : (
                    <>
                        <Paper elevation={3} className="content-title">
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" to="/" className="bc">
                                    Homescreen
                                </Link>
                                <Typography className="bc-p">
                                    My Orders
                                </Typography>
                            </Breadcrumbs>
                        </Paper>

                        <Paper className="product__container">
                            <div className="cart">
                                <MaterialTable
                                    title="Orders List"
                                    components={{
                                        Container: (props) => (
                                            <Paper
                                                className={
                                                    classes.materialTable
                                                }
                                                {...props}
                                            />
                                        ),
                                    }}
                                    columns={[
                                        {
                                            title: "Go to Order",
                                            field: "id",
                                            render: (orders) => {
                                                {
                                                    return (
                                                        <Link
                                                            to={`/order-history/${orders.order_id}/${userInfo.data.user_id}`}
                                                            className={
                                                                classes.link
                                                            }
                                                            target="_blank"
                                                        >
                                                            Order Details
                                                        </Link>
                                                    );
                                                }
                                            },
                                        },
                                        {
                                            title: "Status",
                                            field: "status",
                                            render: (orders) => {
                                                return orders.status == "PENDING" ? (
                                                    <span className="notPaid">
                                                        {orders.status}
                                                    </span>
                                                ) : orders.status == "PAID" ? (
                                                    <span className="isPaid">
                                                        {orders.status}
                                                    </span>
                                                ) : orders.status == "DELIVERED" ? (
                                                    <span className="delivered">
                                                        {orders.status}
                                                    </span>
                                                ) : (
                                                    <span className="failed">
                                                        ORDER FAILED
                                                    </span>
                                                );
                                            },
                                        },
                                        {
                                            title: "Total to Pay",
                                            field: "total_price",
                                            render: (orders) => {
                                                return (
                                                    <span>&euro; {orders.total_price}</span>
                                                );
                                            },
                                        },
                                        {
                                            title: "Is paid?",
                                            field: "is_paid",
                                            render: (orders) => {
                                                return orders.is_paid < 1 ? (
                                                    <span className="notPaid">No</span>
                                                ) : (
                                                    <span className="isPaid">Yes</span>
                                                );
                                            },
                                        },
                                        {
                                            title: "Is delivered?",
                                            field: "is_delivered",
                                            render: (orders) => {
                                                return orders.is_delivered < 1 ? (
                                                    <span className="notPaid">No</span>
                                                ) : (
                                                    <span className="delivered">Yes</span>
                                                );
                                            },
                                        },
                                        {
                                            title: "Paid At",
                                            field: "paid_at",
                                            render: (orders) => {
                                                return (
                                                    <>
                                                        {!orders.paid_at ? (
                                                            "--/--/---- --/--"
                                                        ) : (
                                                            <Moment format="DD/MM/YYYY HH:mm">
                                                                {orders.paid_at}
                                                            </Moment>
                                                        )}
                                                    </>
                                                );
                                            },
                                        },
                                        {
                                            title: "Delivered At",
                                            field: "delivered_at",
                                            render: (orders) => {
                                                return (
                                                    <>
                                                        {!orders.delivered_at ? (
                                                            "--/--/---- --/--"
                                                        ) : (
                                                            <Moment format="DD/MM/YYYY HH:mm">
                                                                {orders.delivered_at}
                                                            </Moment>
                                                        )}
                                                    </>
                                                );
                                            },
                                        },
                                        {
                                            title: "Created At",
                                            field: "created_at",
                                            render: (orders) => {
                                                return (
                                                    <Moment format="DD/MM/YYYY HH:mm">
                                                        {orders.created_at}
                                                    </Moment>
                                                );
                                            },
                                        },
                                    ]}
                                    data={orders && orders.data}
                                    options={{
                                        actionsColumnIndex: -1,
                                        headerStyle: {
                                            color: "#855C1B",
                                            fontFamily: "Quicksand",
                                            fontSize: "1.2rem",
                                            backgroundColor: "#FDF7E9",
                                        },
                                    }}
                                />
                            </div>
                        </Paper>
                    </>
                )}
            </section>

            <hr className="divider2" />
            <Footer />
        </>
    );
};

export default OrderHistoryScreen;
