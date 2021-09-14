import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogActions, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Moment from "react-moment";
import Swal from "sweetalert2";
import Loader from "./../../../components/alert/Loader";
import Message from "./../../../components/alert/Message";
import { Link } from "react-router-dom";
import { listOrders } from "./../../../actions/orderActions";

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

    materialTable: {
        fontFamily: "Quicksand",
        fontWeight: "bold",
        color: "#388667",
    },

    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#388667",

        "&:hover": {
            backgroundColor: "#855C1B",
        },
    },

    link: {
        color: "#855C1B",

        "&:hover": {
            color: "#388667",
        },
    },
}));

const OrderScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const user_perms = [];

    const [isAdmin, setIsAdmin] = useState(false);
    const [requestData, setRequestData] = useState(new Date());

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders } = orderList;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            if (!user_perms.includes("admin_view_orders")) {
                history.push("/admin");

                Swal.fire(
                    "Sorry!",
                    `You don't have access to this action.`,
                    "warning"
                );
            } else {
                setIsAdmin(true);
                dispatch(listOrders());
            }
        }
    }, [dispatch, userInfo, requestData]);

    if (!Array.isArray(user_perms) || !user_perms.length) {
        userInfo.data.details[0].permissions.map((perm) =>
            user_perms.push(perm.name)
        );
    }

    return (
        <Paper className="admin-content">
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader />
                </div>
            ) : (
                <>
                    <h2 className={classes.divider}>Orders</h2>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialTable
                            title="Orders List"
                            components={{
                                Container: (props) => (
                                    <Paper
                                        className={classes.materialTable}
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
                                                    to={`/order-history/${orders.id}`}
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
                                    title: "Order By",
                                    field: "user.name",
                                },
                                {
                                    title: "Items Bought",
                                    field: "products",
                                    render: (orders) => {
                                        return orders.products.length;
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
                                            <span>
                                                &euro; {orders.total_price}
                                            </span>
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
                                            <span className="delivered">
                                                Yes
                                            </span>
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
                            detailPanel={(rowData) => {
                                return (
                                    <div className="table-detail">
                                        <h2 className="table-detail--title">
                                            User Details
                                        </h2>
                                        <div className="table-detail--par">
                                            <p>
                                                Name:{" "}
                                                {rowData.user.addresses[0].name}{" "}
                                                {
                                                    rowData.user.addresses[0]
                                                        .surname
                                                }
                                            </p>
                                            <p>
                                                Address:{" "}
                                                {
                                                    rowData.user.addresses[0]
                                                        .country
                                                }
                                                {", "}
                                                {rowData.user.addresses[0].city}
                                                {", "}
                                                {
                                                    rowData.user.addresses[0]
                                                        .address
                                                }
                                                {", "}
                                                {
                                                    rowData.user.addresses[0]
                                                        .postal_code
                                                }
                                            </p>

                                            <p>
                                                Phone Number:{" "}
                                                {
                                                    rowData.user.addresses[0]
                                                        .phone_number
                                                }
                                            </p>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                    )}
                </>
            )}
        </Paper>
    );
};

export default OrderScreen;
