import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
    Paper,
    Typography,
    Breadcrumbs,
    TextField,
    Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Navbar from "./../../../components/Navbar";
import NavbarCategories from "./../../../components/NavbarCategories";
import Footer from "../../../components/Footer";
import { getUser } from "./../../../actions/userActions";
import { createAddress } from "../../../actions/addressActions";
import Message from "./../../../components/alert/Message";
import Loader from "./../../../components/alert/Loader";
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

    card: {
        maxWidth: 345,
        minWidth: 345,
        boxShadow:
            "0px 3px 3px -2px rgb(190 142 76), 0px 3px 4px 0px rgb(190 142 76), 0px 1px 8px 0px rgb(190 142 76)",
    },

    media: {
        height: 345,
        width: "100%",
    },

    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",
        color: "white",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },

    materialTable: {
        fontFamily: "Quicksand",
        fontWeight: "bold",
        color: "#388667",
    },

    link: {
        color: "#855C1B",

        "&:hover": {
            color: "#388667",
        },
    },
}));

const ShippingScreen = ({ match, history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const userId = match.params.id;
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isUserEmpty, setIsUserEmpty] = useState(true);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userShow = useSelector((state) => state.userShow);
    const { loading, error, user } = userShow;
    const { data } = user;

    const addressCreate = useSelector((state) => state.addressCreate);
    const { success } = addressCreate;

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    useEffect(() => {
        if (!userInfo || userInfo.data.user_id != userId || !cartItems) {
            history.push("/")
        }

        if (isUserEmpty) {
            dispatch(getUser(userId));
            setIsUserEmpty(false);
        } else {
            if (data && data.address.length > 0) {
                setName(data ? data.address[0].name : "");
                setSurname(
                    data ? data.address[0].surname : ""
                );
                setCountry(
                    data ? data.address[0].country : ""
                );
                setCity(data ? data.address[0].city : "");
                setAddress(
                    data ? data.address[0].address : ""
                );
                setPostalCode(
                    data ? data.address[0].postal_code : ""
                );
                setPhoneNumber(
                    data ? data.address[0].phone_number : ""
                );
            }
        }

        success && history.push(`/placeorder/${userInfo.data.user_id}`);
    }, [dispatch, data, isUserEmpty, success]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(
            createAddress(
                userInfo.data.id,
                name,
                surname,
                country,
                city,
                address,
                postalCode,
                phoneNumber
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
            title: `Now you can place the order`,
        });
    };

    return (
        <>
            <Navbar />
            <NavbarCategories />

            <section className="ctn">
                <Paper elevation={3} className="content-title">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="inherit" to="/" className="bc">
                            Homescreen
                        </Link>
                        <Link color="inherit" to="/cart" className="bc">
                            Cart
                        </Link>
                        <Typography className="bc-p">Shipping</Typography>
                    </Breadcrumbs>
                </Paper>

                {loading ? (
                    <div className="loaderCenter">
                        <Loader />
                    </div>
                ) : error ? (
                    <Message variant="error">{error}</Message>
                ) : (
                    <Paper className="show__container">
                        <h2 className={classes.divider}>Your Address</h2>
                        <form onSubmit={submitHandler}>
                            <div className="form">
                                <div className="form__field">
                                    <TextField
                                        variant="outlined"
                                        name="name"
                                        label="First Name"
                                        fullWidth
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="form__field">
                                    <TextField
                                        variant="outlined"
                                        name="surname"
                                        label="Surname"
                                        fullWidth
                                        value={surname}
                                        onChange={(e) =>
                                            setSurname(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="form__field">
                                    <TextField
                                        variant="outlined"
                                        name="country"
                                        label="Country"
                                        value={country}
                                        fullWidth
                                        onChange={(e) =>
                                            setCountry(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="form__field">
                                    <TextField
                                        variant="outlined"
                                        name="city"
                                        label="City"
                                        value={city}
                                        fullWidth
                                        onChange={(e) =>
                                            setCity(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="form__field">
                                    <TextField
                                        variant="outlined"
                                        name="address"
                                        value={address}
                                        label="Address"
                                        fullWidth
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="form__field">
                                    <TextField
                                        variant="outlined"
                                        name="postalCode"
                                        label="Type Postal Code"
                                        value={postalCode}
                                        type="number"
                                        fullWidth
                                        onChange={(e) =>
                                            setPostalCode(e.target.value)
                                        }
                                        required
                                    />
                                </div>

                                <div className="form__field">
                                    <TextField
                                        variant="outlined"
                                        name="phoneNumber"
                                        label="Phone Number"
                                        value={phoneNumber}
                                        placeholder="Please provide a phone number with country prefix ex: +40 123 456 789"
                                        fullWidth
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                variant="contained"
                                color="primary"
                                value="submit"
                                type="submit"
                                fullWidth
                                className={classes.button}
                            >
                                Add/Update Address
                            </Button>
                        </form>
                    </Paper>
                )}
            </section>

            <hr className="divider2" />
            <Footer />
        </>
    );
};

export default ShippingScreen;
