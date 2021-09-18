import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
    Paper,
    Typography,
    Breadcrumbs,
    FormControl,
    Select,
    MenuItem,
    Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Navbar from "./../../../components/Navbar";
import NavbarCategories from "./../../../components/NavbarCategories";
import { removeFromCart, addToCart } from "../../../actions/cartActions";
import Message from "./../../../components/alert/Message";
import MaterialTable from "material-table";
import Footer from "../../../components/Footer";
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

const CartScreen = ({ location, match, history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const params = new URLSearchParams(location.search);
    const productId = match.params.id;
    const qty = params.get("qty");

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        !userInfo && history.push("/login");

        productId && dispatch(addToCart(productId, qty));
    }, [dispatch, productId]);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
        history.push("/cart");
    };

    const checkoutHandler = () => {
        history.push(`/shipping-to/${userInfo.data.user_id}`);

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
            title: `Proceed to checkout with success`,
        });
    };

    return (
        <>
            <Navbar />
            <NavbarCategories />

            <section className="ctn">
                {cartItems && cartItems.length === 0 ? (
                    <div className="product">
                        <Message variant="warning">
                            Your cart is empty <Link to={`/`} className={classes.link}>Go Back</Link>
                        </Message>
                    </div>
                ) : (
                    <>
                        <Paper elevation={3} className="content-title">
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" to="/" className="bc">
                                    Homescreen
                                </Link>
                                <Typography className="bc-p">Cart</Typography>
                            </Breadcrumbs>
                        </Paper>

                        <Paper className="product__container">
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
                                                    return (
                                                        <form>
                                                            <FormControl
                                                                required
                                                                variant="outlined"
                                                                className={
                                                                    classes.formControl
                                                                }
                                                                size="small"
                                                            >
                                                                <Select
                                                                    labelId="quantity"
                                                                    id={`quantity-select-${cartItems.product}`}
                                                                    value={
                                                                        cartItems.qty
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        dispatch(
                                                                            addToCart(
                                                                                cartItems.slug,
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            )
                                                                        )
                                                                    }
                                                                >
                                                                    {[
                                                                        ...Array(
                                                                            cartItems.total_quantities
                                                                        ).keys(),
                                                                    ].map(
                                                                        (x) => (
                                                                            <MenuItem
                                                                                key={
                                                                                    x +
                                                                                    1
                                                                                }
                                                                                value={
                                                                                    x +
                                                                                    1
                                                                                }
                                                                            >
                                                                                {x +
                                                                                    1}
                                                                            </MenuItem>
                                                                        )
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        </form>
                                                    );
                                                }
                                            },
                                        },
                                    ]}
                                    data={cartItems}
                                    actions={[
                                        {
                                            icon: "delete",
                                            tooltip: "Remove item from Cart",
                                            onClick: (event, rowData) => {
                                                removeFromCartHandler(
                                                    rowData.product
                                                );
                                            },
                                        },
                                    ]}
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

                                <Paper className="product__paper">
                                    <div className="product__paper--div">
                                        <h4 className="divider">Subtotal:</h4>
                                        <p className="product__paper--p">
                                            {cartItems.reduce(
                                                (acc, item) =>
                                                    acc + Number(item.qty),
                                                0
                                            )}{" "}
                                            items
                                        </p>
                                    </div>

                                    <div className="product__paper--div">
                                        <h4 className="divider">
                                            Total with Discount:
                                        </h4>
                                        <span
                                            color="inherit"
                                            className="product__paper--p"
                                        >
                                            &euro;
                                            {cartItems
                                                .reduce(
                                                    (acc, item) =>
                                                        acc +
                                                        item.qty *
                                                            (item.price -
                                                                (item.price *
                                                                    item.discount) /
                                                                    100),
                                                    0
                                                )
                                                .toFixed(2)}
                                        </span>
                                        {" - "}
                                        <strike>
                                            &euro;
                                            {cartItems
                                                .reduce(
                                                    (acc, item) =>
                                                        acc +
                                                        item.qty * item.price,
                                                    0
                                                )
                                                .toFixed(2)}
                                        </strike>
                                    </div>

                                    <hr className="divider" />

                                    <div className="product-tabel-form">
                                        <form>
                                            <div className="form__field">
                                                <Button
                                                    variant="contained"
                                                    className={classes.button}
                                                    type="button"
                                                    onClick={checkoutHandler}
                                                >
                                                    Proceed to checkout
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </Paper>
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

export default CartScreen;
