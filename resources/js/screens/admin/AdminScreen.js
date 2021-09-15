import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import {
    Drawer,
    AppBar,
    Toolbar,
    List,
    CssBaseline,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Button,
    Collapse,
    Menu,
    MenuItem,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import { FaUsers, FaUsersCog, FaUserTag, FaReceipt } from "react-icons/fa";
import { logout } from "../../actions/userActions";
import Loader from "../../components/alert/Loader";
import UsersScreen from "./users/UsersScreen";
import RolesScreen from "./users/roles/RolesScreen";
import PermissionsScreen from "./users/permissions/PermissionsScreen";
import DashboardIcon from "@material-ui/icons/Dashboard";
import DashboardScreen from "./DashboardScreen";
import ParentCategoriesScreen from "./categories/parent/ParentCategoriesScreen";
import CategoryIcon from "@material-ui/icons/Category";
import FileCopySharpIcon from "@material-ui/icons/FileCopySharp";
import InsertDriveFileSharpIcon from "@material-ui/icons/InsertDriveFileSharp";
import ChildCategoriesScreen from "./categories/child/ChildCategoriesScreen";
import ProductsScreen from "./products/ProductsScreen";
import NoteIcon from "@material-ui/icons/Note";
import { BiCommentDetail } from "react-icons/bi";
import ReviewsScreen from "./reviews/ReviewsScreen";
import OrderScreen from "./orders/OrderScreen";

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#FDF7E9",
        color: "#855C1B",
        boxShadow:
            "0px 3px 3px -2px rgb(190 142 76), 0px 3px 4px 0px rgb(190 142 76), 0px 1px 8px 0px rgb(190 142 76)",
    },
    menuPanel: {
        fontFamily: "Quicksand",
        letterSpacing: "2px",
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    navbarBtn: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",
        color: "#FDF7E9",

        "&:hover": {
            backgroundColor: "#388667",
            color: "#FDF7E9",
        },
    },
    hide: {
        display: "none",
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: "#FDF7E9",
        boxShadow:
            "0px 3px 3px -2px rgb(190 142 76), 0px 3px 4px 0px rgb(190 142 76), 0px 1px 8px 0px rgb(190 142 76)",
    },
    drawerClose: {
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: "hidden",
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9) + 1,
        },
        backgroundColor: "#FDF7E9",
        boxShadow:
            "0px 3px 3px -2px rgb(190 142 76), 0px 3px 4px 0px rgb(190 142 76), 0px 1px 8px 0px rgb(190 142 76)",
    },
    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    icons: {
        height: "24px",
        width: "24px",
        color: "#855C1B",

        "&:hover": {
            color: "#388667",
        },
    },
    rel: {
        margin: "0 35px",
    },
}));

