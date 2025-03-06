import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    TextField,
    Divider,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import Swal from "sweetalert2";
import {AppDispatch, RootState} from "@/store";
import {
    createParentCategory,
    fetchAdminParentCategories
} from "@/features/categories/parentCategorySlice";
import {StyledButton} from "@/styles/muiStyles";

interface AddParentCategoryScreenProps {
    onClose: () => void;
}

const AddParentCategoryScreen: React.FC<AddParentCategoryScreenProps> = ({onClose}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState("");
    const {addParentCategorySuccess} = useSelector((state: RootState) => state.parentCategory);

    useEffect(() => {
        if (addParentCategorySuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Parent Category created successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(fetchAdminParentCategories());
        }
    }, [dispatch, onClose, addParentCategorySuccess]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(createParentCategory({name}));
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Add Parent Category</DialogTitle>
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
                        Add Parent Category
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default AddParentCategoryScreen;
