import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import HomeScreen from '@/screens/HomeScreen';
import LoginScreen from '@/screens/public/users/LoginScreen';
import RegisterScreen from '@/screens/public/users/RegisterScreen';
import ResetPasswordScreen from '@/screens/public/users/ResetPasswordScreen';
import ForgotPasswordScreen from '@/screens/public/users/ForgotPasswordScreen';
import SettingsScreen from "@/screens/public/users/SettingsScreen";
import OrderHistoryScreen from "@/screens/public/users/OrderHistoryScreen";
import CartScreen from "@/screens/public/shop/CartScreen";
import AccessoriesScreen from "@/screens/public/categories/AccessoriesScreen";
import ShowProductScreen from "@/screens/public/products/ShowProductScreen";
import ReviewsScreen from "@/screens/public/reviews/ReviewsScreen";
import ShippingScreen from "@/screens/public/shop/ShippingScreen";
import PlaceOrderScreen from "@/screens/public/shop/PlaceOrderScreen";
import ShowOrderScreen from "@/screens/public/shop/ShowOrderScreen";
import OrigamiScreen from "@/screens/public/categories/OrigamiScreen";
import SpecialOffersScreen from "@/screens/public/categories/SpecialOffersScreen";
import CheckoutRoute from "@/components/CheckoutRoute";
import AdminScreen from "@/screens/admin/AdminScreen";

function Index() {
    return (
        <Router>
            <Routes>
                {/* Users */}
                <Route path="/" element={<HomeScreen/>}/>
                <Route path="/login" element={<LoginScreen/>}/>
                <Route path="/register" element={<RegisterScreen/>}/>
                <Route path="/reset-password/:id" element={<ResetPasswordScreen/>}/>
                <Route path="/forgot-password" element={<ForgotPasswordScreen/>}/>
                <Route path="/settings" element={<SettingsScreen/>}/>

                {/* Product */}
                <Route path="/product/:slug" element={<ShowProductScreen/>}/>

                {/* Categories */}
                <Route path="/accessories/:page?" element={<AccessoriesScreen/>}/>
                <Route path="/accessories" element={<AccessoriesScreen/>}/>

                <Route path="/origami/:page?" element={<OrigamiScreen/>}/>
                <Route path="/origami" element={<OrigamiScreen/>}/>

                <Route path="/special-offers/:page?" element={<SpecialOffersScreen/>}/>
                <Route path="/special-offers" element={<SpecialOffersScreen/>}/>

                {/* Reviews */}
                <Route path="/reviews/product/:id/:page?" element={<ReviewsScreen/>}/>
                <Route path="/reviews/product/:id" element={<ReviewsScreen/>}/>

                {/* Cart */}
                <Route path="/cart" element={<CartScreen/>}/>
                <Route
                    path="/shipping"
                    element={
                        <CheckoutRoute
                            element={<ShippingScreen />}
                            requiredSteps={['cart']}
                        />
                    }
                />
                <Route
                    path="/placeorder/:addressId"
                    element={
                        <CheckoutRoute
                            element={<PlaceOrderScreen />}
                            requiredSteps={['cart', 'shipping']}
                        />
                    }
                />

                {/* Order */}
                <Route path="/order-history/:orderId" element={<ShowOrderScreen/>}/>
                <Route path="/order-history" element={<OrderHistoryScreen/>}/>

                {/* Admin Section */}
                <Route path="/admin/*" element={<AdminScreen/>} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default Index;
