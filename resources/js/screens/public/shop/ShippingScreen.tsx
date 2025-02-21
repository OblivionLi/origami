import React, {useEffect, useState} from "react";
import {AppDispatch, RootState} from "@/store";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {
    Paper,
    Typography,
    Breadcrumbs,
} from "@mui/material";
import {Link} from "react-router-dom";
import Navbar from "@/components/Navbar.js";
import NavbarCategories from "@/components/NavbarCategories.js";
import Footer from "@/components/Footer.js";
import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import {getUser} from "@/features/user/userSlice";
import {createAddress} from "@/features/address/addressSlice";
import {StyledButton, StyledDivider, StyledDivider3, StyledTextField} from "@/styles/muiStyles";


interface ShippingScreenProps {
}

const ShippingScreen: React.FC<ShippingScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [address, setAddress] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const {
        success,
        loading: addressLoading,
        error: addressError,
        currentAddress
    } = useSelector((state: RootState) => state.address);
    const {userInfo, loading: userLoading, error: userError,} = useSelector((state: RootState) => state.user);
    const {cartItems} = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
            return;
        }

        if (!cartItems) {
            navigate("/")
            return;
        }

        if (!userInfo.data) {
            dispatch(getUser(userInfo.id));
            return;
        }

        console.log('outside')
        console.log(userInfo)
        if (userInfo.data.address && userInfo.data.address.length > 0) {
            console.log(userInfo)
            const userAddress = userInfo.data.address[0];
            setName(userAddress.name);
            setSurname(userAddress.surname);
            setCountry(userAddress.country);
            setCity(userAddress.city);
            setAddress(userAddress.address);
            setPostalCode(userAddress.postal_code);
            setPhoneNumber(userAddress.phone_number);
        }

        if (success) {
            navigate(`/placeorder`);
        }
    }, [userInfo, cartItems, success, dispatch, navigate]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (!userInfo?.id) {
            return;
        }

        dispatch(
            createAddress({
                user_id: userInfo.id,
                name,
                surname,
                country,
                city,
                address,
                postal_code: postalCode,
                phone_number: phoneNumber,
            })
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

    if (userLoading || addressLoading) {
        return (
            <>
                <Navbar/>
                <NavbarCategories/>
                <div className="loaderCenter">
                    <Loader/>
                </div>
            </>
        );
    }
    if (userError) {
        return (
            <>
                <Navbar/>
                <NavbarCategories/>
                <Message variant="error">{userError}</Message>
            </>

        )
    }
    if (addressError) {
        return (
            <>
                <Navbar/>
                <NavbarCategories/>
                <Message variant="error">{addressError}</Message>
            </>
        )
    }

    return (
        <>
            <Navbar/>
            <NavbarCategories/>

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

                <Paper className="show__container">
                    <StyledDivider>Your Address</StyledDivider>
                    <form onSubmit={submitHandler}>
                        <div className="form">
                            <div className="form__field">
                                <StyledTextField
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
                                <StyledTextField
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
                                <StyledTextField
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
                                <StyledTextField
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
                                <StyledTextField
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
                                <StyledTextField
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
                                <StyledTextField
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

                        <StyledButton
                            variant="contained"
                            color="primary"
                            value="submit"
                            type="submit"
                            fullWidth
                        >
                            Add/Update Address
                        </StyledButton>
                    </form>
                </Paper>
            </section>

            <StyledDivider3/>
            <Footer/>
        </>
    );
};

export default ShippingScreen;
