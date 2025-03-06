import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
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
} from "@mui/material";
import Swal from "sweetalert2";
import {AppDispatch, RootState} from "@/store";
import {
    createChildCategory,
    fetchAdminChildCategories
} from "@/features/categories/childCategorySlice";
import {
    fetchParentCategories,
    ParentCategory,
    resetParentCategoryState
} from "@/features/categories/parentCategorySlice";
import {StyledButton} from "@/styles/muiStyles";

interface AddChildCategoryScreenProps {
    onClose: () => void;
}

const AddChildCategoryScreen: React.FC<AddChildCategoryScreenProps> = ({onClose}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState("");
    const [parentCategoryId, setParentCategoryId] = useState("");
    const {addChildCategorySuccess} = useSelector((state: RootState) => state.childCategory);

    const {parentCategories, success} = useSelector((state: RootState) => state.parentCategory);

    useEffect(() => {
        if (!success) {
            dispatch(fetchParentCategories());
        }
    }, [dispatch, success]);

    useEffect(() => {
        if (addChildCategorySuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Child Category created successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(resetParentCategoryState());
            dispatch(fetchAdminChildCategories());
        }
    }, [dispatch, onClose, addChildCategorySuccess]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(createChildCategory({name, parentCategoryId}));
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Add Child Category</DialogTitle>
            <Divider/>
            <DialogContent>
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
                                    value={parentCategoryId}
                                    onChange={(e) =>
                                        setParentCategoryId(e.target.value)
                                    }
                                    required
                                >
                                    {parentCategories &&
                                        parentCategories.map((parentCategory: ParentCategory) => (
                                            <MenuItem
                                                key={parentCategory.id}
                                                value={parentCategory.id}
                                            >
                                                {parentCategory.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>

                    <StyledButton
                        variant="contained"
                        color="primary"
                        value="submit"
                        type="submit"
                        fullWidth
                    >
                        Add Child Category
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default AddChildCategoryScreen;
