import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
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
    ListItemIcon,
    ListItemText,
    Button,
    Collapse,
    Menu,
    MenuItem, ListItem, ListItemButton,
} from "@mui/material";
import {BrowserRouter as Router, Route, Link, useNavigate, Routes, Navigate} from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import FileCopySharpIcon from "@mui/icons-material/FileCopySharp";
import InsertDriveFileSharpIcon from "@mui/icons-material/InsertDriveFileSharp";
import NoteIcon from "@mui/icons-material/Note";
import Loader from "@/components/alert/Loader.js";
import {AppDispatch, RootState} from "@/store";
import {logoutUser, resetUserState} from "@/features/user/userSlice";
import {
    StyledAppBar,
    MenuPanel,
    MenuButton,
    NavbarBtn,
    StyledDrawer,
    StyledToolbar,
    Content,
    AdminLink,
    NavLinks,
    Root,
    ToolbarNav,
    ToolbarNavLeft,
    ToolbarNavRight,
    ToolbarNavRightLinks,
    ToolbarNavRightItem,
} from "@/styles/muiStyles";
import ReviewsIcon from '@mui/icons-material/Reviews';
import GroupIcon from '@mui/icons-material/Group';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ReceiptIcon from '@mui/icons-material/Receipt';
import UsersScreen from "@/screens/admin/users/UsersScreen";

interface AdminScreenProps {
}

