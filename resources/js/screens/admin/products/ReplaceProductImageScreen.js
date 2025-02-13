import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, DialogContent, DialogTitle } from "@material-ui/core";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import {
    getProductsList,
    replaceProductImage,
} from "./../../../actions/productActions";
import Loader from "../../../components/alert/Loader.js";
import Message from "../../../components/alert/Message.js";
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

const ReplaceProductImageScreen = ({
    setOpenReplaceDialog,
    setRequestData,
    productReplaceImageId,
    productReplaceProductId,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [image, setImage] = useState();
    const [successModal, setSuccessModal] = useState(false);

    const productImageReplace = useSelector(
        (state) => state.productImageReplace
    );
    const { loading, success, error } = productImageReplace;

    useEffect(() => {
        if (success) {
            dispatch({ type: PRODUCT_IMAGE_REPLACE_RESET });
        }

        if (successModal) {
            dispatch(getProductsList());
        }
    }, [
        dispatch,
        productReplaceImageId,
        productReplaceProductId,
        success,
        successModal,
    ]);

    console.log(productReplaceProductId)

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("product_id", productReplaceProductId);
        if (image) {
            formData.append("image", image);
        }

        dispatch(replaceProductImage(productReplaceImageId, formData));

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenReplaceDialog(false);

        Swal.fire({
            position: "center",
            icon: "success",
            title: `Image replaced successfully`,
            showConfirmButton: false,
            timer: 2500,
            width: "65rem",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">
                Replace Product Image
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
                                    type="hidden"
                                    name="_method"
                                    value="PUT"
                                />
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
                            Replace Product Image
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default ReplaceProductImageScreen;
