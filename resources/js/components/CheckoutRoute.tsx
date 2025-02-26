import React from 'react';
import {RootState} from "@/store";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";

interface CheckoutRouteProps {
    element: React.ReactNode;
    requiredSteps: ('cart' | 'shipping')[];
}

const CheckoutRoute: React.FC<CheckoutRouteProps> = ({element, requiredSteps}) => {
    const {cartCompleted, shippingCompleted} = useSelector((state: RootState) => state.checkout);
    const cartItems = useSelector((state: RootState) => state.cart.cartItems);

    if (!cartItems || cartItems.length === 0) {
        return <Navigate to={"/"} replace/>
    }

    if (requiredSteps.includes('cart') && !cartCompleted) {
        return <Navigate to="/cart" replace />;
    }

    if (requiredSteps.includes('shipping') && !shippingCompleted) {
        return <Navigate to="/shipping" replace />;
    }

    return <>{element}</>;
};

export default CheckoutRoute;
