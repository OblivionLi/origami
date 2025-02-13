import React, {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {AppDispatch, RootState} from "@/store";
import Swal from "sweetalert2";
import Navbar from "@/components/Navbar.js";
import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import Footer from "@/components/Footer.js";
import {clearUserSuccess, updateCredentials} from "@/features/user/userSlice";
import {
    StyledDivider,
    StyledTextField,
    StyledButton,
} from "@/styles/muiStyles";
import {Typography} from "@mui/material";

interface SettingsScreenProps {
}

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState<string | null>(null);

    const {loading, error, userInfo, updateCredentialsSuccess} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (updateCredentialsSuccess) {
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
            dispatch(clearUserSuccess());
        }
    }, [updateCredentialsSuccess]);

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        setMessage(null);

        if (password && passwordConfirmation) {
            if (password !== passwordConfirmation) {
                setMessage("Passwords do not match");
                return;
            } else if (password.length < 6) {
                setMessage("Password can't be less than 6 characters");
                return;
            }
        }

        if (!userInfo) {
            setMessage("User information not found. Please log in again.");
            return;
        }

        dispatch(
            updateCredentials({
                id: userInfo.id.toString(),
                name,
                email,
                password,
            })
        );
    };

    return (
        <>
            <Navbar/>

            <section className="content auth">
                <div className="auth-title">
                    <StyledDivider>Settings</StyledDivider>
                    <Typography variant="h6">
                        Your current role is: {userInfo?.data?.role ?? "Not Assigned"}
                    </Typography>
                </div>

                <div className="auth-form">
                    {message && <Message variant="error">{message}</Message>}
                    {error && typeof error === "string" && <Message variant="error">{error}</Message>}
                    {loading && <Loader/>}
                    <form onSubmit={submitHandler}>
                        <StyledTextField
                            variant="outlined"
                            margin="normal"
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
                            fullWidth
                            label="Change Your Email Address"
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

                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                        >
                            Change Settings
                        </StyledButton>
                    </form>
                </div>
            </section>

            <hr className="divider2"/>
            <Footer/>
        </>
    );
};

export default SettingsScreen;
