import React from "react";
import {RootState, AppDispatch} from '@/store';
import {useSelector, useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
    Menu,
    MenuItem,
    Badge
} from "@mui/material";
import {logoutUser} from "@/features/user/userSlice";
import {StyledDivider2} from "@/styles/muiStyles";

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
        dispatch(logoutUser());
        navigate("/", {replace: true});
    };

    const isAdmin = userLogin?.data?.is_admin === 1 || userLogin?.is_admin === 1;

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
                                    style={{cursor: 'pointer'}}
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
                                    {isAdmin && (
                                        <MenuItem onClick={handleClose}>
                                            <a
                                                href="/admin"
                                                className="nav-links"
                                            >
                                                Admin Panel
                                            </a>
                                        </MenuItem>
                                    )}
                                    <MenuItem onClick={() => {
                                        handleClose();
                                        logoutHandler();
                                    }}>
                                        Logout
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

            <StyledDivider2/>
        </>
    );
};

export default Navbar;
