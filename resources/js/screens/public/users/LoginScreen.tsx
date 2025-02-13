import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {RootState, AppDispatch} from "@/store";
import {
    Divider,
    Button,
    Grid2,
    TextField,
    FormControlLabel,
    Checkbox,
    styled,
    Paper
} from "@mui/material";
import Navbar from "@/components/Navbar.js";
import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import Footer from "@/components/Footer.js";
import {loginUser} from "@/features/user/userSlice";

const Item = styled(Paper)(({theme}) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

const StyledDivider = styled(Divider)({
    marginBottom: "20px",
    borderBottom: "1px solid #855C1B",
    paddingBottom: "10px",
    width: "30%",

    "@media (max-width: 600px)": {
        width: "90%",
        margin: "0 auto 20px auto",
    },
});

const StyledTextField = styled(TextField)({
    color: "#855C1B",

    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#855C1B",
    },

    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#388667",
    },

    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
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
});

const StyledCheckbox = styled(Checkbox)({
    color: "#855C1B",
});

const StyledButton = styled(Button)({
    fontFamily: "Quicksand",
    backgroundColor: "#855C1B",

    "&:hover": {
        backgroundColor: "#388667",
    },
});

const StyledFormControlLabel = styled(FormControlLabel)({
    fontFamily: "Quicksand",
    color: "#855C1B",
    marginLeft: 0,
});

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
                            <Item>
                                <Link
                                    to="/forgot-password"
                                    className="auth-form--action__link"
                                >
                                    Forgot password?
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

export default LoginScreen;
