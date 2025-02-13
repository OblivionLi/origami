import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
    Paper,
    Typography,
    Breadcrumbs,
    TextField,
    Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Navbar from "../../../components/Navbar.js";
import NavbarCategories from "./../../../components/NavbarCategories";
import Footer from "../../../components/Footer.js";
import { getAddress } from "./../../../actions/addressActions";
import { removeFromCart } from "./../../../actions/cartActions";
import { createOrder } from "../../../actions/orderActions";
import Message from "../../../components/alert/Message.js";
import Loader from "../../../components/alert/Loader.js";
import MaterialTable from "material-table";
import Swal from "sweetalert2";

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

    card: {
        maxWidth: 345,
        minWidth: 345,
        boxShadow:
            "0px 3px 3px -2px rgb(190 142 76), 0px 3px 4px 0px rgb(190 142 76), 0px 1px 8px 0px rgb(190 142 76)",
    },

    media: {
        height: 345,
        width: "100%",
    },

    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",
        color: "white",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },

    materialTable: {
        fontFamily: "Quicksand",
        fontWeight: "bold",
        color: "#388667",

        [theme.breakpoints.down("sm")]: {
            width: "100%",
        },
    },

    link: {
        color: "#855C1B",
        fontWeight: "600",

        "&:hover": {
            color: "#388667",
        },
    },
}));

