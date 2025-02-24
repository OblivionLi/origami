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
import {Order, listUserOrders} from '@/features/order/orderSlice';
import {AppDispatch, RootState} from "@/store";
import {NotPaidSpan, IsPaidSpan, DeliveredSpan, FailedSpan, StyledDivider3} from "@/styles/muiStyles";
import {format} from "date-fns";
import {toUpper} from "lodash";

interface OrderHistoryProps {
}

const OrderHistoryScreen: React.FC<OrderHistoryProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const userLogin = useSelector((state: RootState) => state.user.userInfo);
    const {loading, error, userOrders} = useSelector((state: RootState) => state.order);

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
                            {error && (
                                <>
                                    <Message variant="error">{error}</Message>
                                </>
                            )}
                            <TableContainer component={Paper}>
                                <Table aria-label="order history table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Order (ID) Details</TableCell>
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
                                        {userOrders.map((orderItem: Order) => (
                                            <TableRow key={orderItem.id}>
                                                <TableCell>
                                                    <Link
                                                        to={`/order-history/${orderItem.order_id}`}>
                                                        {orderItem.order_id}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {orderItem.status === "pending" ? (
                                                        <NotPaidSpan>{toUpper(orderItem.status)}</NotPaidSpan>
                                                    ) : orderItem.status === "paid" ? (
                                                        <IsPaidSpan>{toUpper(orderItem.status)}</IsPaidSpan>
                                                    ) : orderItem.status === "cancelled" ? (
                                                        <FailedSpan>{toUpper(orderItem.status)}</FailedSpan>
                                                    ) : orderItem.status === "delivered" ? (
                                                        <DeliveredSpan>{toUpper(orderItem.status)}</DeliveredSpan>
                                                    ) : (
                                                        <FailedSpan>ORDER FAILED</FailedSpan>
                                                    )}
                                                </TableCell>
                                                <TableCell>€ {orderItem.total_price}</TableCell>
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
                                                    {format(new Date(orderItem.created_at), 'dd/MM/yyyy HH:mm')}
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

            <StyledDivider3/>
            <Footer/>
        </>
    );
};

export default OrderHistoryScreen;
