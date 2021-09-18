import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    makeStyles,
    Button,
    TextField,
    Paper,
    Breadcrumbs,
    Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import MaterialTable from "material-table";
import Navbar from "./../../../components/Navbar";
import Message from "./../../../components/alert/Message";
import Loader from "./../../../components/alert/Loader";
import NavbarCategories from "./../../../components/NavbarCategories";
import Moment from "react-moment";
import Footer from "./../../../components/Footer";
import { getUser } from "./../../../actions/userActions";
import { getOrder, deliverOrder } from "./../../../actions/orderActions";
import {
    ORDER_DELIVER_RESET,
    ORDER_PAY_RESET,
} from "../../../constants/orderConstants";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutFormScreen from "./../stripe/CheckoutFormScreen";

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
        fontWeight: "600",

        "&:hover": {
            color: "#388667",
        },
    },

    materialTable: {
        fontFamily: "Quicksand",
        fontWeight: "bold",
        color: "#388667",
        width: '100%',
    },
}));

const PUBLIC_KEY =
    "pk_test_51J7JDFH7KVlnwo43991XXPrSOWpQYenCEMAY6S1dT5eP6WLOWP7W4z6O9nEhtr1rbmpASbvA8r4lKMr3da5sN0nd00VuikAH3F";

const stripePromise = loadStripe(PUBLIC_KEY);

