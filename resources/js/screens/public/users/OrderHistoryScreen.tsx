import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Breadcrumbs,
} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import Navbar from "@/components/Navbar.js";
import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import NavbarCategories from "@/components/NavbarCategories.js";
import Footer from '@/components/Footer.js';
import {listUserOrders} from '@/features/order/orderSlice';
import {AppDispatch, RootState} from "@/store";
import {StyledDivider, NotPaidSpan, IsPaidSpan, DeliveredSpan, FailedSpan} from "@/styles/muiStyles";
import {Order} from '@/features/order/orderSlice';
import {format} from "date-fns";

interface OrderHistoryProps {
}

const OrderHistoryScreen: React.FC<OrderHistoryProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const userLogin = useSelector((state: RootState) => state.user.userInfo);
    const orderUserList = useSelector((state: RootState) => state.order);
    const {loading, error, order} = orderUserList;

    useEffect(() => {
        if (!userLogin) {
            navigate('/login', {replace: true});
            return;
        }

        dispatch(listUserOrders());
    }, [dispatch, navigate, userLogin]);

    return (
        <>
            <Navbar/>
            <NavbarCategories/>

            <section className="ctn">
                {loading ? (
                    <div className="loaderCenter">
                        <Loader/>
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

                        <Paper className="show__container">
                            <TableContainer component={Paper}>
                                <Table aria-label="order history table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order Details</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Total to Pay</TableCell>
                                            <TableCell>Is Paid?</TableCell>
                                            <TableCell>Is Delivered?</TableCell>
                                            <TableCell>Paid At</TableCell>
                                            <TableCell>Delivered At</TableCell>
                                            <TableCell>Created At</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {order.map((orderItem: Order) => (
                                            <TableRow key={orderItem.id}>
                                                <TableCell>
                                                    <Link
                                                        to={`/order-history/${orderItem.order_id}/${userLogin?.data?.id}`}>
                                                        Order Details
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {orderItem.status === "PENDING" ? (
                                                        <NotPaidSpan>{orderItem.status}</NotPaidSpan>
                                                    ) : orderItem.status === "PAID" ? (
                                                        <IsPaidSpan>{orderItem.status}</IsPaidSpan>
                                                    ) : orderItem.status === "DELIVERED" ? (
                                                        <DeliveredSpan>{orderItem.status}</DeliveredSpan>
                                                    ) : (
                                                        <FailedSpan>ORDER FAILED</FailedSpan> // Keep text consistent
                                                    )}
                                                </TableCell>
                                                <TableCell>€ {orderItem.total_price && orderItem.total_price.toFixed(2)}</TableCell>
                                                <TableCell>{orderItem.is_paid ? <IsPaidSpan>Yes</IsPaidSpan> :
                                                    <NotPaidSpan>No</NotPaidSpan>}</TableCell>
                                                <TableCell>{orderItem.is_delivered ?
                                                    <DeliveredSpan>Yes</DeliveredSpan> :
                                                    <NotPaidSpan>No</NotPaidSpan>}</TableCell>
                                                <TableCell>
                                                    {orderItem.paid_at ? (
                                                        format(new Date(orderItem.paid_at), 'dd/MM/yyyy HH:mm')
                                                    ) : (
                                                        "--/--/---- --/--"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {orderItem.delivered_at ? (
                                                        format(new Date(orderItem.delivered_at), 'dd/MM/yyyy HH:mm')
                                                    ) : (
                                                        "--/--/---- --/--"
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    format(new Date(orderItem.created_at), 'dd/MM/yyyy HH:mm')
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </>
                )}
            </section>

            <StyledDivider/>
            <Footer/>
        </>
    );
};

export default OrderHistoryScreen;
