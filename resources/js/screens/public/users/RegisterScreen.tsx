import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {RootState, AppDispatch} from "@/store";
import {
    Grid2,
} from "@mui/material";
import Swal from "sweetalert2";
import Message from "@/components/alert/Message";
import Loader from "@/components/alert/Loader";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar.js";
import {
    StyledDivider,
    StyledTextField,
    StyledCheckbox,
    StyledButton,
    StyledFormControlLabel,
    StyledDivider3,
} from "@/styles/muiStyles";
import {registerUser, resetUserState} from '@/features/user/userSlice';

interface RegisterScreenProps {
}

const RegisterScreen: React.FC<RegisterScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const {loading, error, registerSuccess} = useSelector((state: RootState) => state.user);
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const redirect = location.search ? location.search.split("=")[1] : "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect, {replace: true});
        }

        return () => {
            dispatch(resetUserState());
        }
    }, [navigate, userInfo, redirect, dispatch]);

    useEffect(() => {
        if (registerSuccess) {
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
    }, [registerSuccess]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            setMessage("Passwords do not match");
        } else if (password.length < 6) {
            setMessage("Password can't be less than 6 characters");
        } else {
            dispatch(
                registerUser({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                    remember_me: rememberMe,
                })
            );

            setMessage(null);
        }
    };

    return (
        <>
            <Navbar/>

            <section className="content auth">
                <div className="auth-title">
                    <StyledDivider>Register</StyledDivider>
                </div>

                <div className="auth-form">
                    {message && <Message variant="error">{message}</Message>}
                    {error && typeof error === "string" && <Message variant="error">{error}</Message>}
                    {loading && <Loader/>}
                    <form onSubmit={submitHandler}>
                        <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Username"
                            id="username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            id="email"
                            name="email"
                            autoComplete="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            id="password"
                            name="password"
                            autoComplete="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <StyledTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm Password"
                            id="confirm_password"
                            name="confirm_password"
                            autoComplete="confirm-password"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                        />

                        <StyledFormControlLabel
                            control={
                                <StyledCheckbox
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                />
                            }
                            label="Remember me"
                            labelPlacement="start"
                        />

                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                        >
                            Register
                        </StyledButton>

                        <Grid2 container className="auth-form--action">
                            <Link
                                to="/login"
                                className="auth-form--action__link"
                            >
                                {"Already having an account? Sign In"}
                            </Link>
                        </Grid2>
                    </form>
                </div>
            </section>

            <StyledDivider3/>
            <Footer/>
        </>
    );
};

export default RegisterScreen;
