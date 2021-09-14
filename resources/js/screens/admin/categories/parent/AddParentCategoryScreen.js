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
import { PARENT_CATEGORY_LIST_RESET } from "../../../../constants/parentCategoryConstants";
import { getParentCatsList, createParentCat } from './../../../../actions/parentCategoryActions';
import Loader from './../../../../components/alert/Loader';
import Message from './../../../../components/alert/Message';

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const AddParentCategoryScreen = ({ setOpenAddDialog, setRequestData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [successModal, setSuccessModal] = useState(false);

    const parentCatStore = useSelector((state) => state.parentCatStore);
    const { loading, success, error } = parentCatStore;

    useEffect(() => {
        if (successModal) {
            dispatch({ type: PARENT_CATEGORY_LIST_RESET });
            dispatch(getParentCatsList());
        }
    }, [dispatch, success, successModal]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(createParentCat(name));

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenAddDialog(false);

        Swal.fire({
            position: "center",
            icon: "success",
            title: `Parent Category created successfully`,
            showConfirmButton: false,
            timer: 2500,
            width: "65rem",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Add Parent Category</DialogTitle>
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
                            Add Parent Category
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default AddParentCategoryScreen;
