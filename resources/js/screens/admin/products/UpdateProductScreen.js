import React, { useEffect, useState, createRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Divider,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import {
    PRODUCT_SHOW_RESET,
    PRODUCT_UPDATE_RESET,
} from "../../../constants/productConstants";
import {
    getProductsList,
    editProduct,
    getProduct,
} from "./../../../actions/productActions";
import NumberFormat from "react-number-format";
import Loader from "./../../../components/alert/Loader";
import Message from "./../../../components/alert/Message";
import { getChildCatsList } from "./../../../actions/childCategoryActions";

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const UpdateProductScreen = ({
    setOpenEditDialog,
    setRequestData,
    productId,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [childCategoryId, setChildCategoryId] = useState("");
    const [name, setName] = useState("");
    const [productCode, setProductCode] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [description, setDescription] = useState("");
    const [isSpecialOffer, setIsSpecialOffer] = useState(0);

    const [successModal, setSuccessModal] = useState(false);
    const [isChildCatEmpty, setIsChildCatEmpty] = useState(true);

    const productShow = useSelector((state) => state.productShow);
    const { loading, error, product } = productShow;
    const { data } = product;

    const productUpdate = useSelector((state) => state.productUpdate);
    const { success } = productUpdate;

    const childCatList = useSelector((state) => state.childCatList);
    const { childCats } = childCatList;

    useEffect(() => {
        if (success) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            dispatch({ type: PRODUCT_SHOW_RESET });
        } else {
            if (isChildCatEmpty) {
                dispatch(getProduct(productId));
                dispatch(getChildCatsList());
                setIsChildCatEmpty(false);
            } else {
                if (data) {
                    setName(data.name);
                    setProductCode(data.product_code);
                    setDescription(data.description);
                    setPrice(data.price);
                    setDiscount(data.discount);
                    setIsSpecialOffer(data.special_offer);
                    setChildCategoryId(data.child_category.id);
                }
            }
        }

        successModal && dispatch(getProductsList());
    }, [dispatch, isChildCatEmpty, product, success, successModal]);

    const handleSpecialOfferCheckbox = (e) => {
        let isSpecialOffer;
        e.target.checked ? (isSpecialOffer = 1) : (isSpecialOffer = 0);
        setIsSpecialOffer(isSpecialOffer);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(
            editProduct(
                productId,
                childCategoryId,
                name,
                productCode,
                price,
                discount,
                description,
                isSpecialOffer
            )
        );

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenEditDialog(false);

        const Toast = Swal.mixin({
            toast: true,
            position: "center",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });

        Toast.fire({
            icon: "success",
            title: "Product Update with Success",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">
                Update Product
            </DialogTitle>
            <Divider />
            <DialogContent>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="error">{error}</Message>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className="form">
                            <div className="form__field">
                                <FormControl fullWidth>
                                    <InputLabel id="childCat-simple-select-label">
                                        Select Child Category
                                    </InputLabel>
                                    <Select
                                        labelId="childCat-simple-select-label"
                                        id="childCat-simple-select"
                                        value={childCategoryId}
                                        onChange={(e) =>
                                            setChildCategoryId(e.target.value)
                                        }
                                        defaultValue={""}
                                    >
                                        {childCats.data &&
                                            childCats.data.map((child) => (
                                                <MenuItem
                                                    key={child.id}
                                                    value={child.id}
                                                >
                                                    {child.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </div>

                            <div className="form__field">
                                <TextField
                                    variant="outlined"
                                    name="name"
                                    label="Title"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form__field">
                                <TextField
                                    variant="outlined"
                                    name="productCode"
                                    label="Product Code"
                                    fullWidth
                                    value={productCode}
                                    onChange={(e) =>
                                        setProductCode(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form__field">
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                        Is this product a special offer?
                                    </FormLabel>
                                    <FormGroup
                                        row
                                        onChange={handleSpecialOfferCheckbox}
                                    >
                                        <div className="form__field--checkboxes">
                                            <FormControlLabel
                                                value={isSpecialOffer}
                                                control={
                                                    <Checkbox
                                                        style={{
                                                            color: "#388667",
                                                        }}
                                                        checked={
                                                            isSpecialOffer == 1
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                }
                                                label="Special Offer?"
                                                name="isSpecialOffer"
                                            />
                                        </div>
                                    </FormGroup>
                                </FormControl>
                            </div>

                            <div className="form__field">
                                <TextField
                                    variant="outlined"
                                    name="discount"
                                    label="Discount %"
                                    fullWidth
                                    value={discount}
                                    type="number"
                                    onChange={(e) =>
                                        setDiscount(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form__field">
                                <NumberFormat
                                    variant="outlined"
                                    name="price"
                                    label="Price €"
                                    fullWidth
                                    customInput={TextField}
                                    decimalScale={2}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    renderText={(formattedValue) => (
                                        <Text>{formattedValue}</Text>
                                    )}
                                />
                            </div>

                            <div className="form__field">
                                <TextField
                                    variant="outlined"
                                    name="description"
                                    label="Product Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            value="submit"
                            type="submit"
                            fullWidth
                            className={classes.button}
                        >
                            Update Product
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default UpdateProductScreen;
