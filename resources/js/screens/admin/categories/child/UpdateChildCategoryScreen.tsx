import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    TextField,
    Divider,
    DialogContent,
    DialogTitle,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from "@mui/material";
import Swal from "sweetalert2";
import {fetchParentCategories, ParentCategory} from "@/features/categories/parentCategorySlice";
import {ChildCategorySlice, fetchChildCategories, updateChildCategory} from "@/features/categories/childCategorySlice";
import {AppDispatch, RootState} from "@/store";
import {StyledButton} from "@/styles/muiStyles";

interface UpdateChildCategoryScreenProps {
    onClose: () => void;
    childCategoryData: ChildCategorySlice | null;
}

const UpdateChildCategoryScreen: React.FC<UpdateChildCategoryScreenProps> = ({onClose, childCategoryData}) => {
    const dispatch = useDispatch<AppDispatch>();

    console.log(childCategoryData);

    const [name, setName] = useState<string | undefined>("");
    const [parentCategoryId, setParentCategoryId] = useState<string | undefined>();
    const {editChildCategorySuccess} = useSelector((state: RootState) => state.childCategory);
    const {parentCategories} = useSelector((state: RootState) => state.parentCategory);

    useEffect(() => {
        if (!parentCategories || parentCategories.length === 0) {
            dispatch(fetchParentCategories());
        }

        setName(childCategoryData?.name);
        setParentCategoryId(childCategoryData?.parentCategory?.id.toString());
    }, [parentCategories, dispatch]);

    useEffect(() => {
        if (editChildCategorySuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Child Category updated successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(fetchChildCategories());
        }
    }, [editChildCategorySuccess, onClose, dispatch]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(updateChildCategory({id: childCategoryData?.id, name, parentCategoryId}));
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">
                Update Child Category
            </DialogTitle>
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
                                <InputLabel id="parentCat-simple-select-label">
                                    Select Parent Category
                                    {childCategoryData?.parentCategory?.name &&
                                        ` (current "${childCategoryData.parentCategory.name}")`}
                                </InputLabel>
                                <Select
                                    labelId="parentCat-simple-select-label"
                                    id="parentCat-simple-select"
                                    value={parentCategoryId}
                                    onChange={(e) =>
                                        setParentCategoryId(e.target.value)
                                    }
                                >
                                    {parentCategories &&
                                        parentCategories.map((parentCategory: ParentCategory) => (
                                            <MenuItem
                                                key={parentCategory.id}
                                                value={parentCategory.id.toString()}
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
                        Update Parent Category
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default UpdateChildCategoryScreen;
