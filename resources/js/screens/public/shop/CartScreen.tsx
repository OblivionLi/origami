import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import Swal from "sweetalert2";
import {
    Paper,
    Typography,
    Breadcrumbs,
    FormControl,
    Select,
    MenuItem,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
} from "@mui/material";
import {
    StyledButton,
    StyledDivider,
    StyledDivider3,
    StyledLink
} from "@/styles/muiStyles";
import {Delete as DeleteIcon} from "@mui/icons-material";
import Navbar from "@/components/Navbar.js";
import NavbarCategories from "@/components/NavbarCategories.js";
import Message from "@/components/alert/Message.js";
import Footer from "@/components/Footer.js";
import {removeFromCart, updateQuantity} from "@/features/cart/cartSlice";
import {AppDispatch, RootState} from "@/store";

interface CartScreenProps {
}

const CartScreen: React.FC<CartScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {cartItems, loading, error} = useSelector((state: RootState) => state.cart);
    const {userInfo} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
            return;
        }

    }, [userInfo, navigate]);

    const removeFromCartHandler = (id: number) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        if (!userInfo) return;
        navigate(`/shipping`);

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
            title: `Proceed to checkout with success`,
        });
    };

    const subtotalItems = cartItems.reduce((acc, item) => acc + Number(item.qty), 0);
    const totalWithDiscount = cartItems.reduce(
        (acc, item) =>
            acc + item.qty * (item.price - (item.price * (item.discount || 0)) / 100), 0).toFixed(2);
    const totalPriceWithoutDiscount = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    return (
        <>
            <Navbar/>
            <NavbarCategories/>

            <section className="ctn">
                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <Message variant="warning">
                            Your cart is empty <StyledLink to={`/`}>Go Back</StyledLink>
                        </Message>
                    </div>
                ) : (
                    <>
                        <Paper elevation={3} className="content-title">
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" to="/" className="bc">
                                    Homescreen
                                </Link>
                                <Typography className="bc-p">Cart</Typography>
                            </Breadcrumbs>
                        </Paper>

                        <Paper className="show__container">
                            <div className="cart">
                                <TableContainer component={Paper} className="materialTable">
                                    <Table aria-label="cart table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell
                                                    sx={{
                                                        color: "#855C1B",
                                                        fontFamily: "Quicksand",
                                                        fontSize: "1.2rem",
                                                        backgroundColor: "#FDF7E9",
                                                    }}
                                                >
                                                    Name
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        color: "#855C1B",
                                                        fontFamily: "Quicksand",
                                                        fontSize: "1.2rem",
                                                        backgroundColor: "#FDF7E9",
                                                    }}
                                                >
                                                    Discount
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        color: "#855C1B",
                                                        fontFamily: "Quicksand",
                                                        fontSize: "1.2rem",
                                                        backgroundColor: "#FDF7E9",
                                                    }}
                                                >
                                                    Price
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        color: "#855C1B",
                                                        fontFamily: "Quicksand",
                                                        fontSize: "1.2rem",
                                                        backgroundColor: "#FDF7E9",
                                                    }}
                                                >
                                                    Quantity
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        color: "#855C1B",
                                                        fontFamily: "Quicksand",
                                                        fontSize: "1.2rem",
                                                        backgroundColor: "#FDF7E9",
                                                    }}
                                                >
                                                    Action
                                                </TableCell>{" "}
                                                {/* Add Action column */}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {cartItems.map((item) => (
                                                <TableRow key={item.product}>
                                                    <TableCell>
                                                        <StyledLink to={`/product/${item.slug}`}>
                                                            {item.name}
                                                        </StyledLink>
                                                    </TableCell>
                                                    <TableCell>{item.discount || 0}%</TableCell>{" "}
                                                    <TableCell>
                                                        <span>€{(item.price - (item.price * (item.discount || 0)) / 100).toFixed(2)}</span>{" "}
                                                        {"   "}
                                                        <s>€{item.price}</s>
                                                    </TableCell>
                                                    <TableCell>
                                                        <FormControl
                                                            required
                                                            variant="outlined"
                                                            size="small"
                                                        >
                                                            <Select
                                                                labelId={`quantity-label-${item.product}`}
                                                                id={`quantity-select-${item.product}`}
                                                                value={item.qty}
                                                                onChange={(e) =>
                                                                    dispatch(
                                                                        updateQuantity({
                                                                            productId: item.product,
                                                                            qty: Number(e.target.value),
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                {[...Array(item.total_quantities).keys()].map(
                                                                    (x) => (
                                                                        <MenuItem key={x + 1} value={x + 1}>
                                                                            {x + 1}
                                                                        </MenuItem>
                                                                    )
                                                                )}
                                                            </Select>
                                                        </FormControl>
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="delete"
                                                            onClick={() => removeFromCartHandler(item.product)}
                                                        >
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Paper className="show__paper">
                                    <div className="show__paper--div">
                                        <Typography variant="h6" component="h4" className="divider">
                                            Subtotal:
                                        </Typography>
                                        <Typography className="show__paper--p">
                                            {subtotalItems} items
                                        </Typography>
                                    </div>

                                    <div className="show__paper--div">
                                        <Typography variant="h6" component="h4" className="divider">
                                            Total with Discount:
                                        </Typography>
                                        <Typography color="inherit" className="show__paper--p">
                                            €{totalWithDiscount} -{" "}
                                            <s>€{totalPriceWithoutDiscount}</s>
                                        </Typography>
                                    </div>

                                    <StyledDivider/>

                                    <div className="show-tabel-form">
                                        <form>
                                            <div className="form__field">
                                                <StyledButton
                                                    variant="contained"
                                                    type="button"
                                                    onClick={checkoutHandler}
                                                >
                                                    Proceed to checkout
                                                </StyledButton>
                                            </div>
                                        </form>
                                    </div>
                                </Paper>
                            </div>
                        </Paper>
                    </>
                )}
            </section>

            <StyledDivider3/>
            <Footer/>
        </>
    );
};

export default CartScreen;
