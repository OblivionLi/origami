import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    TextField,
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
    Checkbox
} from "@mui/material";
import Swal from "sweetalert2";
import {AdminProduct, fetchAdminProductsList, updateProduct} from "@/features/product/productSlice";
import {AppDispatch, RootState} from "@/store";
import {StyledButton} from "@/styles/muiStyles";
import {fetchChildCategories} from "@/features/categories/childCategorySlice";
import {NumericFormat} from "react-number-format";

interface UpdateProductScreenProps {
    onClose: () => void;
    productData: AdminProduct | null;
}

const UpdateProductScreen: React.FC<UpdateProductScreenProps> = ({onClose, productData}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [childCategoryId, setChildCategoryId] = useState<number | undefined>(0);
    const [name, setName] = useState<string | undefined>("");
    const [productCode, setProductCode] = useState<string | undefined>("");
    const [price, setPrice] = useState<number | undefined>(0);
    const [discount, setDiscount] = useState<number | undefined>(0);
    const [description, setDescription] = useState<string | undefined>("");
    const [isSpecialOffer, setIsSpecialOffer] = useState<number | undefined>(0);
    const [qty, setQty] = useState<number | undefined>(0);
    const {editProductSuccess} = useSelector((state: RootState) => state.product);

    const {
        childCategories
    } = useSelector((state: RootState) => state.childCategory);

    useEffect(() => {
        if (!productData) {
            onClose();
            return;
        }

        setChildCategoryId(productData?.childCategory?.id);
        setName(productData?.name);
        setProductCode(productData?.product_code);
        setPrice(productData?.price);
        setDiscount(productData?.discount);
        setDescription(productData?.description);
        setIsSpecialOffer(productData?.special_offer);
        setQty(productData?.total_quantities)

        dispatch(fetchChildCategories());
    }, [productData, dispatch, onClose]);

    const handleSpecialOfferCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSpecialOffer(e.target.checked ? 1 : 0);
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(
            updateProduct(
                {
                    id: productData?.id,
                    child_category_id: childCategoryId,
                    name,
                    product_code: productCode,
                    price,
                    discount,
                    description,
                    special_offer: isSpecialOffer,
                    total_quantities: qty
                }
            )
        );

        Swal.mixin({
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
    };

    useEffect(() => {
        if (editProductSuccess) {
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
    }, [editProductSuccess, onClose, dispatch]);

    return (
        <>
            <DialogTitle id="draggable-dialog-title">
                Update Product
            </DialogTitle>
            <Divider/>
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
                                        setChildCategoryId(parseInt(e.target.value))
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
                                                    checked={isSpecialOffer === 1}
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
                                    setDiscount(parseFloat(e.target.value))
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
                                value={price}
                                onValueChange={(values) => {
                                    setPrice(values.floatValue);
                                }}
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
                            <TextField
                                variant="outlined"
                                name="qty"
                                label="Quantity"
                                fullWidth
                                value={qty}
                                type="number"
                                onChange={(e) => setQty(parseInt(e.target.value))}
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
                        Update Product
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default UpdateProductScreen;
