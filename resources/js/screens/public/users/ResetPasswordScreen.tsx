import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link, useParams, useNavigate} from "react-router-dom";
import {RootState, AppDispatch} from "@/store";
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
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import Footer from "@/components/Footer.js";
import {resetPassword, getTokenResetPassword} from "@/features/user/userSlice";

interface ResetPasswordScreenProps {
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const {loading, error, resetPasswordSuccess} = useSelector((state: RootState) => state.user);


    useEffect(() => {
        if (id) {
            dispatch(getTokenResetPassword(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (resetPasswordSuccess) {
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
            navigate("/login", {replace: true});
        }
    }, [resetPasswordSuccess, navigate]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (password != passwordConfirmation) {
            setMessage("Passwords do not match");
        } else if (password.length < 6) {
            setMessage("Password can't be less than 6 characters");
        } else if (!id) {
            setMessage("Invalid reset link.");
        } else {
            dispatch(
                resetPassword({
                    email: id,
                    password,
                    password_confirmation: passwordConfirmation,
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
                    <StyledDivider>Reset Password</StyledDivider>
                </div>

                <div className="auth-form">
                    {message && <Message variant="error">{message}</Message>}
                    {error && <Message variant="error">{message}</Message>}
                    {loading && <Loader/>}
                    <form onSubmit={submitHandler}>
                        <StyledTextField
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
                            autoFocus
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) =>
                                setPasswordConfirmation(e.target.value)
                            }
                        />

                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                        >
                            Reset Password
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
                        </Grid2>
                    </form>
                </div>
            </section>

            <hr className="divider2"/>
            <Footer/>
        </>
    );
};

export default ResetPasswordScreen;
