import React, { useEffect, useState, createRef, useCallback } from "react";
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
import NumberFormat from "react-number-format";
import Dropzone from "react-dropzone";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {AppDispatch} from "@/store";

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
    const [successModal, setSuccessModal] = useState(false);
    const [images, setImages] = useState();
    const dropzoneRef = createRef();
    const [isChildCatEmpty, setIsChildCatEmpty] = useState(true);

    const productStore = useSelector((state) => state.productStore);
    const { loading, success, error } = productStore;

    const childCatList = useSelector((state) => state.childCatList);
    const { childCats } = childCatList;

    useEffect(() => {
        if (successModal && success) {
            dispatch({ type: PRODUCT_LIST_RESET });
            dispatch(getProductsList());
        }

        if (isChildCatEmpty) {
            dispatch(getChildCatsList());
            setIsChildCatEmpty(false);
        }
    }, [dispatch, isChildCatEmpty, success, successModal]);

    const openDialog = () => {
        // Note that the ref is set async,
        // so it might be null at some point
        if (dropzoneRef.current) {
            dropzoneRef.current.open();
        }
    };

    const handleImages = (acceptedFiles) => {
        setImages(acceptedFiles);
    };

    const handleSpecialOfferCheckbox = (e) => {
        let isSpecialOffer;
        e.target.checked ? (isSpecialOffer = 1) : (isSpecialOffer = 0);
        setIsSpecialOffer(isSpecialOffer);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("product_code", productCode);
        formData.append("special_offer", isSpecialOffer);
        formData.append("price", price);
        formData.append("discount", discount);
        formData.append("description", description);
        formData.append("child_category_id", childCategoryId);

        if (images) {
            for (let i = 0; i < images.length; i++) {
                formData.append(`images[${i}]`, images[i]);
            }
        }

        dispatch(createProduct(formData));

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenAddDialog(false);

        Swal.fire({
            position: "center",
            icon: "success",
            title: `Product created successfully`,
            showConfirmButton: false,
            timer: 2500,
            width: "65rem",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Add Product</DialogTitle>
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
                                        {childCats.data &&
                                            childCats.data.map((child) => (
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
                                    <FormGroup
                                        row
                                        onChange={handleSpecialOfferCheckbox}
                                    >
                                        <div className="form__field--checkboxes">
                                            <FormControlLabel
                                                value={isSpecialOffer}
                                                control={
                                                    <Checkbox
                                                        style={{
                                                            color: "#388667",
                                                        }}
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
                                <NumberFormat
                                    variant="outlined"
                                    name="price"
                                    label="Price €"
                                    fullWidth
                                    customInput={TextField}
                                    decimalScale={2}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    renderText={(formattedValue) => (
                                        <Text>{formattedValue}</Text>
                                    )}
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
                                <Dropzone
                                    ref={dropzoneRef}
                                    noClick
                                    noKeyboard
                                    onDrop={handleImages}
                                >
                                    {({
                                        getRootProps,
                                        getInputProps,
                                        acceptedFiles,
                                    }) => {
                                        return (
                                            <div className="drop">
                                                <div
                                                    {...getRootProps({
                                                        className: "dropzone",
                                                    })}
                                                >
                                                    <input
                                                        {...getInputProps()}
                                                    />
                                                    <p>
                                                        Drag and drop the
                                                        product images here
                                                    </p>
                                                    <Button
                                                        variant="contained"
                                                        type="button"
                                                        onClick={openDialog}
                                                    >
                                                        Open File Dialog
                                                    </Button>
                                                </div>
                                                <aside>
                                                    <h4>Files</h4>
                                                    <ul>
                                                        {acceptedFiles.map(
                                                            (file) => (
                                                                <li
                                                                    key={
                                                                        file.path
                                                                    }
                                                                >
                                                                    {file.path}{" "}
                                                                    -{" "}
                                                                    {file.size}{" "}
                                                                    bytes
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </aside>
                                            </div>
                                        );
                                    }}
                                </Dropzone>
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
                            Add Product
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default AddProductScreen;
