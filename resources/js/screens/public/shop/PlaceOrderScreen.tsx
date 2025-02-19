import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link, useNavigate, useParams, useLocation} from "react-router-dom";
import Swal from "sweetalert2";
import {
    Paper,
    Typography,
    Breadcrumbs,
    Button,
} from "@mui/material";
import NavbarCategories from "@/components/NavbarCategories.js";
import Navbar from "@/components/Navbar.js";
import Footer from "@/components/Footer.js";
import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import {getAddress} from "./@/actions/addressActions";
import {removeFromCart} from "./@/actions/cartActions";
import {createOrder} from "@/actions/orderActions";
import {AppDispatch, RootState} from "@/store";
import {Cart} from "@/features/cart/cartSlice";

interface PlaceOrderScreenProps {
}

const PlaceOrderScreen: React.FC<PlaceOrderScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {id: userId} = useParams<{ id?: string }>();

    const {userInfo} = useSelector((state: RootState) => state.user);
    const {cartItems} = useSelector((state: RootState) => state.cart);

    const {
        order,
        success: orderSuccess,
        error: orderError,
        loading: orderLoading
    } = useSelector((state: RootState) => state.order);

    const {
        currentAddress: address,
        loading: addressLoading,
        error: addressError
    } = useSelector((state: RootState) => state.address);

    const addDecimals = (num: number): string => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const [newOrderId, setNewOrderId] = useState<number | null>(null);

    const itemsPrice = addDecimals(
        cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    const itemsPriceDiscount = cartItems.reduce(
        (acc, item) =>
            acc + item.qty * (item.price - (item.price * (item.discount || 0)) / 100),
        0
    ).toFixed(2);
    const shippingPrice = addDecimals(Number(itemsPrice) > 100 ? 0 : 15);
    const taxPrice = addDecimals(Number((0.15 * Number(itemsPrice)).toFixed(2)));
    const totalPrice = (
        Number(itemsPriceDiscount) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    const cart: Cart = {
        cartItems,
        itemsPrice,
        itemsPriceDiscount,
        shippingPrice,
        taxPrice,
        totalPrice
    };

    useEffect(() => {
        if (!userInfo || (userId && userInfo?.id.toString() !== userId)) {
            navigate("/");
            return;
        }

        if (orderSuccess) {
            cartItems.forEach((item) => {
                dispatch(removeFromCart(item.product));
            });

            order && navigate(`/order-history/${order?.id}/${userInfo?.id}`);
        }

        if (userInfo) {
            dispatch(getAddress(userInfo?.id));
        }
    }, [dispatch, order, userInfo, orderSuccess, navigate, userId, cartItems]);

    const placeOrderHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(
            createOrder({
                user_id: userInfo?.id,
                cart_items: cart.cartItems,
                products_price: Number(cart.itemsPrice),
                shipping_price: Number(cart.shippingPrice),
                tax_price: Number(cart.taxPrice),
                total_price: Number(cart.totalPrice),
                products_discount_price: Number(cart.itemsPriceDiscount),
            })
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
            <Navbar/>
            <NavbarCategories/>

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
                            to={`/shipping-to/${userInfo?.id}`}
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
                                    <Loader/>
                                </div>
                            ) : addressError ? (
                                <Message variant="error">{addressError}</Message>
                            ) : (
                                <div className="order__container--po-left-detail">
                                    <h2 className="order__container--po-left-detail--title">
                                        Sending to
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {address?.[0]?.name} {address?.[0]?.surname}
                                    </div>

                                    <h2 className="order__container--po-left-detail--title">
                                        Address
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {address?.[0]?.country}, {address?.[0]?.city},{" "}
                                        {address?.[0]?.address}, {address?.[0]?.postal_code}
                                    </div>

                                    <h2 className="order__container--po-left-detail--title">
                                        Phone Number
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {address &&
                                            address.data &&
                                            address.data[0].phone_number}
                                    </div>

                                    <br/>

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

                                <br/>

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

                                <hr className="divider"/>

                                <div className="show-tabel-form">
                                    <Message variant="info">
                                        Place Order and Pay After.
                                    </Message>
                                    <br/>
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

            <hr className="divider2"/>
            <Footer/>
        </>
    );
};

export default PlaceOrderScreen;
