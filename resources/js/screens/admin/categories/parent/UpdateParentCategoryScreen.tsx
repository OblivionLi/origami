import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    TextField,
    Divider,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import Swal from "sweetalert2";
import {fetchParentCategories, ParentCategory, updateParentCategory} from "@/features/categories/parentCategorySlice";
import {AppDispatch, RootState} from "@/store";
import {StyledButton} from "@/styles/muiStyles";

interface UpdateParentCategoryScreenProps {
    onClose: () => void;
    parentCategoryData: ParentCategory | null;
}

const UpdateParentCategoryScreen: React.FC<UpdateParentCategoryScreenProps> = ({onClose, parentCategoryData}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState<string | undefined>("");
    const {editParentCategorySuccess} = useSelector((state: RootState) => state.parentCategory);

    useEffect(() => {
        if (!parentCategoryData) {
            onClose();
        }

        setName(parentCategoryData?.name);

    }, [parentCategoryData]);


    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(updateParentCategory({id: parentCategoryData?.id, name}));
    };

    useEffect(() => {
        if (editParentCategorySuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Parent Category updated successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(fetchParentCategories());
        }
    }, [editParentCategorySuccess, onClose, dispatch]);

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update Parent Category</DialogTitle>
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

export default UpdateParentCategoryScreen;
