import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Divider,
    DialogContent,
    DialogTitle,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import { getParentCatsList } from './../../../../actions/parentCategoryActions';
import { getChildCat, getChildCatsList, editChildCat } from './../../../../actions/childCategoryActions';
import Message from './../../../../components/alert/Message';
import Loader from './../../../../components/alert/Loader';

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const UpdateChildCategoryScreen = ({
    setOpenEditDialog,
    setRequestData,
    childId,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [parentCategoryId, setParentCategoryId] = useState("");
    const [slug, setSlug] = useState("");

    const [successModal, setSuccessModal] = useState(false);
    const [childCatEmpty, setChildCatEmpty] = useState(true);

    const childCatShow = useSelector((state) => state.childCatShow);
    const { loading, error, childCat } = childCatShow;
    const { data } = childCat;

    const childCatUpdate = useSelector((state) => state.childCatUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = childCatUpdate;

    const parentCatList = useSelector((state) => state.parentCatList);
    const { parentCats } = parentCatList;

    useEffect(() => {
        if (childCatEmpty) {
            dispatch(getChildCat(childId));
            dispatch(getParentCatsList());
            setChildCatEmpty(false);
        } else {
            if (data) {
                setName(data.name);
                setSlug(data.slug);
            }
        }

        if (successModal) {
            dispatch(getChildCatsList());
        }
    }, [childCatEmpty, data, successModal]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(editChildCat(slug, name, parentCategoryId));

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenEditDialog(false);

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
            title: "Child Category Update with Success",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update Child Category</DialogTitle>
            <Divider />
            <DialogContent>
                {loadingUpdate && <Loader />}
                {errorUpdate && (
                    <Message variant="error">{errorUpdate}</Message>
                )}
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
                        </div>

                        <div className="form">
                            <div className="form__field">
                                <FormControl fullWidth>
                                    <InputLabel id="parentCat-simple-select-label">
                                        Select Parent Category (current "
                                        {data ? data.parentCat.name : "none"}
                                        ")
                                    </InputLabel>
                                    <Select
                                        labelId="parentCat-simple-select-label"
                                        id="parentCat-simple-select"
                                        value={parentCategoryId}
                                        onChange={(e) =>
                                            setParentCategoryId(e.target.value)
                                        }
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
                            Update Parent Category
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default UpdateChildCategoryScreen;
