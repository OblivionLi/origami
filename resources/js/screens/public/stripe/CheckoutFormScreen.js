import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { getUser } from "./../../../actions/userActions";
import axios from "axios";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { payOrder } from "../../../actions/orderActions";

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
        minWidth: 345,
    },

    card: {
        marginBottom: "15px",
    },

    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",
        color: "white",
        width: '100%',

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
});

const CheckoutFormScreen = ({ history, orderId, totalPrice }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setProcessingTo] = useState(false);

    const [countryInitials, setCountryInitials] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const userShow = useSelector((state) => state.userShow);
    const { user } = userShow;

    useEffect(() => {
        if (userInfo) {
            dispatch(getUser(userInfo.data.user_id));

            if (user) {
                setCountryInitials(
                    user.data.address[0].country.toUpperCase().substr(0, 2)
                );
                setCity(user.data.address[0].city);
                setAddress(user.data.address[0].address);
                setEmail(userInfo.data.email);
                setName(
                    `${user.data.address[0].name} ${user.data.address[0].surname}`
                );
                setPhone(user.data.address[0].phone_number);
            }
        }
    }, [userInfo, isProcessing]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setProcessingTo(true);

        // create payment intent
        const { data: intent } = await axios.post("/api/payment_intents", {
            amount: totalPrice,
        });

        // create payment
        const { error: backendError, paymentMethod } =
            await stripe.createPaymentMethod({
                type: "card",
                card: elements.getElement(CardElement),
                billing_details: {
                    address: {
                        city: city,
                        country: countryInitials,
                        line1: address,
                    },
                    email: email,
                    name: name,
                    phone: phone,
                },
            });

        if (!stripe || !elements) {
            return;
        }

        // confirm the card payments
        if (!backendError) {
            // const test =
            const { error: stripeError, paymentIntent } =
                await stripe.confirmCardPayment(intent, {
                    payment_method: paymentMethod.id,
                });

            if (stripeError) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${stripeError.message}`,
                });
                setProcessingTo(false);
                history.push(`/order/${orderId}`);
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                dispatch(payOrder(orderId));
            }

            if (successPay) {
                setProcessingTo(true);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Success! You payed  €${totalPrice} for this order.`,
                    showConfirmButton: false,
                    timer: 2500,
                    width: "65rem",
                });
                history.push(`/order/${orderId}`);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Something went wrong! Backend Error: ${backendError.message}`,
            });
            setProcessingTo(false);
            history.push(`/order/${orderId}`);
        }
    };

    return (
        <>
            {successPay ? (
                <div>
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={true}
                    >
                        Order Payed Successfully
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label
                        htmlFor="card-element"
                        className="divider checkout-label"
                    >
                        Card
                    </label>
                    <CardElement id="card-element" className={classes.card} />
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processing..." : `Pay €${totalPrice}`}
                    </Button>
                </form>
            )}
        </>
    );
};

export default CheckoutFormScreen;
