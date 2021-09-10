import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Divider,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import { getParentCat, getParentCatsList, editParentCat } from './../../../../actions/parentCategoryActions';
import Message from './../../../../components/alert/Message';
import Loader from './../../../../components/alert/Loader';

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const UpdateParentCategoryScreen = ({
    setOpenEditDialog,
    setRequestData,
    parentId,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    const [successModal, setSuccessModal] = useState(false);
    const [parentCatEmpty, setParentCatEmpty] = useState(true);

    const parentCatShow = useSelector((state) => state.parentCatShow);
    const { loading, error, parentCat } = parentCatShow;
    const { data } = parentCat;

    const parentCatUpdate = useSelector((state) => state.parentCatUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = parentCatUpdate;

    useEffect(() => {
        if (parentCatEmpty) {
            dispatch(getParentCat(parentId));
            setParentCatEmpty(false);
        } else {
            if (data) {
                setName(data.name);
                setSlug(data.slug);
            }
        }

        if (successModal) {
            dispatch(getParentCatsList());
        }
    }, [parentCatEmpty, data, successModal]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(editParentCat(slug, name));

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
            title: "Parent Category Update with Success",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update Parent Category</DialogTitle>
            <Divider />
            <DialogContent>
                {loadingUpdate && <Loader />}
                {errorUpdate && (
                    <Message variant="error">{errorUpdate}</Message>
                )}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="error">{error}</Message>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className="form">
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
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            value="submit"
                            type="submit"
                            fullWidth
                            className={classes.button}
                        >
                            Update Parent Category
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default UpdateParentCategoryScreen;
