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
import Loader from "../../../../components/alert/Loader.js";
import Message from "../../../../components/alert/Message.js";
import { getPermission, editPermission, getPermissionsList } from "./../../../../actions/permissionActions";

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const UpdatePermissionScreen = ({
    setOpenEditDialog,
    setRequestData,
    permId,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [name, setName] = useState("");

    const [successModal, setSuccessModal] = useState(false);
    const [permEmpty, setPermEmpty] = useState(true);

    const permissionShow = useSelector((state) => state.permissionShow);
    const { loading, error, permission } = permissionShow;
    const { data } = permission;

    const permissionUpdate = useSelector((state) => state.permissionUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = permissionUpdate;

    useEffect(() => {
        if (permEmpty) {
            dispatch(getPermission(permId));
            setPermEmpty(false);
        } else {
            data && setName(data.name);
        }

        if (successModal) {
            dispatch(getPermissionsList());
        }
    }, [permEmpty, data, successModal]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(editPermission(permId, name));

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenEditDialog(false);

        Swal.fire({
            position: "center",
            icon: "success",
            title: `Permission updated successfully`,
            showConfirmButton: false,
            timer: 2500,
            width: "65rem",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update Permission</DialogTitle>
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
                            Update Permission
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default UpdatePermissionScreen;