const AdminScreen = ({ history }) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const theme = useTheme();

    const [open, setOpen] = useState(false);
    // const [open2, setOpen2] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
    const [openNavUserMenu, setOpenNavUserMenu] = useState(null);

    const [isAdmin, setIsAdmin] = useState(false);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            setIsAdmin(true);
        }
    }, [userInfo]);

    const handleNavUserMenu = () => {
        setOpenNavUserMenu(null);
    };

    function handleUserMenu() {
        setOpenUserMenu(!openUserMenu);
    }

    function handleCategoryMenu() {
        setOpenCategoryMenu(!openCategoryMenu);
    }

    // function handleClick() {
    //     setOpen2(!open2);
    // }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const logoutHandler = () => {
        dispatch(logout());
        history.push("/login");
    };

    return (
        <>
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader />
                </div>
            ) : (
                <div className={classes.root}>
                    <Router>
                        <CssBaseline />
                        <AppBar
                            position="fixed"
                            className={clsx(classes.appBar, {
                                [classes.appBarShift]: open,
                            })}
                        >
                            <Toolbar className="toolbar-nav">
                                <div className="toolbar-nav--left">
                                    <IconButton
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={handleDrawerOpen}
                                        edge="start"
                                        className={clsx(classes.menuButton, {
                                            [classes.hide]: open,
                                        })}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        className={classes.menuPanel}
                                    >
                                        Administration Area
                                    </Typography>
                                </div>

                                <div className="toolbar-nav--right">
                                    <ul className="toolbar-nav--right--links">
                                        <li className="toolbar-nav--right--item">
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                href="/"
                                                className={classes.navbarBtn}
                                            >
                                                Home
                                            </Button>
                                        </li>

                                        <li className="toolbar-nav--right--item">
                                            <Button
                                                variant="contained"
                                                aria-controls="auth-menu"
                                                aria-haspopup="true"
                                                onClick={(e) =>
                                                    setOpenNavUserMenu(
                                                        e.currentTarget
                                                    )
                                                }
                                                className={classes.navbarBtn}
                                            >
                                                {userInfo.data.name}
                                            </Button>
                                            <Menu
                                                id="auth-menu"
                                                anchorEl={openNavUserMenu}
                                                keepMounted
                                                open={Boolean(openNavUserMenu)}
                                                onClose={handleNavUserMenu}
                                            >
                                                <MenuItem
                                                    onClick={handleNavUserMenu}
                                                >
                                                    <a
                                                        href="/settings"
                                                        className="nav-links"
                                                    >
                                                        Settings
                                                    </a>
                                                </MenuItem>

                                                <MenuItem
                                                    onClick={handleNavUserMenu}
                                                >
                                                    <Link
                                                        to="/"
                                                        onClick={logoutHandler}
                                                        className="nav-links"
                                                    >
                                                        Logout
                                                    </Link>
                                                </MenuItem>
                                            </Menu>
                                        </li>
                                    </ul>
                                </div>
                            </Toolbar>
                        </AppBar>
                        <Drawer
                            variant="permanent"
                            className={clsx(classes.drawer, {
                                [classes.drawerOpen]: open,
                                [classes.drawerClose]: !open,
                            })}
                            classes={{
                                paper: clsx({
                                    [classes.drawerOpen]: open,
                                    [classes.drawerClose]: !open,
                                }),
                            }}
                        >
                            <div className={classes.toolbar}>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === "rtl" ? (
                                        <ChevronRightIcon />
                                    ) : (
                                        <ChevronLeftIcon />
                                    )}
                                </IconButton>
                            </div>
                            <Divider />
                            <List>
                                <ListItem button>
                                    <ListItemIcon>
                                        <DashboardIcon
                                            className={classes.icons}
                                        />
                                    </ListItemIcon>
                                    <Link to="/admin" className="admin--links">
                                        Dashboard
                                    </Link>
                                </ListItem>

                                <Divider />

                                <ListItem button>
                                    <ListItemIcon>
                                        <NoteIcon className={classes.icons} />
                                    </ListItemIcon>
                                    <Link
                                        to="/admin/products"
                                        className="admin--links"
                                    >
                                        Products
                                    </Link>
                                </ListItem>

                                <ListItem button>
                                    <ListItemIcon>
                                        <BiCommentDetail
                                            className={classes.icons}
                                        />
                                    </ListItemIcon>
                                    <Link
                                        to="/admin/products/reviews"
                                        className="admin--links"
                                    >
                                        Reviews
                                    </Link>
                                </ListItem>

                                <ListItem button onClick={handleCategoryMenu}>
                                    <ListItemIcon>
                                        <CategoryIcon
                                            className={classes.icons}
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Product Categories"
                                        className="admin--links"
                                    />
                                    {openCategoryMenu ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )}
                                </ListItem>
                                <Collapse
                                    in={openCategoryMenu}
                                    timeout="auto"
                                    unmountOnExit
                                    className="reportsMenu"
                                >
                                    <Divider />
                                    <List className={classes.rel}>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <FileCopySharpIcon
                                                    className={classes.icons}
                                                />
                                            </ListItemIcon>
                                            <Link
                                                to="/admin/parent-categories"
                                                className="admin--links"
                                            >
                                                Parent
                                            </Link>
                                        </ListItem>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <InsertDriveFileSharpIcon
                                                    className={classes.icons}
                                                />
                                            </ListItemIcon>
                                            <Link
                                                to="/admin/child-categories"
                                                className="admin--links"
                                            >
                                                Child
                                            </Link>
                                        </ListItem>
                                    </List>
                                </Collapse>

                                <Divider />

                                <ListItem button>
                                    <ListItemIcon>
                                        <FaUsers className={classes.icons} />
                                    </ListItemIcon>
                                    <Link
                                        to="/admin/users"
                                        className="admin--links"
                                    >
                                        Users
                                    </Link>
                                </ListItem>

                                <ListItem button onClick={handleUserMenu}>
                                    <ListItemIcon>
                                        <FaUsersCog className={classes.icons} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Users Relationship"
                                        className="admin--links"
                                    />
                                    {openUserMenu ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )}
                                </ListItem>
                                <Collapse
                                    in={openUserMenu}
                                    timeout="auto"
                                    unmountOnExit
                                    className="reportsMenu"
                                >
                                    <Divider />
                                    <List className={classes.rel}>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <FaUserTag
                                                    className={classes.icons}
                                                />
                                            </ListItemIcon>
                                            <Link
                                                to="/admin/users/roles"
                                                className="admin--links"
                                            >
                                                Roles
                                            </Link>
                                        </ListItem>
                                        <ListItem button>
                                            <ListItemIcon>
                                                <RemoveCircleIcon
                                                    className={classes.icons}
                                                />
                                            </ListItemIcon>
                                            <Link
                                                to="/admin/users/permissions"
                                                className="admin--links"
                                            >
                                                Permissions
                                            </Link>
                                        </ListItem>
                                    </List>
                                </Collapse>

                                <Divider />

                                <ListItem button>
                                    <ListItemIcon>
                                        <FaReceipt className={classes.icons} />
                                    </ListItemIcon>
                                    <Link
                                        to="/admin/orders"
                                        className="admin--links"
                                    >
                                        Orders
                                    </Link>
                                </ListItem>
                            </List>
                        </Drawer>
                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            <Switch>
                                <Route
                                    path="/admin"
                                    component={DashboardScreen}
                                    exact
                                />

                                <Route
                                    path="/admin/users"
                                    component={UsersScreen}
                                    exact
                                />

                                <Route
                                    path="/admin/users/roles"
                                    component={RolesScreen}
                                />

                                <Route
                                    path="/admin/users/permissions"
                                    component={PermissionsScreen}
                                />

                                <Route
                                    path="/admin/parent-categories"
                                    component={ParentCategoriesScreen}
                                />

                                <Route
                                    path="/admin/child-categories"
                                    component={ChildCategoriesScreen}
                                />

                                <Route
                                    path="/admin/products"
                                    component={ProductsScreen}
                                    exact
                                />

                                <Route
                                    path="/admin/products/reviews"
                                    component={ReviewsScreen}
                                />

                                <Route
                                    path="/admin/orders"
                                    component={OrderScreen}
                                />
                            </Switch>
                        </main>
                    </Router>
                </div>
            )}
        </>
    );
};

export default AdminScreen;
