import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
    Divider,
    styled,
    Menu,
    MenuItem,
    Badge,
    IconButton
} from "@mui/material";
import {logout} from "./../actions/userActions";
import {RootState, AppDispatch} from '@/store'
import {Root} from "react-dom/client";

const StyledDivider = styled(Divider)({
    width: "30%",
    margin: "0 auto",
    borderBottom: "2px solid #BE8E4C",
});

interface UserInfo {
    data: {
        is_admin: number;
        access_token: string;
    }
}

interface CartItem {
    id: number;
    name: string;
}

interface CartState {
    cartItems: CartItem[]
}

interface NavbarProps {
}

const Navbar: React.FC<NavbarProps> = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const userLogin = useSelector((state: RootState) => state.user.userInfo);
    const cart = useSelector((state: RootState) => state.cart);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logoutHandler = () => {
        dispatch(logout());
        navigate("/", {replace: true});
    };

    return (
        <>
            <nav className="navigation">
                <div className="navigation-brand">
                    <Link className="navigation-brand-link" to="/">
                        <img
                            className="navigation-brand-img"
                            // TODO:: make this dynamic
                            src="http://127.0.0.1:8000/storage/logo.png"
                            alt={"Logo"}
                        />
                    </Link>
                </div>

                <ul className="navigation-list">
                    <li>
                        <Link to="/">
                            <HomeIcon/>
                        </Link>
                    </li>
                    <li>
                        <Link to="/cart">
                            <Badge badgeContent={cart.cartItems.length}>
                                <ShoppingCartIcon/>
                            </Badge>
                        </Link>
                    </li>
                    <li>
                        {userLogin ? (
                            <>
                                <a
                                    className="navigation-list--item"
                                    onClick={handleClick}
                                >
                                    <AccountBoxIcon/>
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
                                    {userLogin.data.is_admin == 1 && (
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
                                <AccountBoxIcon/>
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>

            <StyledDivider />
        </>
    );
};

export default Navbar;
