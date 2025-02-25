import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {
    TableContainer,
    TableHead,
    TableBody,
    Table,
    TableRow,
    TableCell,
    Paper,
    Breadcrumbs,
    Typography,
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import Navbar from "@/components/Navbar.js";
import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import NavbarCategories from "@/components/NavbarCategories.js";
import Footer from "@/components/Footer.js";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import CheckoutFormScreen from "../stripe/CheckoutFormScreen.js";
import {AppDispatch, RootState} from "@/store";
import {StyledButton, StyledDivider, StyledDivider3, StyledLink} from "@/styles/muiStyles";
import {clearAddressSuccess, clearUserError, getUserAddress} from "@/features/user/userSlice";
import {fetchOrderById} from "@/features/order/orderSlice";
import {Product} from "@/features/product/productSlice";

const PUBLIC_KEY = import.meta.env.VITE_STRIPE_KEY;
// const stripePromise = loadStripe(PUBLIC_KEY);

interface ShowOrderScreen {
}

const ShowOrderScreen: React.FC<ShowOrderScreen> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {orderId} = useParams();

    const [perms, setPerms] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);

    const {
        userInfo,
        currentUser,
        loading: userLoading,
        error: userError,
    } = useSelector((state: RootState) => state.user);

    const {currentOrder: order, loading, error} = useSelector((state: RootState) => state.order);

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
            return;
        }

        dispatch(getUserAddress(userInfo?.data?.id));

    }, [userInfo, dispatch, navigate]);

    useEffect(() => {
        if (!orderId) {
            navigate('/order-history');
            return;
        }

        dispatch(fetchOrderById(orderId));
    }, [dispatch, navigate, orderId]);

    useEffect(() => {
        if (order && userInfo) {
            const isAdmin = userInfo?.data?.is_admin == 1;
            if (order?.data?.user_id == userInfo.data?.id && isAdmin) {
                setPerms(true);
            } else {
                setPerms(false);
            }
        }
    }, [order, userInfo]);

    useEffect(() => {
        if (order?.data?.products) {
            setProducts(order.data.products);
        }
    }, [order]);

    const {loading: loadingPay, success: successPay} = useSelector((state: RootState) => state.order);

    // const orderDeliver = useSelector((state) => state.orderDeliver);
    // const {loading: loadingDeliver, success: successDeliver} = orderDeliver;


    // useEffect(() => {
    //     if (!userInfo || userInfo == null) {
    //         history.push("/login");
    //     }
    //
    //     if (userInfo) {
    //         dispatch(getUser(userInfo.data.user_id));
    //     }
    //
    //     if (isOrderEmpty || successDeliver || successPay) {
    //         dispatch({type: ORDER_DELIVER_RESET});
    //         dispatch({type: ORDER_PAY_RESET});
    //         dispatch(getOrder(orderId));
    //         setIsOrderEmpty(false);
    //     }
    //
    //     if (order && order.data && user && user.data) {
    //         if (
    //             order.data.user_id == user.data.id ||
    //             userInfo.data.is_admin > 0
    //         ) {
    //             setPerms(true);
    //         }
    //     }
    // }, [dispatch, userInfo, order, isOrderEmpty, successDeliver, successPay]);

    const deliverHandler = () => {
        // dispatch(deliverOrder(order.data.order_id));
        // history.push(`/order-history/${orderId}`);
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
                        <Link
                            color="inherit"
                            to="/order-history"
                            className="bc"
                        >
                            Order History
                        </Link>
                        <Typography className="bc-p">
                            Order Details
                        </Typography>
                    </Breadcrumbs>
                </Paper>

                <Paper className="order__container">
                    {loading ? (
                        <div className="loaderCenter">
                            <Loader/>
                        </div>
                    ) : error ? (
                        <Message variant="error">{error}</Message>

                    ) : !perms ? (
                        <>
                            <div className="loaderCenter">
                                <Typography variant="h6">You do not have permission to view this order.</Typography>
                            </div>
                        </>
                    ) : order ? (
                        <div className="order">
                            <div className="order__container--po-left">
                                <div className="order__container--po-left-detail">
                                    <h2 className="order__container--po-left-detail--title">
                                        Sending to
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {order.user?.name}
                                    </div>

                                    <h2 className="order__container--po-left-detail--title">
                                        Address
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {currentUser?.data?.address?.[0]?.country}, {currentUser?.data?.address?.[0]?.city}, {currentUser?.data?.address?.[0]?.address}, {currentUser?.data?.address?.[0]?.postal_code}
                                    </div>

                                    <h2 className="order__container--po-left-detail--title">
                                        Phone Number
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {currentUser?.data?.address?.[0]?.phone_number}
                                    </div>

                                    <h2 className="order__container--po-left-detail--title">
                                        Deliver Status
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {order.is_delivered ? (
                                            <Message variant="success">
                                                Delivered on {order.delivered_at}
                                            </Message>
                                        ) : (
                                            <Message variant="warning">
                                                Not Delivered
                                            </Message>
                                        )}
                                    </div>

                                    <h2 className="order__container--po-left-detail--title">
                                        Pay Status
                                    </h2>
                                    <div className="order__container--po-left-detail--par">
                                        {order.is_paid ? (
                                            <Message variant="success">
                                                Paid on {order.paid_at}
                                            </Message>
                                        ) : (
                                            <Message variant="warning">
                                                Not Paid
                                            </Message>
                                        )}
                                    </div>
                                </div>

                                <div className="cart">
                                    <TableContainer component={Paper}>
                                        <Table aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Product Name</TableCell>
                                                    <TableCell>Product Code</TableCell>
                                                    <TableCell>Discount</TableCell>
                                                    <TableCell>Price</TableCell>
                                                    <TableCell>Quantity</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {products.map((product: Product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>
                                                            <StyledLink
                                                                to={`/product/${product.slug}`}
                                                                target="_blank">
                                                                {product.name}
                                                            </StyledLink>
                                                        </TableCell>
                                                        <TableCell>{product.product_code}</TableCell>
                                                        <TableCell>{product.discount ? `${product.discount} %` : "0 %"}</TableCell>
                                                        <TableCell>
                                                            <span>
                                                                €{product.price && product.discount != null
                                                                ? (product.price - (product.price * product.discount) / 100).toFixed(2)
                                                                : (product.price ? product.price.toFixed(2) : 'N/A')}                                                            </span>
                                                            {"   "}
                                                            <s>
                                                                €{product.price}
                                                            </s>
                                                        </TableCell>
                                                        <TableCell>{product.quantity}</TableCell>
                                                    </TableRow>
                                                )) ?? (  // Use ?? to render something when products is null/undefined
                                                    <TableRow>
                                                        <TableCell colSpan={5}>Loading products...</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>

                            <div className="order__container--po-right">
                                <Paper className="show__paper--alternate">
                                    <StyledDivider>Order Summary</StyledDivider>

                                    <div className="show__paper--div">
                                        <h4 className="divider">
                                            Subtotal:
                                        </h4>
                                        <p className="show__paper--p">
                                            € {order.data.products_discount_price}
                                        </p>
                                    </div>

                                    <div className="show__paper--div">
                                        <h4 className="divider">
                                            Tax Price:
                                        </h4>
                                        <p className="show__paper--p">
                                            + € {order.data.tax_price}
                                        </p>
                                    </div>

                                    <div className="show__paper--div">
                                        <h4 className="divider">
                                            Shipping Price:
                                        </h4>
                                        <p className="show__paper--p">
                                            + € {order.data.shipping_price}
                                        </p>
                                    </div>

                                    <div className="show__paper--div">
                                        <h4 className="divider">
                                            Total to Pay:
                                        </h4>
                                        <p className="show__paper--p">
                                            = € {order.data.total_price}
                                        </p>
                                    </div>


                                    <div className="show__paper--div">
                                        <h4 className="divider">Status</h4>
                                        <Message
                                            variant={order.data.status === "PENDING" ? "warning" : "success"}
                                        >
                                            {order.data.status}
                                        </Message>
                                    </div>

                                    {error && (
                                        <Message variant="error">
                                            {error}
                                        </Message>
                                    )}

                                    <div className="show__paper--div">
                                        {/* {loadingDeliver && <Loader/>} */}
                                        {userInfo &&
                                            userInfo?.data?.role &&
                                            userInfo.data.role[0] ===
                                            "Admin" &&
                                            //order.is_paid == 0 &&
                                            order.is_delivered == 0 && (
                                                <StyledButton
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={deliverHandler}
                                                    // className={classes.button}
                                                >
                                                    Mark as Delivered
                                                </StyledButton>
                                            )}
                                    </div>

                                    {/*<div className="show__paper--div">*/}
                                    {/*    {order.data.is_paid == 0 && (*/}
                                    {/*        <div>*/}
                                    {/*            {loadingPay && <Loader/>}*/}
                                    {/*            <Elements*/}
                                    {/*                stripe={stripePromise}*/}
                                    {/*            >*/}
                                    {/*                <CheckoutFormScreen*/}
                                    {/*                    orderId={order.data.order_id}*/}
                                    {/*                    addressId={order.data.order_id}*/}
                                    {/*                    totalPrice={order.data.total_price}*/}
                                    {/*                />*/}
                                    {/*            </Elements>*/}
                                    {/*        </div>*/}
                                    {/*    )}*/}
                                    {/*</div>*/}
                                </Paper>
                            </div>
                        </div>
                    ) : (
                        <Message variant="info">Order not found.</Message>
                    )}
                </Paper>
            </section>

            <StyledDivider3/>
            <Footer/>
        </>
    );
};

export default ShowOrderScreen;
