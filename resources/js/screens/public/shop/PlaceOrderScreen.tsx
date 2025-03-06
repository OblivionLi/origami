import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import Swal from "sweetalert2";
import {
    Paper,
    Typography,
    Breadcrumbs,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@mui/material";
import NavbarCategories from "@/components/NavbarCategories.js";
import Navbar from "@/components/Navbar.js";
import Footer from "@/components/Footer.js";
import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import {removeFromCart} from "@/features/cart/cartSlice";
import {createOrder} from "@/features/order/orderSlice";
import {AppDispatch, RootState} from "@/store";
import {Cart} from "@/features/cart/cartSlice";
import {clearAddressSuccess, clearUserError, getUserAddress} from "@/features/user/userSlice";
import {resetCheckout, setShippingCompleted} from "@/features/checkout/checkoutSlice";
import {Address} from '@/features/address/addressSlice';
import {StyledButton, StyledDivider3, StyledLink} from "@/styles/muiStyles";

interface PlaceOrderScreenProps {
}

const PlaceOrderScreen: React.FC<PlaceOrderScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {addressId} = useParams();
    const addressIdNum = parseInt(addressId!, 10);

    const {
        createdOrder,
        success: orderSuccess,
        error: orderError,
        loading: orderLoading
    } = useSelector((state: RootState) => state.order);

    const {
        userInfo,
        currentUser,
        loading: userLoading,
        error: userError,
    } = useSelector((state: RootState) => state.user);
    const {cartItems} = useSelector((state: RootState) => state.cart);
    const {shippingCompleted, cartCompleted} = useSelector((state: RootState) => state.checkout);

    const addDecimals = (num: number): string => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const [itemsPrice, setItemsPrice] = useState("0.00");
    const [itemsPriceDiscount, setItemsPriceDiscount] = useState("0.00");
    const [shippingPrice, setShippingPrice] = useState("0.00");
    const [taxPrice, setTaxPrice] = useState("0.00");
    const [totalPrice, setTotalPrice] = useState("0.00");

    useEffect(() => {
        if (cartItems) {
            const calculatedItemsPrice = cartItems.reduce(
                (acc, item) => acc + item.price! * item.qty,
                0
            );
            const calculatedItemsPriceDiscount = cartItems.reduce(
                (acc, item) =>
                    acc +
                    item.qty *
                    (item.price! - (item.price! * (item.discount || 0)) / 100),
                0
            );
            const calculatedShippingPrice =
                calculatedItemsPrice > 100 ? 0 : 15;
            const calculatedTaxPrice = 0.15 * calculatedItemsPriceDiscount;
            const calculatedTotalPrice =
                calculatedItemsPriceDiscount +
                calculatedShippingPrice +
                calculatedTaxPrice;

            setItemsPrice(addDecimals(calculatedItemsPrice));
            setItemsPriceDiscount(addDecimals(calculatedItemsPriceDiscount));
            setShippingPrice(addDecimals(calculatedShippingPrice));
            setTaxPrice(addDecimals(calculatedTaxPrice));
            setTotalPrice(addDecimals(calculatedTotalPrice));
        }
    }, [cartItems]);

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
            return;
        }

        dispatch(clearUserError());
        dispatch(clearAddressSuccess());

        dispatch(getUserAddress(userInfo?.data?.id));
    }, [userInfo, cartItems, dispatch, navigate, shippingCompleted, addressIdNum, cartCompleted]);

    useEffect(() => {
        if (orderSuccess && createdOrder) {
            cartItems.forEach((item) => {
                dispatch(removeFromCart(item.product));
            });

            dispatch(resetCheckout())
            navigate(`/order-history/${createdOrder.id}`);
        }
    }, [orderSuccess, dispatch, navigate, createdOrder, cartItems]);

    const placeOrderHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (!userInfo?.data?.id) {
            console.error("User ID is missing!");
            return;
        }

        const cart: Cart = {
            cartItems,
            itemsPrice,
            itemsPriceDiscount,
            shippingPrice,
            taxPrice,
            totalPrice,
        };

        dispatch(
            createOrder({
                user_id: userInfo.data.id,
                address_id: addressIdNum,
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

    const userAddress: Address | undefined = currentUser?.data?.address?.find(item => item.id === addressIdNum);

    const [expandedRow, setExpandedRow] = React.useState<number | null>(null);

    const handleRowClick = (rowId: number) => {
        setExpandedRow((prevExpandedRow) => (prevExpandedRow === rowId ? null : rowId));
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
                        <Link color="inherit" to="/shipping" className="bc">
                            Shipping
                        </Link>
                        <Typography className="bc-p">Place Order</Typography>
                    </Breadcrumbs>
                </Paper>

                <Paper className="order__container">
                    <div className="order">
                        <div className="order__container--po-left">
                            {!userAddress ? (
                                <div className="loaderCenter">
                                    <Loader/>
                                </div>
                            ) : (
                                <div className="order__container--po-left-detail">
                                    <h2 className="order__container--po-left-detail--title">
                                        Sending to
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {userAddress.name} {userAddress.surname}
                                    </div>

                                    <h2 className="order__container--po-left-detail--title">
                                        Address
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {userAddress.country}, {userAddress.city},{" "}
                                        {userAddress.address}, {userAddress.postal_code}
                                    </div>

                                    <h2 className="order__container--po-left-detail--title">
                                        Phone Number
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {userAddress.phone_number}
                                    </div>

                                    <br/>

                                    <Message variant="info">
                                        Make sure your name, address and phone
                                        number is correct. If it's not then
                                        click{" "}
                                        <StyledLink
                                            to={`/shipping`}
                                        >
                                            HERE
                                        </StyledLink>{" "}
                                        and fix them.
                                    </Message>
                                </div>
                            )}

                            <TableContainer component={Paper} className="materialTable">
                                <Table aria-label="cart table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    color: "#855C1B",
                                                    fontFamily: "Quicksand",
                                                    fontSize: "1.2rem",
                                                    backgroundColor: "#FDF7E9",
                                                }}
                                            >
                                                Name
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#855C1B",
                                                    fontFamily: "Quicksand",
                                                    fontSize: "1.2rem",
                                                    backgroundColor: "#FDF7E9",
                                                }}
                                            >
                                                Discount
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#855C1B",
                                                    fontFamily: "Quicksand",
                                                    fontSize: "1.2rem",
                                                    backgroundColor: "#FDF7E9",
                                                }}
                                            >
                                                Price
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#855C1B",
                                                    fontFamily: "Quicksand",
                                                    fontSize: "1.2rem",
                                                    backgroundColor: "#FDF7E9",
                                                }}
                                            >
                                                Total Price
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    color: "#855C1B",
                                                    fontFamily: "Quicksand",
                                                    fontSize: "1.2rem",
                                                    backgroundColor: "#FDF7E9",
                                                }}
                                            >
                                                Quantity
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cartItems.map((item, index) => {
                                            const discountedPrice = item.price! - (item.price! * (item.discount || 0)) / 100;
                                            const totalPrice = discountedPrice * item.qty;

                                            return (
                                                <React.Fragment key={index}>
                                                    <TableRow onClick={() => handleRowClick(index)}>
                                                        <TableCell>
                                                            <StyledLink to={`/product/${item.slug}`} target="_blank">
                                                                {item.name}
                                                            </StyledLink>
                                                        </TableCell>
                                                        <TableCell>{item.discount ? `${item.discount}%` : "-"}</TableCell>
                                                        <TableCell>
                                                            <span>€{discountedPrice.toFixed(2)}</span>{" "}
                                                            {item.discount ? <s>€{item.price}</s> : null}
                                                        </TableCell>
                                                        <TableCell>
                                                            €{totalPrice.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell>{item.qty}</TableCell>
                                                    </TableRow>
                                                    {expandedRow === index && (
                                                        <TableRow>
                                                            <TableCell colSpan={12}>
                                                                <div className="table-detail" style={{width: '100%'}}>
                                                                    <Typography variant="h6"
                                                                                className="table-detail--title"
                                                                                style={{width: '100%'}}>
                                                                        Product Code
                                                                    </Typography>
                                                                    <div className="table-detail--par">
                                                                        <Typography>{item.product_code}</Typography>
                                                                    </div>
                                                                    <Typography variant="h6"
                                                                                className="table-detail--title"
                                                                                style={{width: '100%'}}>
                                                                        Product Description
                                                                    </Typography>
                                                                    <div className="table-detail--par">
                                                                        <Typography>{item.description}</Typography>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
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
                                        &euro; {itemsPriceDiscount}
                                    </span>
                                    {" - "}
                                    <s>&euro; {itemsPrice}</s>
                                </div>

                                <div className="show__paper--div">
                                    <h4 className="divider">Shipping Tax:</h4>
                                    <p className="show__paper--p">
                                        &euro; {shippingPrice}
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
                                        &euro; {taxPrice}
                                    </p>
                                    <small>tax formula: 0.15 * subtotal</small>
                                </div>

                                <div className="show__paper--div">
                                    <h4 className="divider">
                                        Total with Taxes:
                                    </h4>
                                    <p className="show__paper--p">
                                        &euro; {totalPrice}
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
                                            <StyledButton
                                                variant="contained"
                                                type="button"
                                                onClick={placeOrderHandler}
                                            >
                                                Place Order
                                            </StyledButton>
                                        </div>
                                    </form>
                                </div>
                            </Paper>
                        </div>
                    </div>
                </Paper>
            </section>

            <StyledDivider3/>
            <Footer/>
        </>
    );
};

export default PlaceOrderScreen;