const PlaceOrderScreen = ({ match, history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const userId = match.params.id;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const orderCreate = useSelector((state) => state.orderCreate);
    const { order, success, error } = orderCreate;

    const addressShow = useSelector((state) => state.addressShow);
    const { address, loading: addressLoading } = addressShow;

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

    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 15);

    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));

    cart.totalPrice = (
        Number(cart.itemsPriceDiscount) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2);

    useEffect(() => {
        !userInfo || (userInfo.data.user_id != userId && history.push("/"));

        if (success) {
            cartItems.map((item) => {
                dispatch(removeFromCart(item.product));
            });

            order &&
                history.push(
                    `/order-history/${order.id}/${userInfo.data.user_id}`
                );
        }

        dispatch(getAddress(userInfo.data.id));
    }, [dispatch, order, userInfo, success]);

    const placeOrderHandler = (e) => {
        e.preventDefault();

        dispatch(
            createOrder(
                userInfo.data.id,
                cart.cartItems,
                cart.itemsPrice,
                cart.shippingPrice,
                cart.taxPrice,
                cart.totalPrice,
                cart.itemsPriceDiscount
            )
        );

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });

        Toast.fire({
            icon: "success",
            title: `Order placed with success`,
        });
    };

    return (
        <>
            <Navbar />
            <NavbarCategories />

            <section className="ctn">
                <Paper elevation={3} className="content-title">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/" className="bc">
                            Homescreen
                        </Link>
                        <Link color="inherit" to="/cart" className="bc">
                            Cart
                        </Link>
                        <Link
                            color="inherit"
                            to={`/shipping-to/${userInfo.data.id}`}
                            className="bc"
                        >
                            Shipping
                        </Link>
                        <Typography className="bc-p">Place Order</Typography>
                    </Breadcrumbs>
                </Paper>

                <Paper className="order__container">
                    <div className="order">
                        <div className="order__container--po-left">
                            {addressLoading ? (
                                <div className="loaderCenter">
                                    <Loader />
                                </div>
                            ) : error ? (
                                <Message variant="error">{error}</Message>
                            ) : (
                                <div className="order__container--po-left-detail">
                                    <h2 className="order__container--po-left-detail--title">
                                        Sending to
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {address &&
                                            address.data &&
                                            address.data[0].name}{" "}
                                        {address &&
                                            address.data &&
                                            address.data[0].surname}
                                    </div>

                                    <h2 className="order__container--po-left-detail--title">
                                        Address
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {address &&
                                            address.data &&
                                            address.data[0].country}
                                        {", "}
                                        {address &&
                                            address.data &&
                                            address.data[0].city}
                                        {", "}
                                        {address &&
                                            address.data &&
                                            address.data[0].address}
                                        {", "}
                                        {address &&
                                            address.data &&
                                            address.data[0].postal_code}
                                        {", "}
                                    </div>

                                    <h2 className="order__container--po-left-detail--title">
                                        Phone Number
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {address &&
                                            address.data &&
                                            address.data[0].phone_number}
                                    </div>

                                    <br />

                                    <Message variant="info">
                                        Make sure your name, address and phone
                                        number is correct. If it's not then
                                        click{" "}
                                        <a
                                            href={`/shipping-to/${userInfo.data.user_id}`}
                                            className={classes.link}
                                        >
                                            HERE
                                        </a>{" "}
                                        and fix them.
                                    </Message>
                                </div>
                            )}

                            <div className="cart">
                                <MaterialTable
                                    title="Cart List"
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
                                            title: "Name",
                                            field: "name",
                                            render: (cartItems) => {
                                                {
                                                    return (
                                                        <Link
                                                            to={`/product/${cartItems.slug}`}
                                                            className={
                                                                classes.link
                                                            }
                                                            target="_blank"
                                                        >
                                                            {cartItems.name}
                                                        </Link>
                                                    );
                                                }
                                            },
                                        },
                                        {
                                            title: "Discount",
                                            field: "discount",
                                            render: (cartItems) => {
                                                {
                                                    return `${cartItems.discount} %`;
                                                }
                                            },
                                        },
                                        {
                                            title: "Price",
                                            field: "price",
                                            render: (cartItems) => {
                                                {
                                                    return (
                                                        <>
                                                            <span>
                                                                &euro;
                                                                {(
                                                                    cartItems.price -
                                                                    (cartItems.price *
                                                                        cartItems.discount) /
                                                                        100
                                                                ).toFixed(2)}
                                                            </span>
                                                            {"   "}
                                                            <strike>
                                                                &euro;
                                                                {
                                                                    cartItems.price
                                                                }
                                                            </strike>
                                                        </>
                                                    );
                                                }
                                            },
                                        },
                                        {
                                            title: "Quantity",
                                            field: "qty",
                                            render: (cartItems) => {
                                                {
                                                    return cartItems.qty;
                                                }
                                            },
                                        },
                                    ]}
                                    data={cartItems}
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
                                                    Product Code
                                                </h2>
                                                <div className="table-detail--par">
                                                    <p>
                                                        {rowData.product_code}
                                                    </p>
                                                </div>
                                                <h2 className="table-detail--title">
                                                    Product Description
                                                </h2>
                                                <div className="table-detail--par">
                                                    <p>{rowData.description}</p>
                                                </div>
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        <div className="order__container--po-right">
                            <Paper className="show__paper">
                                <h3 className="divider">Order Summary</h3>

                                <br />

                                <div className="show__paper--div">
                                    <h4 className="divider">
                                        Number of Products:
                                    </h4>
                                    <p className="show__paper--p">
                                        {cartItems.reduce(
                                            (acc, item) =>
                                                acc + Number(item.qty),
                                            0
                                        )}{" "}
                                        items
                                    </p>
                                </div>

                                <div className="show__paper--div">
                                    <h4 className="divider">Subtotal:</h4>
                                    <span
                                        color="inherit"
                                        className="show__paper--p"
                                    >
                                        &euro; {cart.itemsPriceDiscount}
                                    </span>
                                    {" - "}
                                    <strike>&euro; {cart.itemsPrice}</strike>
                                </div>

                                <div className="show__paper--div">
                                    <h4 className="divider">Shipping Tax:</h4>
                                    <p className="show__paper--p">
                                        &euro; {cart.shippingPrice}
                                    </p>
                                    <small>
                                        All orders over &euro; 100 are free for
                                        shipping.
                                    </small>
                                </div>

                                <div className="show__paper--div">
                                    <h4 className="divider">
                                        Total Product Tax:
                                    </h4>
                                    <p className="show__paper--p">
                                        &euro; {cart.taxPrice}
                                    </p>
                                    <small>tax formula: 0.15 * subtotal</small>
                                </div>

                                <div className="show__paper--div">
                                    <h4 className="divider">
                                        Total with Taxes:
                                    </h4>
                                    <p className="show__paper--p">
                                        &euro; {cart.totalPrice}
                                    </p>
                                </div>

                                <hr className="divider" />

                                <div className="show-tabel-form">
                                    <Message variant="info">
                                        Place Order and Pay After.
                                    </Message>
                                    <br />
                                    <form>
                                        <div className="form__field">
                                            <Button
                                                variant="contained"
                                                className={classes.button}
                                                type="button"
                                                onClick={placeOrderHandler}
                                            >
                                                Place Order
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            </Paper>
                        </div>
                    </div>
                </Paper>
            </section>

            <hr className="divider2" />
            <Footer />
        </>
    );
};

export default PlaceOrderScreen;
