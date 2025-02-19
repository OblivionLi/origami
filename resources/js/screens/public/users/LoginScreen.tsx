import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {RootState, AppDispatch} from "@/store";
import {
    Grid2,
} from "@mui/material";
import Navbar from "@/components/Navbar.js";
import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import Footer from "@/components/Footer.js";
import {loginUser, resetUserState} from "@/features/user/userSlice";
import {
    Item,
    StyledDivider,
    StyledButton,
    StyledFormControlLabel,
    StyledCheckbox,
    StyledTextField, StyledDivider3, Item2
} from "@/styles/muiStyles";

interface LoginScreenProps {
}

const LoginScreen: React.FC<LoginScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const redirect = location.search ? location.search.split("=")[1] : "/";

    const {loading, error, userInfo} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect, {replace: true})
        }

    }, [navigate, userInfo, redirect]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(
            loginUser({
                email,
                password,
                remember_me: rememberMe
            })
        );
    };

    return (
        <>
            <Navbar/>

            <section className="content auth">
                <div className="auth-title">
                    <StyledDivider>Login</StyledDivider>
                </div>

                <div className="auth-form">
                    {error && <Message variant="error">{error}</Message>}
                    {loading && <Loader/>}
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
                            autoComplete="current-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            Login
                        </StyledButton>

                        <Grid2 container className="auth-form--action">
                            <Item2 elevation={0}>
                                <Link
                                    to="/forgot-password"
                                    className="auth-form--action__link"
                                >
                                    Forgot password?
                                </Link>
                            </Item2>
                            <Item2 elevation={0}>
                                <Link
                                    to="/register"
                                    className="auth-form--action__link"
                                >
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Item2>
                        </Grid2>
                    </form>
                </div>
            </section>

            <StyledDivider3/>
            <Footer/>
        </>
    );
};

export default LoginScreen;
