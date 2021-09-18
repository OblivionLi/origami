import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, Button, Grid, TextField } from "@material-ui/core";
import Navbar from "./../../../components/Navbar";
import { Link } from "react-router-dom";
import { forgotPassword } from "./../../../actions/userActions";
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

const ForgotPasswordScreen = ({ history }) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        if (emailSent) {
            history.push("/login");
        }
    }, [emailSent]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(forgotPassword(email));
        setEmailSent(true);

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
            title: "Reset password link has been sent to your email",
        });
    };

    return (
        <>
            <Navbar />

            <section className="content auth">
                <div className="auth-title">
                    <h2 className={classes.divider}>Forgot Password</h2>
                </div>

                <div className="auth-form">
                    <form onSubmit={submitHandler}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            id="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            type="email"
                            className={classes.input}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                        >
                            Send Password Request
                        </Button>

                        <Grid container className="auth-form--action">
                            <Grid item xs>
                                <Link
                                    to="/login"
                                    className="auth-form--action__link"
                                >
                                    {"Nevermind, I remembered my password.."}
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link
                                    to="/register"
                                    className="auth-form--action__link"
                                >
                                    {"Don't have an account? Sign Up"}
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

export default ForgotPasswordScreen;
