import {
    styled,
    Divider,
    TextField,
    Checkbox,
    Button,
    FormControlLabel,
    Paper,
    Card,
    CardMedia,
    Typography,
    AppBar,
    IconButton,
    Drawer,
    Toolbar
} from '@mui/material';
import {CardElement} from "@stripe/react-stripe-js";
import Rating from "@mui/material/Rating";
import {Link} from 'react-router-dom';

const drawerWidth = 280;

export const Root = styled("div")({
    display: "flex",
});

export const StyledAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({theme, open}) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: "#FDF7E9",
    color: "#855C1B",
    boxShadow:
        "0px 3px 3px -2px rgb(190 142 76), 0px 3px 4px 0px rgb(190 142 76), 0px 1px 8px 0px rgb(190 142 76)",
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export const MenuPanel = styled(Typography)({
    fontFamily: "Quicksand",
    letterSpacing: "2px",
});

export const MenuButton = styled(IconButton)(({theme}) => ({
    marginRight: 36,
}));

export const NavbarBtn = styled(Button)(({theme}) => ({
    fontFamily: "Quicksand",
    backgroundColor: "#855C1B",
    color: "#FDF7E9",

    "&:hover": {
        backgroundColor: "#388667",
        color: "#FDF7E9",
    },
}));

export const Hide = styled("div")({
    display: "none",
});

export const StyledDrawer = styled(Drawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    "& .MuiDrawer-paper": {
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: "#FDF7E9",
        boxShadow:
            "0px 3px 3px -2px rgb(190 142 76), 0px 3px 4px 0px rgb(190 142 76), 0px 1px 8px 0px rgb(190 142 76)",
        ...(!open && {
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
        }),
    }

}));

export const StyledToolbar = styled("div")(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
}));

export const Content = styled("main")(({theme}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
}));

export const Icons = styled("div")(({theme}) => ({
    height: "24px",
    width: "24px",
    color: "#855C1B",

    "&:hover": {
        color: "#388667",
    },
}));

export const Rel = styled("div")({
    margin: "0 35px",
});

export const AdminLink = styled(Link)({
    color: '#000',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    }
});

export const NavLinks = styled("a")({
    color: '#000',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    }
});

export const ToolbarNav = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between"
});

export const ToolbarNavLeft = styled('div')({
    display: "flex",
    alignItems: "center"
});

export const ToolbarNavRight = styled('div')({
    display: "flex",
    alignItems: "center"
});

export const ToolbarNavRightLinks = styled('ul')({
    display: "flex",
    listStyle: "none",
    padding: 0,
    margin: 0
});

export const ToolbarNavRightItem = styled('li')({
    marginLeft: "10px"
});

export const StyledDivider = styled(Divider)({
    marginBottom: "20px",
    borderBottom: "1px solid #855C1B",
    paddingBottom: "10px",
    width: "30%",

    "@media (max-width: 600px)": {
        width: "90%",
        margin: "0 auto 20px auto",
    },
});

export const StyledDivider2 = styled(Divider)({
    width: "30%",
    margin: "0 auto",
    borderBottom: "2px solid #BE8E4C",
});

export const StyledDivider3 = styled(Divider)({
    width: "80%",
    margin: "2rem auto 0 auto",
    border: "1px solid #BE8E4C",
})

export const Item = styled(Paper)(({theme}) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
        backgroundColor: '#1A2027',
    }),
}));

export const Item2 = styled(Paper, {
    shouldForwardProp: (prop) => prop !== 'elevation',
})<{ elevation?: number }>(({theme, elevation}) => ({
    backgroundColor: 'transparent',
    border: 'none',
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    [theme.breakpoints.up('sm')]: {
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : 'transparent',
    },
    ...(elevation === 0 && {
        boxShadow: 'none',
    })
}));

export const StyledTextField = styled(TextField)({
    color: "#855C1B",

    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#855C1B",
    },

    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#388667",
    },

    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#388667",
    },

    "& .MuiInputLabel-outlined": {
        color: "#855C1B",
        fontWeight: "600",
        fontFamily: "Quicksand",
    },

    "&:hover .MuiInputLabel-outlined": {
        color: "#388667",
    },

    "& .MuiInputLabel-outlined.Mui-focused": {
        color: "#388667",
    },
});

export const StyledCheckbox = styled(Checkbox)({
    color: "#855C1B",
});

export const StyledButton = styled(Button)({
    fontFamily: "Quicksand",
    backgroundColor: "#855C1B",

    "&:hover": {
        backgroundColor: "#388667",
    },
});

export const StyledButton2 = styled(Button)({
    fontFamily: "Quicksand",
    backgroundColor: "#855C1B",
    color: "white",
    width: '100%',

    "&:hover": {
        backgroundColor: "#388667",
    },
});

export const StyledFormControlLabel = styled(FormControlLabel)({
    fontFamily: "Quicksand",
    color: "#855C1B",
    marginLeft: 0,
});

export const StyledCard = styled(Card)({
    maxWidth: 345,
    minWidth: 345,
    boxShadow:
        "0px 3px 3px -2px rgb(190 142 76), 0px 3px 4px 0px rgb(190 142 76), 0px 1px 8px 0px rgb(190 142 76)",

    display: 'flex',
    flexDirection: 'column',
});

export const StyledCardElement = styled(CardElement)({
    marginBottom: "15px",
})

export const StyledCardMedia = styled(CardMedia)({
    height: 345,
    width: "100%",
});

export const NotPaidSpan = styled('span')({
    color: 'red',
    fontWeight: 'bold',
});

export const IsPaidSpan = styled('span')({
    color: 'green',
    fontWeight: 'bold',
});

export const DeliveredSpan = styled('span')({
    color: 'blue',
    fontWeight: 'bold',
});

export const FailedSpan = styled('span')({
    color: 'orange',
    fontWeight: 'bold',
});

export const StyledRating = styled(Rating)({
    color: 'orange',
});

export const StyledRatingContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
});

export const StyledReviewText = styled(Typography)({
    fontWeight: 'bold',
    fontSize: '0.8rem',
    color: 'orange',
});

export const StyledLink = styled(Link)({
    color: "#855C1B",
    fontWeight: "600",
    textDecoration: "none",

    "&:hover": {
        color: "#388667",
        textDecoration: "underline",
    },
});
