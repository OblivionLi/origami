import Axios from "axios";
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "./../constants/cartConstants";

export const addToCart = (id, qty) => async (dispatch, getState) => {

    const {
        userLogin: { userInfo },
    } = getState();

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.access_token}`,
        },
    };

    const { data } = await Axios.get(`/api/products/${id}`, config);

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product:            data.data.id,
            name:               data.data.name,
            slug:               data.data.slug,
            product_code:       data.data.product_code,
            special_offer:      data.data.special_offer,
            discount:           data.data.discount,
            price:              data.data.price,
            description:        data.data.description,
            total_quantities:   data.data.total_quantities,
            qty
        }
    });

    localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().cart.cartItems)
    );
};

export const removeFromCart = id => async (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    });

    localStorage.setItem(
        "cartItems",
        JSON.stringify(getState().cart.cartItems)
    );
};