const AdminScreen: React.FC<AdminScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    // const [open2, setOpen2] = useState(false);
    const [openUserMenu, setOpenUserMenu] = useState(false);
    const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
    const [openNavUserMenu, setOpenNavUserMenu] = useState<null | HTMLElement>(null);

    const [isAdmin, setIsAdmin] = useState(false);

    const userLogin = useSelector((state: RootState) => state.user.userInfo);

    useEffect(() => {
        if (!userLogin || userLogin?.data?.is_admin != 1) {
            navigate("/login");
        } else {
            setIsAdmin(true);
        }
    }, [userLogin, navigate]);

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
        dispatch(logoutUser());
        dispatch(resetUserState());
        navigate("/", {replace: true});
    };

    const iconStyle = {
        height: 24,
        width: 24,
        color: "#855C1B",
        "&:hover": {
            color: "#388667",
        },
    };

    const handleListItemClick = (path: string) => {
        navigate(`/admin/${path}`);
    }

    return (
        <>
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader/>
                </div>
            ) : (
                <Root>
                    <CssBaseline/>
                    <StyledAppBar position="fixed" open={open}>
                        <ToolbarNav>
                            <ToolbarNavLeft>
                                <MenuButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    onClick={handleDrawerOpen}
                                    edge="start"
                                    sx={{...(open && {display: 'none'})}}
                                >
                                    <MenuIcon/>
                                </MenuButton>
                                <MenuPanel variant="h6" noWrap>
                                    Administration Area
                                </MenuPanel>
                            </ToolbarNavLeft>

                            <ToolbarNavRight>
                                <ToolbarNavRightLinks>
                                    <ToolbarNavRightItem>
                                        <NavbarBtn
                                            variant="contained"
                                            color="secondary"
                                            href="/"
                                        >
                                            Home
                                        </NavbarBtn>
                                    </ToolbarNavRightItem>

                                    <ToolbarNavRightItem>
                                        <NavbarBtn
                                            variant="contained"
                                            aria-controls="auth-menu"
                                            aria-haspopup="true"
                                            onClick={(e: any) =>
                                                setOpenNavUserMenu(
                                                    e.currentTarget
                                                )
                                            }
                                        >
                                            {userLogin?.data?.name}
                                        </NavbarBtn>
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
                                                <NavLinks
                                                    href="/settings"

                                                >
                                                    Settings
                                                </NavLinks>
                                            </MenuItem>

                                            <MenuItem
                                                onClick={handleNavUserMenu}
                                            >
                                                <NavLinks

                                                    onClick={logoutHandler}
                                                    href="#"
                                                >
                                                    Logout
                                                </NavLinks>
                                            </MenuItem>
                                        </Menu>
                                    </ToolbarNavRightItem>
                                </ToolbarNavRightLinks>
                            </ToolbarNavRight>
                        </ToolbarNav>
                    </StyledAppBar>
                    <StyledDrawer variant="permanent" open={open}>
                        <StyledToolbar>
                            <IconButton onClick={handleDrawerClose}>
                                {/*{theme.direction === "rtl" ? (*/}
                                {/*    <ChevronRightIcon />*/}
                                {/*) : (*/}
                                {/*    <ChevronLeftIcon />*/}
                                {/*)}*/}
                                <ChevronLeftIcon/>
                            </IconButton>
                        </StyledToolbar>
                        <Divider/>
                        <List component={'nav'}>
                            <ListItem component={AdminLink} to="/admin">
                                <ListItemIcon>
                                    <DashboardIcon sx={iconStyle}/>
                                </ListItemIcon>
                                <ListItemText primary="Dashboard"/>
                            </ListItem>

                            <Divider/>

                            <ListItemButton
                                onClick={() => handleListItemClick("products")}
                            >
                                <ListItemIcon>
                                    <NoteIcon sx={iconStyle}/>
                                </ListItemIcon>
                                <ListItemText primary="Products"/>
                            </ListItemButton>

                            {/*<ListItem component={AdminLink} to="/admin/products">*/}
                            {/*    <ListItemIcon>*/}
                            {/*        <NoteIcon sx={iconStyle} />*/}
                            {/*    </ListItemIcon>*/}
                            {/*    <ListItemText primary="Products"/>*/}
                            {/*</ListItem>*/}

                            <ListItem component={AdminLink} to="/admin/products/reviews">
                                <ListItemIcon>
                                    <ReviewsIcon sx={iconStyle}/>
                                </ListItemIcon>
                                <ListItemText primary="Reviews"/>
                            </ListItem>

                            <ListItem onClick={handleCategoryMenu}>
                                <ListItemIcon>
                                    <CategoryIcon sx={iconStyle}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Product Categories"
                                />
                                {openCategoryMenu ? (
                                    <ExpandLessIcon/>
                                ) : (
                                    <ExpandMoreIcon/>
                                )}
                            </ListItem>
                            <Collapse
                                in={openCategoryMenu}
                                timeout="auto"
                                unmountOnExit

                            >
                                <Divider/>
                                <List sx={{margin: "0 35px"}}>
                                    <ListItem component={AdminLink} to="/admin/parent-categories">
                                        <ListItemIcon>
                                            <FileCopySharpIcon sx={iconStyle}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Parent"/>

                                    </ListItem>
                                    <ListItem component={AdminLink} to="/admin/child-categories">
                                        <ListItemIcon>
                                            <InsertDriveFileSharpIcon sx={iconStyle}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Child"/>
                                    </ListItem>
                                </List>
                            </Collapse>

                            <Divider/>

                            {/*<ListItem component={AdminLink} to="/admin/users">*/}
                            {/*    <ListItemIcon>*/}
                            {/*        <GroupIcon sx={iconStyle}/>*/}
                            {/*    </ListItemIcon>*/}
                            {/*    <ListItemText primary="Users"/>*/}
                            {/*</ListItem>*/}

                            <ListItemButton
                                onClick={() => handleListItemClick("users")}
                            >
                                <ListItemIcon>
                                    <GroupIcon sx={iconStyle}/>
                                </ListItemIcon>
                                <ListItemText primary="Users"/>
                            </ListItemButton>

                            <ListItem onClick={handleUserMenu}>
                                <ListItemIcon>
                                    <GroupAddIcon sx={iconStyle}/>
                                </ListItemIcon>
                                <ListItemText
                                    primary="Users Relationship"
                                />
                                {openUserMenu ? (
                                    <ExpandLessIcon/>
                                ) : (
                                    <ExpandMoreIcon/>
                                )}
                            </ListItem>
                            <Collapse
                                in={openUserMenu}
                                timeout="auto"
                                unmountOnExit
                            >
                                <Divider/>
                                <List sx={{margin: "0 35px"}}>
                                    <ListItem component={AdminLink} to="/admin/users/roles">
                                        <ListItemIcon>
                                            <LocalOfferIcon sx={iconStyle}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Roles"/>
                                    </ListItem>
                                    <ListItem component={AdminLink} to="/admin/users/permissions">
                                        <ListItemIcon>
                                            <RemoveCircleIcon sx={iconStyle}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Permissions"/>
                                    </ListItem>
                                </List>
                            </Collapse>

                            <Divider/>

                            <ListItem component={AdminLink} to="/admin/orders">
                                <ListItemIcon>
                                    <ReceiptIcon sx={iconStyle}/>
                                </ListItemIcon>
                                <ListItemText primary="Orders"/>
                            </ListItem>
                        </List>
                    </StyledDrawer>
                    <Content>
                        <StyledToolbar/>
                        <Routes>
                            {/*<Route path="/admin" element={<DashboardScreen />} />*/}
                            <Route path="/users" element={<UsersScreen/>}/>
                            {/*<Route path="/admin/users/roles" element={<RolesScreen />} />*/}
                            {/*<Route path="/admin/users/permissions" element={<PermissionsScreen />} />*/}
                            {/*<Route path="/admin/parent-categories" element={<ParentCategoriesScreen />} />*/}
                            {/*<Route path="/admin/child-categories" element={<ChildCategoriesScreen />} />*/}
                            {/*<Route path="/admin/products" element={<ProductsScreen />} />*/}
                            {/*<Route path="/admin/products/reviews" element={<ReviewsScreen />} />*/}
                            {/*<Route path="/admin/orders" element={<OrderScreen />} />*/}

                            <Route path="*" element={<Navigate to="/admin" replace />} />
                        </Routes>
                    </Content>
                </Root>
            )}
        </>
    );
};

export default AdminScreen;
