import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, Button, TextField } from "@material-ui/core";
import Navbar from "./../../../components/Navbar";
import Message from "./../../../components/alert/Message";
import Loader from "./../../../components/alert/Loader";
import Swal from "sweetalert2";
import { updateCredentials } from "./../../../actions/userActions";
import Footer from "../../../components/Footer";

const useStyles = makeStyles((theme) => ({
    divider: {
        marginBottom: "20px",
        borderBottom: "1px solid #855C1B",
        paddingBottom: "10px",
        width: "30%",

        [theme.breakpoints.down("sm")]: {
            width: "90%",
            margin: "0 auto 20px auto",
        },
    },

    input: {
        color: "#855C1B",

        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#855C1B",
        },

        "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            borderColor: "#388667",
        },

        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
                borderColor: "#388667",
            },

        "& .MuiInputLabel-outlined": {
            color: "#855C1B",
            fontWeight: "600",
            fontFamily: "Quicksand",
        },

        "&:hover .MuiInputLabel-outlined": {
            color: "#388667",
        },

        "& .MuiInputLabel-outlined.Mui-focused": {
            color: "#388667",
        },
    },

    checkbox: {
        color: "#855C1B",
    },

    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },

    label: {
        fontFamily: "Quicksand",
        color: "#855C1B",
        marginLeft: 0,
    },
}));

const SettingsScreen = ({ history }) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userUpdateCredentials = useSelector(
        (state) => state.userUpdateCredentials
    );
    const { loading, error } = userUpdateCredentials;

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.data.name);
            setEmail(userInfo.data.email);
        }
    }, [history, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password != "" && passwordConfirmation != "") {
            if (password != passwordConfirmation) {
                setMessage("Passwords do not match");
            } else if (password.length < 6) {
                setMessage("Password can't be less than 6 characters");
            } else {
                setMessage(null);
            }
        }

        dispatch(updateCredentials(userInfo.data.id, name, email, password));

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
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
            title: "You changed your settings with success",
        });

        setPassword("");
        setPasswordConfirmation("");
    };

    return (
        <>
            <Navbar />

            <section className="content auth">
                <div className="auth-title">
                    <h2 className={classes.divider}>Settings</h2>
                    <h5>Your current role is: {userInfo.data.role}</h5>
                </div>

                <div className="auth-form">
                    {message && <Message variant="error">{message}</Message>}
                    {error &&
                        Object.keys(error).map((err, key) => (
                            <Message key={key} variant="error">
                                {error[err][0]}
                            </Message>
                        ))}
                    {loading && <Loader />}
                    <form onSubmit={submitHandler}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Username"
                            id="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            className={classes.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Change Your Email Address"
                            id="email"
                            name="email"
                            autoComplete="email"
                            type="email"
                            className={classes.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Password"
                            id="password"
                            name="password"
                            autoComplete="password"
                            type="password"
                            className={classes.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Confirm Password"
                            id="confirm_password"
                            name="confirm_password"
                            autoComplete="confirm-password"
                            type="password"
                            className={classes.input}
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                        >
                            Change Settings
                        </Button>
                    </form>
                </div>
            </section>

            <hr className="divider2" />
            <Footer />
        </>
    );
};

export default SettingsScreen;
