import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Divider,
    DialogContent,
    DialogTitle,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import { createChildCat, getChildCatsList } from './../../../../actions/childCategoryActions';
import { CHILD_CATEGORY_LIST_RESET } from "../../../../constants/childCategoryConstants";
import { getParentCatsList } from './../../../../actions/parentCategoryActions';
import Loader from './../../../../components/alert/Loader';
import Message from './../../../../components/alert/Message';

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const AddChildCategoryScreen = ({ setOpenAddDialog, setRequestData }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [parentCatId, setParentCatId] = useState("");
    const [successModal, setSuccessModal] = useState(false);

    const childCatStore = useSelector((state) => state.childCatStore);
    const { loading, success, error } = childCatStore;

    const parentCatList = useSelector((state) => state.parentCatList);
    const { parentCats } = parentCatList;

    useEffect(() => {
        if (successModal) {
            dispatch({ type: CHILD_CATEGORY_LIST_RESET });
            dispatch(getChildCatsList());
        }
        dispatch(getParentCatsList());
    }, [dispatch, success, successModal]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(createChildCat(name, parentCatId));

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenAddDialog(false);

        const Toast = Swal.mixin({
            toast: true,
            position: "center",
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
            title: "Child Category Create with Success",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Add Child Category</DialogTitle>
            <Divider />
            <DialogContent>
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="error">{error}</Message>
                ) : (
                    <form onSubmit={submitHandler}>
                        <div className="form">
                            <div className="form__field">
                                <TextField
                                    variant="outlined"
                                    name="name"
                                    label="Title"
                                    fullWidth
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div className="form__field">
                                <FormControl fullWidth>
                                    <InputLabel id="role-simple-select-label">
                                        Select Relation with Parent Category
                                    </InputLabel>
                                    <Select
                                        labelId="role-simple-select-label"
                                        id="role-simple-select"
                                        value={parentCatId}
                                        onChange={(e) =>
                                            setParentCatId(e.target.value)
                                        }
                                        required
                                    >
                                        {parentCats.data &&
                                            parentCats.data.map((parentCat) => (
                                                <MenuItem
                                                    key={parentCat.id}
                                                    value={parentCat.id}
                                                >
                                                    {parentCat.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </div>
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            value="submit"
                            type="submit"
                            fullWidth
                            className={classes.button}
                        >
                            Add Child Category
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default AddChildCategoryScreen;
