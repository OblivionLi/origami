import React, {useEffect, useState} from "react";
import {AppDispatch, RootState} from "@/store";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";
import {useDispatch, useSelector} from "react-redux";
import {payOrder} from "@/features/order/orderSlice";
import {getUser} from "@/features/user/userSlice";
import {useNavigate} from "react-router-dom";
import {StyledButton, StyledCardElement} from "@/styles/muiStyles";
import Loader from '@/components/alert/Loader';
import Message from '@/components/alert/Message'

interface CheckoutFormScreenProps {
    orderId: string | number;
    totalPrice: number;
}

const CheckoutFormScreen: React.FC<CheckoutFormScreenProps> = ({orderId, totalPrice}) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setProcessingTo] = useState(false);

    const userLogin = useSelector((state: RootState) => state.user.userInfo);
    const {loading: loadingPay, success: successPay, error: errorPay} = useSelector((state: RootState) => state.order);

    useEffect(() => {
        if (!userLogin) {
            navigate("/login", {replace: true});
        }

        if (userLogin && userLogin.data && userLogin.data.id) {
            dispatch(getUser(String(userLogin.data.id)));
        }
    }, [dispatch, navigate, userLogin]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessingTo(true);

        let userName = `${userLogin?.data?.name} ${userLogin?.data?.address?.surname}`;

        const countryInitials = userLogin?.data?.address?.country?.toUpperCase().substring(0, 2) ?? "";
        const city = userLogin?.data?.address?.city ?? "";
        const addressLine1 = userLogin?.data?.address ?? "";
        const email = userLogin?.data?.email ?? "";
        const name = userName ?? "";
        const phone = userLogin?.data?.address?.phone_number ?? "";

        try {
            const {data: intentData} = await axios.post(
                "/api/payment_intents",
                {
                    amount: totalPrice,
                },
                {
                    headers: {
                        Authorization: `Bearer ${userLogin?.data?.access_token}`,
                    },
                }
            );

            const intent = intentData.client_secret;

            // create payment method
            const {error: backendError, paymentMethod} =
                await stripe.createPaymentMethod({
                    type: "card",
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        address: {
                            city: city?.toString(),
                            country: countryInitials?.toString(),
                            line1: addressLine1?.toString(),
                        },
                        email: email?.toString(),
                        name: name?.toString(),
                        phone: phone?.toString(),
                    },
                });


            if (backendError) {
                // console.error("Error creating payment method:", backendError);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Something went wrong creating the payment method!`,
                });
                setProcessingTo(false);
                return;
            }

            // confirm the card payments
            const {error: stripeError, paymentIntent} =
                await stripe.confirmCardPayment(intent, {
                    payment_method: paymentMethod!.id,
                });

            if (stripeError) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `${stripeError.message}`,
                });
                setProcessingTo(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                await dispatch(payOrder({id: Number(orderId)}));

                setProcessingTo(false);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Success! You paid  €${totalPrice} for this order.`,
                    showConfirmButton: false,
                    timer: 2500,
                    width: "65rem",
                });
                navigate(`/order/${orderId}`);

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Something went wrong!`,
                });
                setProcessingTo(false);
            }
        } catch (error: any) {
            console.error("Error during payment process:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Something went wrong during the payment process! ${error.message}`,
            });
            setProcessingTo(false);
        }
    };

    return (
        <>
            {loadingPay && (<Loader/>)}
            {errorPay && (<Message variant="error">{errorPay}</Message>)}
            {successPay ? (
                <div>
                    <StyledButton
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={true}
                    >
                        Order Payed Successfully
                    </StyledButton>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label
                        htmlFor="card-element"
                        className="divider checkout-label"
                    >
                        Card
                    </label>
                    <StyledCardElement/>
                    <StyledButton
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Processing..." : `Pay €${totalPrice}`}
                    </StyledButton>
                </form>
            )}
        </>
    );
};

export default CheckoutFormScreen;