const ShowOrderScreen = ({ match, history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const orderId = match.params.id;
    const [perms, setPerms] = useState(false);
    const [isOrderEmpty, setIsOrderEmpty] = useState(true);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderShow = useSelector((state) => state.orderShow);
    const { order, loading, error } = orderShow;

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const userShow = useSelector((state) => state.userShow);
    const { user } = userShow;

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );

    cart.itemsPriceDiscount = cartItems
        .reduce(
            (acc, item) =>
                acc +
                item.qty * (item.price - (item.price * item.discount) / 100),
            0
        )
        .toFixed(2);

    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);

    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));

    cart.totalPrice = (
        Number(cart.itemsPriceDiscount) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (!userInfo || userInfo == null) {
            history.push("/login");
        } else {
            dispatch(getUser(userInfo.data.user_id));
        }

        if (isOrderEmpty) {
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch({ type: ORDER_PAY_RESET });
            dispatch(getOrder(orderId));
            setIsOrderEmpty(false);
        }

        if (
            (order && order.data && user && user.data && order.data.user_id == user.data.id) ||
            userInfo.data.is_admin > 0
        ) {
            setPerms(true);
        }
    }, [dispatch, order, isOrderEmpty, successDeliver, successPay]);

    const deliverHandler = () => {
        dispatch(deliverOrder(order.data.id));
        history.push(`/order-history/${orderId}`);
    };

    return loading ? (
        <div className="product">
            <Loader />
        </div>
    ) : perms && (
        <>
            <Navbar />
            <NavbarCategories />

            <section className="ctn">
                <Paper elevation={3} className="content-title">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/" className="bc">
                            Homescreen
                        </Link>
                        <Link
                            color="inherit"
                            to="/order-history"
                            className="bc"
                        >
                            Order History
                        </Link>
                        <Typography className="bc-p">Order Details</Typography>
                    </Breadcrumbs>
                </Paper>

                <Paper className="product__container">
                    <div className="product">
                        <div className="product__container--po-left">
                            {loading ? (
                                <div className="product">
                                    <Loader />
                                </div>
                            ) : error ? (
                                <Message variant="error">{error}</Message>
                            ) : (
                                <>
                                    <div className="table-detail">
                                        <h2 className="table-detail--title">
                                            Sending to
                                        </h2>
                                        <div className="table-detail--par">
                                            {user &&
                                                user.data &&
                                                user.data.address[0].name}{" "}
                                            {user &&
                                                user.data &&
                                                user.data.address[0].surname}
                                        </div>

                                        <h2 className="table-detail--title">
                                            Address
                                        </h2>
                                        <div className="table-detail--par">
                                            {user &&
                                                user.data &&
                                                user.data.address[0].country}
                                            {", "}
                                            {user &&
                                                user.data &&
                                                user.data.address[0].city}
                                            {", "}
                                            {user &&
                                                user.data &&
                                                user.data.address[0].address}
                                            {", "}
                                            {user &&
                                                user.data &&
                                                user.data.address[0]
                                                    .postal_code}
                                            {", "}
                                        </div>

                                        <h2 className="table-detail--title">
                                            Phone Number
                                        </h2>
                                        <div className="table-detail--par">
                                            {user &&
                                                user.data &&
                                                user.data.address[0]
                                                    .phone_number}
                                        </div>

                                        <h2 className="table-detail--title">
                                            Deliver Status
                                        </h2>
                                        <div className="table-detail--par">
                                            {order.data.is_delivered > 0 ? (
                                                <Message variant="success">
                                                    Delivered on{" "}
                                                    {order.data.delivered_at}
                                                </Message>
                                            ) : (
                                                <Message variant="warning">
                                                    Not Delivered
                                                </Message>
                                            )}
                                        </div>

                                        <h2 className="table-detail--title">
                                            Pay Status
                                        </h2>
                                        <div className="table-detail--par">
                                            {order.data.is_paid > 0 ? (
                                                <Message variant="success">
                                                    Paid on {order.data.paid_at}
                                                </Message>
                                            ) : (
                                                <Message variant="warning">
                                                    Not Paid
                                                </Message>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="cart">
                                <MaterialTable
                                    title="Ordered Items"
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
                                            title: "Product Name",
                                            field: "name",
                                            render: (product) => {
                                                return (
                                                    <Link
                                                        to={`/product/${product.id}`}
                                                        className={classes.link}
                                                        target="_blank"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                );
                                            },
                                        },
                                        {
                                            title: "Product Code",
                                            field: "product_code",
                                        },
                                        {
                                            title: "Discount",
                                            field: "discount",
                                            render: (product) => {
                                                return product.discount == null
                                                    ? "0 %"
                                                    : `${product.discount} %`;
                                            },
                                        },
                                        {
                                            title: "Price",
                                            field: "price",
                                            render: (product) => {
                                                return (
                                                    <>
                                                        <span>
                                                            &euro;
                                                            {(
                                                                product.price -
                                                                (product.price *
                                                                    product.discount) /
                                                                    100
                                                            ).toFixed(2)}
                                                        </span>
                                                        {"   "}
                                                        <strike>
                                                            &euro;
                                                            {product.price}
                                                        </strike>
                                                    </>
                                                );
                                            },
                                        },
                                        {
                                            title: "Quantity",
                                            field: "pivot.qty",
                                        },
                                    ]}
                                    data={order.data && order.data.products}
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
                        </div>

                        <div className="product__container--po-right">
                            <Paper className="product__paper2">
                                <h3 className="divider">Order Summary</h3>

                                <br />

                                <div className="product__paper--div">
                                    <h4 className="divider">Total to Pay:</h4>
                                    <p className="product__paper--p">
                                        &euro; {order.data.total_price}
                                    </p>
                                </div>

                                <div className="product__paper--div">
                                    <h4 className="divider">Status</h4>
                                    <Message
                                        variant={
                                            order.data.status === "PENDING"
                                                ? "warning"
                                                : "success"
                                        }
                                    >
                                        {order.data.status}
                                    </Message>
                                </div>

                                {error && (
                                    <Message variant="error">{error}</Message>
                                )}

                                <div className="product__paper--div">
                                    {loadingDeliver && <Loader />}
                                    {userInfo &&
                                        userInfo.data.role &&
                                        userInfo.data.role[0] ==
                                            "Administrator" &&
                                        //order.is_paid == 0 &&
                                        order.data.is_delivered == 0 && (
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={deliverHandler}
                                                className={classes.button}
                                            >
                                                Mark as Delivered
                                            </Button>
                                        )}
                                </div>

                                <div className="product__paper--div">
                                    {order.data.is_paid == 0 && (
                                        <div className={classes.checkout}>
                                            {loadingPay && <Loader />}
                                            <Elements stripe={stripePromise}>
                                                <CheckoutFormScreen
                                                    orderId={orderId}
                                                    totalPrice={
                                                        order.data.total_price
                                                    }
                                                />
                                            </Elements>
                                        </div>
                                    )}
                                </div>
                            </Paper>
                        </div>
                    </div>
                </Paper>
            </section>

            <hr className="divider2" />
            <Footer />
        </>
    )
};

export default ShowOrderScreen;
