import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, Button, Grid, TextField } from "@material-ui/core";
import Navbar from "./../../../components/Navbar";
import { Link } from "react-router-dom";
import Loader from "./../../../components/alert/Loader";
import Message from "./../../../components/alert/Message";
import { resetPassword, getTokenResetPassword } from "./../../../actions/userActions";
import Swal from "sweetalert2";
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

const ResetPasswordScreen = ({ history, match }) => {
    const classes = useStyles();

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();

    const userResetPassword = useSelector((state) => state.userResetPassword);
    const { loading, error } = userResetPassword;

    const userTokenResetPassword = useSelector((state) => state.userTokenResetPassword);
    const { userReset } = userTokenResetPassword;

    useEffect(() => {
        if (!userReset) {
            dispatch(getTokenResetPassword(match.params.id));
        } else {
            setEmail(userReset && userReset[0].email);
        }
    }, [userReset]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password != passwordConfirmation) {
            setMessage("Passwords do not match");
        } else {
            dispatch(resetPassword(email, password, passwordConfirmation));

            const Toast = Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 6000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });
    
            Toast.fire({
                icon: "success",
                title: "Password reset success, now you can sign in with your new password",
            });

            history.push("/login");
        }
    };

    return (
        <>
            <Navbar />

            <section className="content auth">
                <div className="auth-title">
                    <h2 className={classes.divider}>Reset Password</h2>
                </div>

                <div className="auth-form">
                    {message && <Message variant="error">{message}</Message>}
                    {error && <Message variant="error">{message}</Message>}
                    {loading && <Loader />}
                    <form onSubmit={submitHandler}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            id="password"
                            name="password"
                            autoComplete="password"
                            autoFocus
                            type="password"
                            className={classes.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm Password"
                            id="confirm_password"
                            name="confirm_password"
                            autoComplete="confirm-password"
                            autoFocus
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
                            Reset Password
                        </Button>

                        <Grid container className="auth-form--action">
                            <Grid item>
                                <Link
                                    to="/login"
                                    className="auth-form--action__link"
                                >
                                    {"Nevermind, I remembered my password.."}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </section>

            <hr className="divider2" />
            <Footer />
        </>
    );
};

export default ResetPasswordScreen;
