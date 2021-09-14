import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Divider,
    FormControl,
    DialogContent,
    DialogTitle,
    InputLabel,
    Select,
    MenuItem,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { getRolesList } from "./../../../actions/roleActions";
import { getUser, getUsersList, editUser } from "../../../actions/userActions";
import Loader from "../../../components/alert/Loader";
import Message from "../../../components/alert/Message";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const UpdateUserScreen = ({ setOpenEditDialog, setRequestData, userId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [successModal, setSuccessModal] = useState(false);
    const [userEmpty, setUserEmpty] = useState(true);

    const userShow = useSelector((state) => state.userShow);
    const { loading, error, user } = userShow;
    const { data } = user;

    const userUpdate = useSelector((state) => state.userUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = userUpdate;

    const roleList = useSelector((state) => state.roleList);
    const { roles } = roleList;

    useEffect(() => {
        if (userEmpty) {
            dispatch(getUser(userId));
            dispatch(getRolesList());
            setUserEmpty(false);
        } else {
            if (data) {
                setName(data.name);
                setEmail(data.email);
                setRole(data.roles[0].id);
            }
        }

        if (successModal) {
            dispatch(getUsersList());
        }
    }, [userEmpty, data, successModal]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(editUser(userId, name, email, role));

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

        
        Swal.fire({
            position: "center",
            icon: "success",
            title: `User updated successfully`,
            showConfirmButton: false,
            timer: 2500,
            width: "65rem",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update User</DialogTitle>
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

                            <div className="form__field">
                                <TextField
                                    variant="outlined"
                                    name="email"
                                    label="Email"
                                    fullWidth
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form__field">
                                <FormControl fullWidth>
                                    <InputLabel id="role-simple-select-label">
                                        Select Role (current role "
                                        {data ? data.roles[0].name : "none"}
                                        ")
                                    </InputLabel>
                                    <Select
                                        labelId="role-simple-select-label"
                                        id="role-simple-select"
                                        value={role}
                                        onChange={(e) =>
                                            setRole(e.target.value)
                                        }
                                    >
                                        {roles.data &&
                                            roles.data.map((role) => (
                                                <MenuItem
                                                    key={role.id}
                                                    value={role.id}
                                                >
                                                    {role.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
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
                            Update User
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default UpdateUserScreen;
