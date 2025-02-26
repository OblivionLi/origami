import React, {ReactNode, useEffect, useState} from "react";
import {AppDispatch, RootState} from "@/store";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {
    Paper,
    Typography,
    Breadcrumbs, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
} from "@mui/material";
import {Link} from "react-router-dom";
import Navbar from "@/components/Navbar.js";
import NavbarCategories from "@/components/NavbarCategories.js";
import Footer from "@/components/Footer.js";
import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import {clearAddressSuccess, clearUserError, getUserAddress} from "@/features/user/userSlice";
import {Address, createAddress, updateAddress} from "@/features/address/addressSlice";
import {StyledButton, StyledDivider, StyledDivider3, StyledTextField} from "@/styles/muiStyles";
import {setShippingCompleted} from "@/features/checkout/checkoutSlice";

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
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

    const {
        success: addressSuccess,
        loading: addressLoading,
        error: addressError,
    } = useSelector((state: RootState) => state.address);
    const {
        userInfo,
        currentUser,
        loading: userLoading,
        error: userError,
    } = useSelector((state: RootState) => state.user);
    const {cartItems} = useSelector((state: RootState) => state.cart);
    const {cartCompleted} = useSelector((state: RootState) => state.checkout);

    useEffect(() => {
        if (!userInfo) {
            navigate("/");
            return;
        }

        dispatch(clearUserError());
        dispatch(clearAddressSuccess());

        dispatch(getUserAddress(userInfo?.data?.id));
    }, [userInfo, cartItems, dispatch, navigate, cartCompleted]);

    useEffect(() => {
        if (currentUser?.data?.address && currentUser.data.address.length > 0) {
            const addresses = currentUser.data.address;

            const defaultAddress = addresses[0];
            const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId) || defaultAddress;

            if (selectedAddressId === null) {
                setSelectedAddressId(selectedAddress.id);
            }

            setName(selectedAddress.name || "");
            setSurname(selectedAddress.surname || "");
            setCountry(selectedAddress.country || "");
            setCity(selectedAddress.city || "");
            setAddress(selectedAddress.address || "");
            setPostalCode(selectedAddress.postal_code || "");
            setPhoneNumber(selectedAddress.phone_number || "");
        }
    }, [currentUser?.data?.address, selectedAddressId]);

    useEffect(() => {
        if (addressSuccess) {
            dispatch(setShippingCompleted(true));
            dispatch(clearAddressSuccess());
            navigate(`/placeorder/${selectedAddressId}`);
        }
    }, [addressSuccess, dispatch, navigate, selectedAddressId]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        if (!userInfo?.data?.id) {
            return;
        }

        if (currentUser?.data?.address?.length == 0) {
            dispatch(
                createAddress({
                    user_id: userInfo?.data?.id,
                    name,
                    surname,
                    country,
                    city,
                    address,
                    postal_code: postalCode,
                    phone_number: phoneNumber,
                })
            );
        } else {
            dispatch(
                updateAddress({
                    user_id: userInfo?.data?.id,
                    id: selectedAddressId!,
                    name,
                    surname,
                    country,
                    city,
                    address,
                    postal_code: postalCode,
                    phone_number: phoneNumber,
                })
            );
        }

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
    if (userError || addressError) {
        return (
            <>
                <Navbar/>
                <NavbarCategories/>
                <Message variant="error">{userError || addressError}</Message>
            </>
        )
    }

    const handleAddressChange = (event: SelectChangeEvent<number>) => {
        setSelectedAddressId(event.target.value as number);
    };

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

                    {currentUser?.data?.address && currentUser.data.address.length > 0 && (
                        <FormControl fullWidth variant="outlined" sx={{mb: 2}}>
                            <InputLabel id="address-select-label">Select Address</InputLabel>
                            <Select
                                labelId="address-select-label"
                                id="address-select"
                                value={selectedAddressId || ""}
                                onChange={handleAddressChange}
                                label="Select Address"
                            >
                                {currentUser.data.address.map((addr: Address) => (
                                    <MenuItem key={addr.id} value={addr.id}>
                                        {`${addr.country}, ${addr.city}, ${addr.address}, ${addr.postal_code}, ${addr.phone_number}`}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}

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
                            Confirm Address
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
