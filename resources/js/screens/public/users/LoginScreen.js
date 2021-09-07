import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    makeStyles,
    Button,
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
} from "@material-ui/core";
import Navbar from "./../../../components/Navbar";
import { Link } from "react-router-dom";
import Message from "./../../../components/alert/Message";
import Loader from "./../../../components/alert/Loader";
import { login } from "./../../../actions/userActions";
import Swal from "sweetalert2";

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

const LoginScreen = ({ location, history }) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const redirect = location.search ? location.search.split("=")[1] : "/";

    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error, userInfo } = userLogin;

    useEffect(() => {
        if (userInfo) {
            history.push(redirect);
        }
    }, [history, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(login(email, password, rememberMe));

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
            title: "Signed in successfully",
        });
    };

    return (
        <>
            <Navbar />

            <section className="content auth">
                <div className="auth-title">
                    <h2 className={classes.divider}>Login</h2>
                </div>

                <div className="auth-form">
                    {error && <Message variant="error">{error}</Message>}
                    {loading && <Loader />}
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

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            id="password"
                            name="password"
                            autoComplete="password"
                            type="password"
                            className={classes.input}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    className={classes.checkbox}
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                    style={{
                                        color: "#855C1B",
                                    }}
                                />
                            }
                            label="Remember me"
                            labelPlacement="start"
                            className={classes.label}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                        >
                            Login
                        </Button>

                        <Grid container className="auth-form--action">
                            <Grid item xs>
                                <Link
                                    to="/forgot-password"
                                    className="auth-form--action__link"
                                >
                                    Forgot password?
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
        </>
    );
};

export default LoginScreen;
