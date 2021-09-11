import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Button,
    Divider,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import {
    createProductImage,
    getProduct,
} from "./../../../actions/productActions";
import Loader from "./../../../components/alert/Loader";
import Message from "./../../../components/alert/Message";
import { PRODUCT_IMAGE_CREATE_RESET } from "./../../../constants/productConstants";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const AddProductImageScreen = ({
    setOpenAddProductImageDialog,
    setRequestData,
    productId,
    productIdImage
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [image, setImage] = useState();
    const [successModal, setSuccessModal] = useState(false);
    const [isProductEmpty, setIsProductEmpty] = useState(true);

    const productShow = useSelector((state) => state.productShow);
    const { product } = productShow;
    const { data } = product;

    const productImageCreate = useSelector((state) => state.productImageCreate);
    const { loading, success, error } = productImageCreate;

    useEffect(() => {
        if (successModal && success) {
            dispatch({ type: PRODUCT_IMAGE_CREATE_RESET });
        }

        if (isProductEmpty) {
            dispatch(getProduct(productId));
            setIsProductEmpty(false);
        }
    }, [dispatch, isProductEmpty, success, successModal]);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productId", productId);

        if (image) {
            formData.append("image", image);
        }

        if (data.images.length < 5) {
            dispatch(createProductImage(productIdImage, formData));

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
                title: "Product Create with Success",
            });
        } else {
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
                icon: "error",
                title: "Sorry there are already 5 product images, please replace or delete one to add another :)",
            });
        }

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenAddProductImageDialog(false);
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">
                Add Product Image
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
                                <input
                                    id="contained-button-file"
                                    type="file"
                                    className="form__field--upl"
                                    onChange={(e) =>
                                        setImage(e.target.files[0])
                                    }
                                />

                                <label htmlFor="contained-button-file">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="span"
                                        startIcon={<PhotoCamera />}
                                    >
                                        Upload new Product Image (max filezise:
                                        5mb)
                                    </Button>
                                </label>

                                <p>{image ? image.name : <ClearIcon />}</p>
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
                            Add Product Image
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default AddProductImageScreen;
