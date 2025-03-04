import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Divider, DialogContent, DialogTitle} from "@mui/material";
import Swal from "sweetalert2";
import {AppDispatch, RootState} from "@/store";
import {createProductImage, fetchAdminProductsList} from "@/features/product/productSlice";
import {StyledButton} from "@/styles/muiStyles";
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';
import ClearIcon from '@mui/icons-material/Clear';

interface AddProductImageScreenProps {
    onClose: () => void;
    productId: number;
}

const AddProductImageScreen: React.FC<AddProductImageScreenProps> = ({onClose, productId}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [image, setImage] = useState<File | null>(null);
    const {addProductImageSuccess} = useSelector((state: RootState) => state.product);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        if (image) {
            formData.append("image", image);
        }

        dispatch(createProductImage({productId, formData}));
    };

    useEffect(() => {
        if (addProductImageSuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Image created successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(fetchAdminProductsList());
        }
    }, [addProductImageSuccess]);

    return (
        <>
            <DialogTitle id="draggable-dialog-title">
                Add Product Image
            </DialogTitle>
            <Divider/>
            <DialogContent>
                <form onSubmit={submitHandler}>
                    <div className="form">
                        <div className="form__field">
                            <input
                                id="contained-button-file"
                                type="file"
                                className="form__field--upl"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setImage(e.target.files[0]);
                                    }
                                }}
                            />

                            <label htmlFor="contained-button-file">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component="span"
                                    startIcon={<PhotoCameraBackIcon/>}
                                >
                                    Upload new Product Image (max filesize: 5mb)
                                </Button>
                            </label>

                            <p>{image ? image.name : <ClearIcon/>}</p>
                        </div>
                    </div>

                    <StyledButton
                        variant="contained"
                        color="primary"
                        value="submit"
                        type="submit"
                        fullWidth
                    >
                        Add Product Image
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default AddProductImageScreen;
