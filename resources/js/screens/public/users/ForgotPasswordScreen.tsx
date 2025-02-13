import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "@/store";
import {
    Grid2
} from "@mui/material";
import {
    StyledDivider,
    StyledTextField,
    StyledButton,
    Item,
} from "@/styles/muiStyles";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar.js";
import Footer from "@/components/Footer.js";
import {forgotPassword} from "@/features/user/userSlice";

interface ForgotPasswordScreenProps {
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const {loading, error, forgotPasswordSuccess} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (forgotPasswordSuccess) {
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
            navigate("/login", {replace: true});
        }
    }, [forgotPasswordSuccess, navigate]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(forgotPassword({email}));
    };

    return (
        <>
            <Navbar/>

            <section className="content auth">
                <div className="auth-title">
                    <StyledDivider>Forgot Password</StyledDivider>
                </div>

                <div className="auth-form">
                    <form onSubmit={submitHandler}>
                        <StyledTextField
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
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                        >
                            Send Password Request
                        </StyledButton>

                        <Grid2 container className="auth-form--action">
                            <Item>
                                <Link
                                    to="/login"
                                    className="auth-form--action__link"
                                >
                                    {"Nevermind, I remembered my password.."}
                                </Link>
                            </Item>
                            <Item>
                                <Link
                                    to="/register"
                                    className="auth-form--action__link"
                                >
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Item>
                        </Grid2>
                    </form>
                </div>
            </section>

            <hr className="divider2"/>
            <Footer/>
        </>
    );
};

export default ForgotPasswordScreen;
