import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogActions, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Moment from "react-moment";
import Swal from "sweetalert2";
import {
    getProductsList,
    deleteProduct,
    deleteProductImage,
} from "./../../../actions/productActions";
import AddProductScreen from "./AddProductScreen";
import UpdateProductScreen from "./UpdateProductScreen";
import Loader from "./../../../components/alert/Loader";
import Message from "./../../../components/alert/Message";
import StarRateIcon from "@material-ui/icons/StarRate";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddProductImageScreen from "./AddProductImageScreen";
import ReplaceProductImageScreen from './ReplaceProductImageScreen';

const useStyles = makeStyles((theme) => ({
    divider: {
        marginBottom: "20px",
        borderBottom: "1px solid #855C1B",
        paddingBottom: "10px",
        width: "30%",

        [theme.breakpoints.down("sm")]: {
            width: "90%",
            margin: "0 auto 20px auto",
        },

        color: "#855C1B",
        fontFamily: "Quicksand",
    },

    materialTable: {
        fontFamily: "Quicksand",
        fontWeight: "bold",
        color: "#388667",
    },

    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#388667",

        "&:hover": {
            backgroundColor: "#855C1B",
        },
    },
}));

const ProductsScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const user_perms = [];

    const [isAdmin, setIsAdmin] = useState(false);
    const [productIdImage, setProductIdImage] = useState(null);
    const [productId, setProductId] = useState(null);

    const [productReplaceImageId, setProductReplaceImageId] = useState(null);
    const [productReplaceProductId, setProductReplaceProductId] = useState(null);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddProductImageDialog, setOpenAddProductImageDialog] = useState(false);
    const [openReplaceDialog, setOpenReplaceDialog] = useState(false);

    const [requestData, setRequestData] = useState(new Date());

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;

    const productDelete = useSelector((state) => state.productDelete);
    const { loading: loadingDelete, success } = productDelete;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            if (!user_perms.includes("admin_view_products")) {
                history.push("/admin");

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
                    icon: "error",
                    title: "You don't have access to this page",
                });
            } else {
                setIsAdmin(true);
                dispatch(getProductsList());
            }
        }
    }, [dispatch, userInfo, requestData]);

    if (!Array.isArray(user_perms) || !user_perms.length) {
        userInfo.data.details[0].permissions.map((perm) =>
            user_perms.push(perm.name)
        );
    }

    const handleAddDialogOpen = (e) => {
        if (user_perms.includes("admin_add_products")) {
            setOpenAddDialog(true);
        } else {
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
                icon: "error",
                title: "You don't have access to this action",
            });
        }
    };

    const handleAddDialogClose = (e) => {
        setOpenAddDialog(false);
    };

    const handleEditDialogOpen = (id) => {
        if (user_perms.includes("admin_edit_products")) {
            setOpenEditDialog(true);
            setProductId(id);
        } else {
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
                icon: "error",
                title: "You don't have access to this action",
            });
        }
    };

    const handleEditDialogClose = (e) => {
        setOpenEditDialog(false);
    };

    const handleAddProductImageDialogOpen = (id, slug) => {
        if (user_perms.includes("admin_add_products")) {
            setOpenAddProductImageDialog(true);
            setProductIdImage(id);
            setProductId(slug);
        } else {
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
                icon: "error",
                title: "You don't have access to this action",
            });
        }
    };

    const handleAddProductImageDialogClose = (e) => {
        setOpenAddProductImageDialog(false);
    };

    const handleReplaceDialogOpen = (imageId, productId) => {
        if (user_perms.includes("admin_edit_products")) {
            setOpenReplaceDialog(true);
            setProductReplaceImageId(imageId);
            setProductReplaceProductId(productId);
        } else {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
        }
    };

    const handleReplaceDialogClose = (e) => {
        setOpenReplaceDialog(false);
    };

    const deleteProductHandler = (id) => {
        if (user_perms.includes("admin_delete_products")) {
            Swal.fire({
                title: "Are you sure?",
                text: `You can't recover this product after deletion!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                cancelButtonColor: "#d33",
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    dispatch(deleteProduct(id));
                    setRequestData(new Date());
                    Swal.fire(
                        "Deleted!",
                        "The product with the id " + id + " has been deleted.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire(
                        "Cancelled",
                        `The selected product is safe, don't worry :)`,
                        "error"
                    );
                }
            });
        } else {
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
                icon: "error",
                title: "You don't have access to this action",
            });
        }
    };

    const deleteProductImageHandler = (id) => {
        user_perms.includes("admin_delete_products")
            ? Swal.fire({
                  title: "Are you sure?",
                  text: "You can't recover this product image after deletion!",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Yes, delete it!",
                  cancelButtonText: "No, cancel!",
                  cancelButtonColor: "#d33",
                  reverseButtons: true,
              }).then((result) => {
                  if (result.value) {
                      dispatch(deleteProductImage(id));
                      setRequestData(new Date());
                      Swal.fire(
                          "Deleted!",
                          "The product image with the id " +
                              id +
                              " has been deleted.",
                          "success"
                      );
                  } else if (result.dismiss === Swal.DismissReason.cancel) {
                      Swal.fire(
                          "Cancelled",
                          `The selected product image is safe, don't worry :)`,
                          "error"
                      );
                  }
              })
            : Swal.fire(
                  "Sorry!",
                  `You don't have access to this action.`,
                  "warning"
              );
    };

    return (
        <Paper className="admin-content">
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader />
                </div>
            ) : (
                <>
                    <h2 className={classes.divider}>Products</h2>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialTable
                            title="Products List"
                            components={{
                                Container: (props) => (
                                    <Paper
                                        className={classes.materialTable}
                                        {...props}
                                    />
                                ),
                            }}
                            columns={[
                                {
                                    title: "Name",
                                    field: "name",
                                },
                                {
                                    title: "Added by",
                                    field: "user.name",
                                },
                                {
                                    title: "Product Code",
                                    field: "product_code",
                                },
                                {
                                    title: "Discount",
                                    field: "discount",
                                    render: (products) => {
                                        {
                                            return `${products.discount} %`;
                                        }
                                    },
                                },
                                {
                                    title: "Price",
                                    field: "price",
                                    render: (products) => {
                                        {
                                            return `${products.discount} €`;
                                        }
                                    },
                                },
                                {
                                    title: "Total Quantities",
                                    field: "total_quantities",
                                },
                                {
                                    title: "Reviews",
                                    field: "total_reviews",
                                },
                                {
                                    title: "Rating",
                                    field: "rating",
                                    render: (products) => {
                                        {
                                            return (
                                                <>
                                                    {products.rating}{" "}
                                                    <StarRateIcon />
                                                </>
                                            );
                                        }
                                    },
                                },
                                {
                                    title: "Updated At",
                                    field: "updated_at",
                                    render: (products) => {
                                        {
                                            return (
                                                <Moment format="DD/MM/YYYY HH:mm">
                                                    {products.created_at}
                                                </Moment>
                                            );
                                        }
                                    },
                                },
                            ]}
                            data={products && products.data}
                            actions={[
                                {
                                    icon: "add",
                                    tooltip: "Add Product",
                                    isFreeAction: true,
                                    onClick: (event) =>
                                        handleAddDialogOpen(event),
                                },
                                {
                                    icon: "photo",
                                    tooltip: "Add Product Image",
                                    onClick: (event, rowData) => {
                                        handleAddProductImageDialogOpen(
                                            rowData.id,
                                            rowData.slug
                                        );
                                    },
                                },
                                (rowData) => ({
                                    icon: "edit",
                                    tooltip: "Edit Product",
                                    onClick: (event, rowData) => {
                                        handleEditDialogOpen(rowData.slug);
                                    },
                                }),

                                (rowData) => ({
                                    icon: "delete",
                                    tooltip: "Delete Product",
                                    onClick: (event, rowData) => {
                                        deleteProductHandler(rowData.slug);
                                    },
                                }),
                            ]}
                            options={{
                                actionsColumnIndex: -1,
                                headerStyle: {
                                    color: "#855C1B",
                                    fontFamily: "Quicksand",
                                    fontSize: "1.2rem",
                                    backgroundColor: "#FDF7E9",
                                },
                            }}
                            detailPanel={(rowData) => {
                                return (
                                    <>
                                        <div className="table-detail">
                                            <div>
                                                <h2 className="table-detail--title">
                                                    Product Parent Category
                                                </h2>
                                                <div className="table-detail--par">
                                                    <h4>
                                                        {
                                                            rowData[
                                                                "parent_category"
                                                            ].name
                                                        }
                                                    </h4>
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className="table-detail--title">
                                                    Product Child Category
                                                </h2>
                                                <div className="table-detail--par">
                                                    <h4>
                                                        {
                                                            rowData[
                                                                "child_category"
                                                            ].name
                                                        }
                                                    </h4>
                                                </div>
                                            </div>
                                            <div>
                                                <h2 className="table-detail--title">
                                                    Product Description
                                                </h2>
                                                <div className="table-detail--par">
                                                    <p>{rowData.description}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h2 className="table-detail--title">
                                                    Product Images
                                                </h2>
                                                <div className="table-detail--par">
                                                    {rowData.images &&
                                                        rowData.images.map(
                                                            (image) => {
                                                                return (
                                                                    <div
                                                                        className="product__table-image"
                                                                        key={
                                                                            image.id
                                                                        }
                                                                    >
                                                                        <img
                                                                            className="product__table-image--img"
                                                                            src={`http://127.0.0.1:8000/storage/${image.path}`}
                                                                            alt={
                                                                                rowData.name
                                                                            }
                                                                        />

                                                                        <hr className="product__table-hr" />

                                                                        <div className="product__table-image--btns">
                                                                            <Button
                                                                                variant="outlined"
                                                                                startIcon={
                                                                                    <EditIcon />
                                                                                }
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleReplaceDialogOpen(
                                                                                        image.id,
                                                                                        image.product_id
                                                                                    )
                                                                                }
                                                                            >
                                                                                Replace
                                                                                Image
                                                                            </Button>
                                                                            <Button
                                                                                variant="outlined"
                                                                                color="secondary"
                                                                                startIcon={
                                                                                    <DeleteIcon />
                                                                                }
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    deleteProductImageHandler(
                                                                                        image.id
                                                                                    )
                                                                                }
                                                                            >
                                                                                Delete
                                                                                Image
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            }}
                        />
                    )}

                    <Dialog
                        open={openEditDialog}
                        aria-labelledby="draggable-dialog-title"
                        onClose={handleEditDialogClose}
                        fullWidth
                        disableScrollLock={true}
                    >
                        <UpdateProductScreen
                            setOpenEditDialog={setOpenEditDialog}
                            setRequestData={setRequestData}
                            productId={productId}
                        />

                        <DialogActions>
                            <Button
                                onClick={handleEditDialogClose}
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openAddDialog}
                        aria-labelledby="draggable-dialog-title"
                        onClose={handleAddDialogClose}
                        fullWidth
                        disableScrollLock={true}
                    >
                        <AddProductScreen
                            setOpenAddDialog={setOpenAddDialog}
                            setRequestData={setRequestData}
                        />

                        <DialogActions>
                            <Button
                                onClick={handleAddDialogClose}
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openAddProductImageDialog}
                        aria-labelledby="draggable-dialog-title"
                        onClose={handleAddProductImageDialogClose}
                        fullWidth
                    >
                        <AddProductImageScreen
                            setOpenAddProductImageDialog={
                                setOpenAddProductImageDialog
                            }
                            setRequestData={setRequestData}
                            productIdImage={productIdImage}
                            productId={productId}
                        />

                        <DialogActions>
                            <Button
                                onClick={handleAddProductImageDialogClose}
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        open={openReplaceDialog}
                        aria-labelledby="draggable-dialog-title"
                        onClose={handleReplaceDialogClose}
                        fullWidth
                    >
                        <ReplaceProductImageScreen
                            setOpenReplaceDialog={setOpenReplaceDialog}
                            setRequestData={setRequestData}
                            productReplaceImageId={productReplaceImageId && productReplaceImageId}
                            productReplaceProductId={productReplaceImageId && productReplaceProductId}
                        />

                        <DialogActions>
                            <Button
                                onClick={handleReplaceDialogClose}
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Paper>
    );
};

export default ProductsScreen;
