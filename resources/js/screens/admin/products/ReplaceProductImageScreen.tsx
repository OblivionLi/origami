import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Divider, DialogContent, DialogTitle, Button} from "@mui/material";
import Swal from "sweetalert2";
import {fetchAdminProductsList, ProductImage, replaceProductImage} from "@/features/product/productSlice";
import {AppDispatch, RootState} from "@/store";
import {StyledButton} from "@/styles/muiStyles";
import ClearIcon from "@mui/icons-material/Clear";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";

interface ReplaceProductImageScreenProps {
    onClose: () => void;
    imageData: ProductImage | null;
}

const ReplaceProductImageScreen: React.FC<ReplaceProductImageScreenProps> = ({onClose, imageData}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [image, setImage] = useState<File | null>(null);
    const {editProductImageSuccess} = useSelector((state: RootState) => state.product);

    useEffect(() => {
        if (editProductImageSuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Image replaced successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(fetchAdminProductsList());
        }
    }, [editProductImageSuccess]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        if (image) {
            formData.append("image", image);
        }

        dispatch(replaceProductImage({imageId: imageData?.id, formData}));
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">
                Replace Product Image
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
                        Replace Product Image
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default ReplaceProductImageScreen;
