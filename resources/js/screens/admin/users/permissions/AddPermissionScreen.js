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
import Loader from './../../../../components/alert/Loader';
import Message from './../../../../components/alert/Message';
import { PERMISSION_LIST_RESET } from "../../../../constants/permissionConstants";
import { getPermissionsList, createPermission } from './../../../../actions/permissionActions';

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const AddPermissionScreen = ({ setOpenAddDialog, setRequestData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [successModal, setSuccessModal] = useState(false);

    const permissionStore = useSelector((state) => state.permissionStore);
    const { loading, success, error } = permissionStore;

    useEffect(() => {
        if (successModal) {
            dispatch({ type: PERMISSION_LIST_RESET });
            dispatch(getPermissionsList());
        }
    }, [dispatch, success, successModal]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(createPermission(name));

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenAddDialog(false);

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
            title: "Permission Create with Success",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Add Permission</DialogTitle>
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
                            Add Permission
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default AddPermissionScreen;