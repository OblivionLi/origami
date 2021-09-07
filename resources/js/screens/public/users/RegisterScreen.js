import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./../../../components/Navbar";
import {
    makeStyles,
    Button,
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Message from "./../../../components/alert/Message";
import Loader from "./../../../components/alert/Loader";
import { register } from "./../../../actions/userActions";
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

const RegisterScreen = ({ location, history }) => {
    const classes = useStyles();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();

    const userRegister = useSelector((state) => state.userRegister);
    const { loading, error } = userRegister;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const redirect = location.search ? location.search.split("=")[1] : "/";

    useEffect(() => {
        if (userInfo) {
            history.push(redirect);
        }
    }, [history, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();

        if (password != passwordConfirmation) {
            setMessage("Passwords do not match");
        } else if (password.length < 6) {
            setMessage("Password can't be less than 6 characters");
        } else {
            dispatch(
                register(
                    name,
                    email,
                    password,
                    passwordConfirmation,
                    rememberMe
                )
            );

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
        }
    };

    return (
        <>
            <Navbar />

            <section className="content auth">
                <div className="auth-title">
                    <h2 className={classes.divider}>Register</h2>
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
                            required
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
                            required
                            fullWidth
                            label="Email Address"
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
                            required
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
                            required
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
                            Register
                        </Button>

                        <Grid container className="auth-form--action">
                            <Grid item>
                                <Link
                                    to="/login"
                                    className="auth-form--action__link"
                                >
                                    {"Already having an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </section>
        </>
    );
};

export default RegisterScreen;
