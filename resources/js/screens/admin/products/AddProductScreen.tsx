import React, {useEffect, useState, createRef, useCallback, useRef} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Divider,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import Swal from "sweetalert2";
import {AppDispatch, RootState} from "@/store";
import {createProduct, fetchAdminProductsList} from "@/features/product/productSlice";
import {StyledButton} from "@/styles/muiStyles";
import {NumericFormat} from "react-number-format";
import {fetchChildCategories} from "@/features/categories/childCategorySlice";

interface AddProductScreenProps {
    onClose: () => void;
}

const AddProductScreen: React.FC<AddProductScreenProps> = ({ onClose }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState("");
    const [childCategoryId, setChildCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("");
    const [isSpecialOffer, setIsSpecialOffer] = useState(0);
    const [productCode, setProductCode] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {addProductSuccess} = useSelector((state: RootState) => state.product);

    const {
        childCategories
    } = useSelector((state: RootState) => state.childCategory);

    const handleSpecialOfferCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSpecialOffer(e.target.checked ? 1 : 0);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files).slice(0, 5);
            setImages(selectedFiles);
        }
    };

    useEffect(() => {
        dispatch(fetchChildCategories());
    }, [dispatch]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("product_code", productCode);
        formData.append("special_offer", String(isSpecialOffer));
        formData.append("price", price);
        formData.append("discount", discount);
        formData.append("description", description);
        formData.append("child_category_id", childCategoryId);

        images.forEach((file, index) => {
            formData.append(`images[]`, file);
        });

        dispatch(createProduct({formData}));
    };

    useEffect(() => {
        if (addProductSuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Product updated successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(fetchAdminProductsList());
        }
    }, [addProductSuccess, onClose, dispatch]);

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Add Product</DialogTitle>
            <Divider />
            <DialogContent>
                    <form onSubmit={submitHandler}>
                        <div className="form">
                            <div className="form__field">
                                <FormControl fullWidth>
                                    <InputLabel id="childCat-simple-select-label">
                                        Select Child Category
                                    </InputLabel>
                                    <Select
                                        labelId="childCat-simple-select-label"
                                        id="childCat-simple-select"
                                        value={childCategoryId}
                                        onChange={(e) =>
                                            setChildCategoryId(e.target.value)
                                        }
                                    >
                                        {childCategories &&
                                            childCategories.map((child) => (
                                                <MenuItem
                                                    key={child.id}
                                                    value={child.id}
                                                >
                                                    {child.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </div>

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
                                <TextField
                                    variant="outlined"
                                    name="productCode"
                                    label="Product Code"
                                    fullWidth
                                    value={productCode}
                                    onChange={(e) =>
                                        setProductCode(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form__field">
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                        Is this product a special offer?
                                    </FormLabel>
                                    <FormGroup row>
                                        <div className="form__field--checkboxes">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        style={{
                                                            color: "#388667",
                                                        }}
                                                        checked={!!isSpecialOffer}
                                                        onChange={handleSpecialOfferCheckbox}
                                                    />
                                                }
                                                label="Special Offer?"
                                                name="isSpecialOffer"
                                            />
                                        </div>
                                    </FormGroup>
                                </FormControl>
                            </div>

                            <div className="form__field">
                                <TextField
                                    variant="outlined"
                                    name="discount"
                                    label="Discount %"
                                    fullWidth
                                    value={discount}
                                    type="number"
                                    onChange={(e) =>
                                        setDiscount(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form__field">
                                <NumericFormat
                                    variant="outlined"
                                    name="price"
                                    label="Price €"
                                    fullWidth
                                    customInput={TextField}
                                    decimalScale={2}
                                    thousandSeparator={true}
                                    prefix={'€'}
                                    onValueChange={(values) => setPrice(values.floatValue?.toString() || "")}
                                    required
                                />
                            </div>

                            <div className="form__field">
                                <TextField
                                    variant="outlined"
                                    name="description"
                                    label="Product Description"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="form__field">
                                <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleFileUpload} hidden />
                                <Button variant="contained" onClick={() => fileInputRef.current?.click()}>Upload Images</Button>
                                <div>
                                    {images.map((file, index) => (
                                        <p key={index}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <StyledButton
                            variant="contained"
                            color="primary"
                            value="submit"
                            type="submit"
                            fullWidth
                        >
                            Add Product
                        </StyledButton>
                    </form>
            </DialogContent>
        </>
    );
};

export default AddProductScreen;
