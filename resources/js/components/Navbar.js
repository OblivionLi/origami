import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ShopIcon from "@material-ui/icons/Shop";
import {
    Divider,
    makeStyles,
    Menu,
    MenuItem,
    Badge,
    IconButton,
} from "@material-ui/core";
import { logout } from "./../actions/userActions";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const useStyles = makeStyles((theme) => ({
    divider: {
        width: "30%",
        margin: "0 auto",
        borderBottom: "2px solid #BE8E4C",
    },

    icon: {
        color: "red",
    },
}));

const Navbar = () => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const cart = useSelector((state) => state.cart);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutHandler = () => {
        dispatch(logout());
    };

    return (
        <>
            <nav className="navigation">
                <div className="navigation-brand">
                    <Link className="navigation-brand-link" to="/">
                        <img
                            className="navigation-brand-img"
                            src="http://127.0.0.1:8000/storage/logo.png"
                        />
                    </Link>
                </div>

                <ul className="navigation-list">
                    <li>
                        <Link to="/">
                            <HomeIcon />
                        </Link>
                    </li>
                    <li>
                        <Link to="/cart">
                            <Badge badgeContent={cart.cartItems.length}>
                                <ShoppingCartIcon />
                            </Badge>
                        </Link>
                    </li>
                    <li>
                        {userInfo ? (
                            <>
                                <a
                                    className="navigation-list--item"
                                    onClick={handleClick}
                                >
                                    <AccountBoxIcon />
                                </a>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    disableScrollLock={true}
                                >
                                    <MenuItem onClick={handleClose}>
                                        <Link
                                            to={"/settings"}
                                            className="nav-links"
                                        >
                                            Settings
                                        </Link>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <Link
                                            to={"/order-history"}
                                            className="nav-links"
                                        >
                                            Order History
                                        </Link>
                                    </MenuItem>
                                    {userInfo.data.is_admin == 1 && (
                                        <MenuItem onClick={handleClose}>
                                            <a
                                                href="/admin"
                                                className="nav-links"
                                            >
                                                Admin Panel
                                            </a>
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={handleClose}>
                                        <a
                                            href="/"
                                            onClick={logoutHandler}
                                            className="nav-links"
                                        >
                                            Logout
                                        </a>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Link to="/login">
                                <AccountBoxIcon />
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>

            <Divider className={classes.divider} />
        </>
    );
};

export default Navbar;
