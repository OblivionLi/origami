import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/public/users/LoginScreen';
import RegisterScreen from './screens/public/users/RegisterScreen';
import ResetPasswordScreen from './screens/public/users/ResetPasswordScreen';
import ForgotPasswordScreen from './screens/public/users/ForgotPasswordScreen';
import SettingsScreen from './screens/public/users/SettingsScreen';
import AdminScreen from './screens/admin/AdminScreen';
import ShowProductScreen from './screens/public/products/ShowProductScreen';
import ReviewsScreen from './screens/public/reviews/ReviewsScreen';
import CartScreen from './screens/public/cart/CartScreen';

function Index() {
    return (
        <Router>
            <Switch>
                {/* Users */}
                <Route path="/" component={HomeScreen} exact />
                <Route path="/login" component={LoginScreen} />
                <Route path="/register" component={RegisterScreen} />
                <Route path="/reset-password/:id" component={ResetPasswordScreen} />
                <Route path="/forgot-password" component={ForgotPasswordScreen} />
                <Route path="/settings" component={SettingsScreen} />

                {/* Product */}
                <Route path="/product/:slug" component={ShowProductScreen} />

                {/* Reviews */}
                <Route path="/reviews/product/:id" component={ReviewsScreen} exact />
                <Route path="/reviews/product/:id/:page?" component={ReviewsScreen} />

                {/* Cart */}
                <Route path="/cart/:id?" component={CartScreen} />

                {/* Admin Section */}
                <Route path="/admin" component={AdminScreen} />
            </Switch>
        </Router>
    );
}

export default Index;

if (document.getElementById("app")) {
    ReactDOM.render(
        <Provider store={store}>
            <Index />
        </Provider>,
        document.getElementById("app")
    );
}
