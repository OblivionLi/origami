import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import ShopIcon from "@material-ui/icons/Shop";
import { Divider, makeStyles, Menu, MenuItem, Button } from "@material-ui/core";
import { logout } from "./../actions/userActions";

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
                        <a href="#">
                            <ShopIcon />
                        </a>
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
                                        <Link to={"/settings"}>Settings</Link>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        My account
                                    </MenuItem>
                                    {userInfo.data.is_admin == 1 && (
                                        <MenuItem onClick={handleClose}>
                                            <a
                                                href="/admin"
                                            >
                                                Admin Panel
                                            </a>
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={handleClose}>
                                        <a href="/" onClick={logoutHandler}>
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
