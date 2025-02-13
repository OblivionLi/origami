import {styled, Divider, TextField, Checkbox, Button, FormControlLabel, Paper} from '@mui/material';

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

export const StyledFormControlLabel = styled(FormControlLabel)({
    fontFamily: "Quicksand",
    color: "#855C1B",
    marginLeft: 0,
});
