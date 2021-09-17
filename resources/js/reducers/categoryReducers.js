import {
    ACCESSORIES_LIST_FAIL,
    ACCESSORIES_LIST_REQUEST,
    ACCESSORIES_LIST_RESET,
    ACCESSORIES_LIST_SUCCESS,
    ORIGAMI_LIST_FAIL,
    ORIGAMI_LIST_REQUEST,
    ORIGAMI_LIST_RESET,
    ORIGAMI_LIST_SUCCESS,
    SPECIAL_OFFER_LIST_FAIL,
    SPECIAL_OFFER_LIST_REQUEST,
    SPECIAL_OFFER_LIST_RESET,
    SPECIAL_OFFER_LIST_SUCCESS,
} from "../constants/categoryConstants";

export const accessoryListReducer = (state = { accessories: {} }, action) => {
    switch (action.type) {
        case ACCESSORIES_LIST_REQUEST:
            return { loading: true, accessories: [] };

        case ACCESSORIES_LIST_SUCCESS:
            return { loading: false, accessories: action.payload };

        case ACCESSORIES_LIST_FAIL:
            return { loading: false, error: action.payload };

        case ACCESSORIES_LIST_RESET:
            return {};

        default:
            return state;
    }
};

export const origamiListReducer = (state = { origamies: {} }, action) => {
    switch (action.type) {
        case ORIGAMI_LIST_REQUEST:
            return { loading: true, origamies: [] };

        case ORIGAMI_LIST_SUCCESS:
            return { loading: false, origamies: action.payload };

        case ORIGAMI_LIST_FAIL:
            return { loading: false, error: action.payload };

        case ORIGAMI_LIST_RESET:
            return {};

        default:
            return state;
    }
};

export const specialOfferListReducer = (state = { offers: {} }, action) => {
    switch (action.type) {
        case SPECIAL_OFFER_LIST_REQUEST:
            return { loading: true, offers: [] };

        case SPECIAL_OFFER_LIST_SUCCESS:
            return { loading: false, offers: action.payload };

        case SPECIAL_OFFER_LIST_FAIL:
            return { loading: false, error: action.payload };

        case SPECIAL_OFFER_LIST_RESET:
            return {};

        default:
            return state;
    }
};
