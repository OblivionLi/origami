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
import { getRolesList, createRole } from "../../../../actions/roleActions";
import { makeStyles } from "@material-ui/core/styles";
import { ROLE_LIST_RESET } from "../../../../constants/roleConstants";
import Loader from '../../../../components/alert/Loader.js';
import Message from '../../../../components/alert/Message.js';

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const AddRoleScreen = ({ setOpenAddDialog, setRequestData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [successModal, setSuccessModal] = useState(false);

    const roleStore = useSelector((state) => state.roleStore);
    const { loading, success, error } = roleStore;

    useEffect(() => {
        if (successModal) {
            dispatch({ type: ROLE_LIST_RESET });
            dispatch(getRolesList());
        }
    }, [dispatch, success, successModal]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(createRole(name));

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenAddDialog(false);

        Swal.fire({
            position: "center",
            icon: "success",
            title: `Role created successfully`,
            showConfirmButton: false,
            timer: 2500,
            width: "65rem",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Add Role</DialogTitle>
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
                            Add Role
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default AddRoleScreen;
