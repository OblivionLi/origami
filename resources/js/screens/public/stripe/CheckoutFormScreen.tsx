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
import Message from '@/components/alert/Message'
import {fetchOrderAddressById} from "@/features/address/addressSlice";

interface CheckoutFormScreenProps {
    orderId: string;
    addressId: number;
    totalPrice: number | undefined;
}

const CheckoutFormScreen: React.FC<CheckoutFormScreenProps> = ({orderId, addressId, totalPrice}) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setProcessingTo] = useState(false);

    const {currentAddress, loading: loadingAddress, success: successAddress, error: errorAddress} = useSelector((state: RootState) => state.address);
    const userLogin = useSelector((state: RootState) => state.user.userInfo);
    const {loading, successPay, errorPay} = useSelector((state: RootState) => state.order);

    useEffect(() => {
        if (!userLogin) {
            navigate("/login", {replace: true});
        }

        if (userLogin?.data?.id) {
            dispatch(getUser(userLogin.data.id));
        }
    }, [dispatch, navigate, userLogin]);

    useEffect(() => {
        if (!successAddress) {
            dispatch(fetchOrderAddressById({id: addressId}));
        }
    }, [successAddress, dispatch]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!currentAddress) {
            Swal.fire({
                icon: "error",
                title: "Address Error",
                text: "Shipping address information is missing",
            });
            return;
        }

        setProcessingTo(true);

        const name = `${currentAddress.name} ${currentAddress.surname}`;
        const countryInitials = currentAddress.country.toUpperCase().substring(0, 2);
        const email = userLogin?.data?.email || "";

        try {
            const {data: intentData} = await axios.post(
                "/api/payment_intents",
                {
                    amount: totalPrice,
                    addressId: addressId
                },
                {
                    headers: {
                        Authorization: `Bearer ${userLogin?.data?.access_token}`,
                    },
                }
            );

            const intent = intentData.clientSecret;

            // create payment method
            const {error: backendError, paymentMethod} =
                await stripe.createPaymentMethod({
                    type: "card",
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        address: {
                            city: currentAddress.city,
                            country: countryInitials,
                            line1: currentAddress.address,
                            postal_code: currentAddress.postal_code,
                        },
                        email: email,
                        name: name,
                        phone: currentAddress.phone_number,
                    },
                });


            if (backendError) {
                console.error("Error creating payment method:", backendError);
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
                await dispatch(payOrder({id: orderId}));

                setProcessingTo(false);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `Success! You paid  €${totalPrice} for this order.`,
                    showConfirmButton: false,
                    timer: 2500,
                    width: "65rem",
                });
                navigate(`/order-history/${orderId}`);

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
                    {currentAddress && (
                        <div className="address-summary mb-4">
                            <h4>Shipping to:</h4>
                            <p>{currentAddress.name} {currentAddress.surname}</p>
                            <p>{currentAddress.address}</p>
                            <p>{currentAddress.city}, {currentAddress.postal_code}</p>
                            <p>{currentAddress.country}</p>
                            <p>Phone: {currentAddress.phone_number}</p>
                        </div>
                    )}

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
                        disabled={isProcessing || !currentAddress}
                    >
                        {isProcessing ? "Processing..." : `Pay €${totalPrice}`}
                    </StyledButton>
                </form>
            )}
        </>
    );
};

export default CheckoutFormScreen;
