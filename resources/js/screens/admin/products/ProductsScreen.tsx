import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, DialogActions, Paper} from "@mui/material";
import Swal from "sweetalert2";
import UpdateProductScreen from "./UpdateProductScreen";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {Link, useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "@/store";
import {getUserRolesPermissions} from "@/features/user/userSlice";
import {
    AdminProduct,
    deleteProduct,
    fetchAdminProductsList,
    resetAddProductImageSuccess,
    resetAddProductSuccess,
    resetEditProductSuccess
} from "@/features/product/productSlice";
import {StyledButton, StyledDivider} from "@/styles/muiStyles";
import {MaterialReactTable, MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {format} from "date-fns";
import {ListItemIcon, MenuItem} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProductImageScreen from "@/screens/admin/products/AddProductImageScreen";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';

interface ProductsScreenProps {
}

const ProductsScreen: React.FC<ProductsScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [productId, setProductId] = useState<number>(0);

    const [productReplaceImageId, setProductReplaceImageId] = useState(null);
    const [productReplaceProductId, setProductReplaceProductId] =
        useState(null);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [productToBeEdited, setProductToBeEdited] = useState<AdminProduct | null>(null);

    const [openAddProductImageDialog, setOpenAddProductImageDialog] = useState(false);
    const [openReplaceDialog, setOpenReplaceDialog] = useState(false);

    const {
        userInfo,
        userPermissions,
    } = useSelector((state: RootState) => state.user);

    const {
        adminProductsList,
        loading,
        error,
    } = useSelector((state: RootState) => state.product);

    useEffect(() => {
        if (!userInfo || userInfo?.data?.is_admin != 1) {
            navigate("/login");
        } else {
            setIsAdmin(true);
            dispatch(fetchAdminProductsList());
        }
    }, [dispatch, userInfo, navigate]);

    useEffect(() => {
        if (!userPermissions || userPermissions?.length === 0) {
            dispatch(getUserRolesPermissions({id: userInfo?.data?.id}));
        }
    }, [dispatch, userPermissions]);

    useEffect(() => {
        if (userPermissions && !userPermissions?.includes('admin_view_products')) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );

            navigate('/admin');
        }
    }, [dispatch, userPermissions]);

    const handleAddDialogOpen = useCallback(() => {
        if (userPermissions?.includes("admin_create_products")) {
            setOpenAddDialog(true);
        } else {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
        }
    }, [userPermissions]);

    const handleAddDialogClose = useCallback(() => {
        setOpenAddDialog(false);
        dispatch(resetAddProductSuccess());
    }, []);

    const handleEditDialogOpen = useCallback((product: any) => {
        if (userPermissions?.includes("admin_edit_products")) {
            setProductToBeEdited(product);
            setOpenEditDialog(true);
        } else {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
        }
    }, [userPermissions]);

    const handleEditDialogClose = useCallback(() => {
        setOpenEditDialog(false);
        setProductToBeEdited(null);
        dispatch(resetEditProductSuccess());
    }, []);

    const handleAddProductImageDialogOpen = useCallback((productId: number) => {
        if (userPermissions?.includes("admin_create_productimages")) {
            setProductId(productId);
            setOpenAddProductImageDialog(true);
        } else {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
        }
    }, [userPermissions]);

    const handleAddProductImageDialogClose = useCallback(() => {
        setOpenAddProductImageDialog(false);
        dispatch(resetAddProductImageSuccess())
    }, []);


    // const handleReplaceDialogOpen = (imageId, productId) => {
    //     if (user_perms.includes("admin_edit_products")) {
    //         setOpenReplaceDialog(true);
    //         setProductReplaceImageId(imageId);
    //         setProductReplaceProductId(productId);
    //     } else {
    //         Swal.fire(
    //             "Sorry!",
    //             `You don't have access to this action.`,
    //             "warning"
    //         );
    //     }
    // };
    //
    // const handleReplaceDialogClose = (e) => {
    //     setOpenReplaceDialog(false);
    // };

    const deleteProductHandler = (id: number) => {
        if (!userPermissions?.includes("admin_delete_products")) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
            return;
        }

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
                dispatch(deleteProduct({id}));
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
    };

    // const deleteProductImageHandler = (id) => {
    //     user_perms.includes("admin_delete_products")
    //         ? Swal.fire({
    //             title: "Are you sure?",
    //             text: "You can't recover this product image after deletion!",
    //             icon: "warning",
    //             showCancelButton: true,
    //             confirmButtonText: "Yes, delete it!",
    //             cancelButtonText: "No, cancel!",
    //             cancelButtonColor: "#d33",
    //             reverseButtons: true,
    //         }).then((result) => {
    //             if (result.value) {
    //                 dispatch(deleteProductImage(id));
    //                 setRequestData(new Date());
    //                 Swal.fire(
    //                     "Deleted!",
    //                     "The product image with the id " +
    //                     id +
    //                     " has been deleted.",
    //                     "success"
    //                 );
    //             } else if (result.dismiss === Swal.DismissReason.cancel) {
    //                 Swal.fire(
    //                     "Cancelled",
    //                     `The selected product image is safe, don't worry :)`,
    //                     "error"
    //                 );
    //             }
    //         })
    //         : Swal.fire(
    //             "Sorry!",
    //             `You don't have access to this action.`,
    //             "warning"
    //         );
    // };

    const columns = useMemo<MRT_ColumnDef<AdminProduct, unknown>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: 150,
                Cell: ({cell}) => {
                    const product = cell.row.original;

                    return <Link
                        to={`/product/${product.slug}`}
                        style={{
                            color: "#855C1B",
                            fontWeight: "600",
                            textDecoration: "none",
                            transition: "color 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#388667")}
                        onMouseLeave={(e) => (e.target.style.color = "#855C1B")}
                    >
                        {product.name}
                    </Link>
                }
            },
            {
                accessorKey: 'user.name',
                header: 'Added by',
                size: 150,
            },
            {
                accessorKey: 'product_code',
                header: 'Product Code',
                size: 150,
            },
            {
                accessorKey: 'discount',
                header: 'Discount',
                size: 150,
                Cell: ({cell}) => {
                    const discount = cell.getValue<string>();

                    return <span>{`${discount} %`}</span>
                }
            },
            {
                accessorKey: 'price',
                header: 'Price',
                size: 150,
                Cell: ({cell}) => {
                    const price = cell.getValue<string>();

                    return <span>{`${price} €`}</span>
                }
            },
            {
                accessorKey: 'total_quantities',
                header: 'Stock',
                size: 150,
            },
            {
                accessorKey: 'reviews_count',
                header: 'Reviews',
                size: 150,
            },
            {
                accessorKey: 'rating',
                header: 'Rating',
                size: 150,
                Cell: ({cell}) => {
                    const rating = cell.getValue<string>();

                    return <span>{rating} {" "} <StarIcon/></span>
                }
            },
            {
                accessorKey: 'created_at',
                header: 'Created At',
                size: 150,
                Cell: ({cell}) => {
                    const createdAt = cell.getValue<string>();

                    if (!createdAt) {
                        return <span>"--/--/---- --/--"</span>;
                    }

                    return <span>{format(new Date(createdAt), 'dd/MM/yyyy HH:mm')}</span>
                }
            },
            {
                accessorKey: 'updated_at',
                header: 'Updated At',
                size: 150,
                Cell: ({cell}) => {
                    const updated_at = cell.getValue<string>();

                    if (!updated_at) {
                        return <span>"--/--/---- --/--"</span>;
                    }

                    return <span>{format(new Date(updated_at), 'dd/MM/yyyy HH:mm')}</span>
                }
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: adminProductsList || [],
        enableRowActions: true,
        enableExpanding: true,
        positionActionsColumn: 'last',
        renderTopToolbarCustomActions: () => (
            <StyledButton
                variant="contained"
                onClick={handleAddDialogOpen}
                sx={{marginLeft: '10px'}}
            >
                Add Product
            </StyledButton>
        ),
        renderRowActionMenuItems: ({row, closeMenu}) => [
            <MenuItem
                key={0}
                onClick={() => {
                    handleEditDialogOpen(row.original)
                    closeMenu();
                }}
                sx={{m: 0}}
            >
                <ListItemIcon>
                    <EditIcon/>
                </ListItemIcon>
                Edit
            </MenuItem>,
            <MenuItem
                key={1}
                onClick={() => {
                    deleteProductHandler(row.original.id!)
                    closeMenu();
                }}
                sx={{m: 0}}
            >
                <ListItemIcon>
                    <DeleteIcon/>
                </ListItemIcon>
                Delete
            </MenuItem>,
            <MenuItem
                key={2}
                onClick={() => {
                    handleAddProductImageDialogOpen(row.original.id!)
                    closeMenu();
                }}
                sx={{m: 0}}
            >
                <ListItemIcon>
                    <AddAPhotoIcon/>
                </ListItemIcon>
                Add Product Image
            </MenuItem>,
        ],
    });

    return (
        <Paper className="admin-content">
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader/>
                </div>
            ) : (
                <>
                    <StyledDivider>Products</StyledDivider>
                    {loading ? (
                        <Loader/>
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialReactTable table={table}/>
                        // <MaterialTable
                        //     title="Products List"
                        //     components={{
                        //         Container: (props) => (
                        //             <Paper
                        //                 className={classes.materialTable}
                        //                 {...props}
                        //             />
                        //         ),
                        //     }}
                        //     columns={[
                        //         {
                        //             title: "Name",
                        //             field: "name",
                        //             render: (products) => {
                        //                 return (
                        //                     <Link
                        //                         to={`/product/${products.slug}`}
                        //                         className={classes.link}
                        //                         target="_blank"
                        //                     >
                        //                         {products.name}
                        //                     </Link>
                        //                 );
                        //             },
                        //         },
                        //         {
                        //             title: "Added by",
                        //             field: "user.name",
                        //         },
                        //         {
                        //             title: "Product Code",
                        //             field: "product_code",
                        //         },
                        //         {
                        //             title: "Discount",
                        //             field: "discount",
                        //             render: (products) => {
                        //                 return `${products.discount} %`;
                        //             },
                        //         },
                        //         {
                        //             title: "Price",
                        //             field: "price",
                        //             render: (products) => {
                        //                 return `${products.discount} €`;
                        //             },
                        //         },
                        //         {
                        //             title: "Total Quantities",
                        //             field: "total_quantities",
                        //         },
                        //         {
                        //             title: "Reviews",
                        //             field: "total_reviews",
                        //         },
                        //         {
                        //             title: "Rating",
                        //             field: "rating",
                        //             render: (products) => {
                        //                 return (
                        //                     <>
                        //                         {products.rating}{" "}
                        //                         <StarRateIcon/>
                        //                     </>
                        //                 );
                        //             },
                        //         },
                        //         {
                        //             title: "Updated At",
                        //             field: "updated_at",
                        //             render: (products) => {
                        //                 return (
                        //                     <Moment format="DD/MM/YYYY HH:mm">
                        //                         {products.created_at}
                        //                     </Moment>
                        //                 );
                        //             },
                        //         },
                        //     ]}
                        //     data={products && products.data}
                        //     actions={[
                        //         {
                        //             icon: "add",
                        //             tooltip: "Add Product",
                        //             isFreeAction: true,
                        //             onClick: (event) =>
                        //                 handleAddDialogOpen(event),
                        //         },
                        //         {
                        //             icon: "photo",
                        //             tooltip: "Add Product Image",
                        //             onClick: (event, rowData) => {
                        //                 handleAddProductImageDialogOpen(
                        //                     rowData.id,
                        //                     rowData.slug
                        //                 );
                        //             },
                        //         },
                        //         (rowData) => ({
                        //             icon: "edit",
                        //             tooltip: "Edit Product",
                        //             onClick: (event, rowData) => {
                        //                 handleEditDialogOpen(rowData.slug);
                        //             },
                        //         }),
                        //
                        //         (rowData) => ({
                        //             icon: "delete",
                        //             tooltip: "Delete Product",
                        //             onClick: (event, rowData) => {
                        //                 deleteProductHandler(rowData.slug);
                        //             },
                        //         }),
                        //     ]}
                        //     options={{
                        //         actionsColumnIndex: -1,
                        //         headerStyle: {
                        //             color: "#855C1B",
                        //             fontFamily: "Quicksand",
                        //             fontSize: "1.2rem",
                        //             backgroundColor: "#FDF7E9",
                        //         },
                        //     }}
                        //     detailPanel={(rowData) => {
                        //         return (
                        //             <>
                        //                 <div className="table-detail">
                        //                     <div>
                        //                         <h2 className="table-detail--title">
                        //                             Product Parent Category
                        //                         </h2>
                        //                         <div className="table-detail--par">
                        //                             <h4>
                        //                                 {
                        //                                     rowData[
                        //                                         "parent_category"
                        //                                         ].name
                        //                                 }
                        //                             </h4>
                        //                         </div>
                        //                     </div>
                        //                     <div>
                        //                         <h2 className="table-detail--title">
                        //                             Product Child Category
                        //                         </h2>
                        //                         <div className="table-detail--par">
                        //                             <h4>
                        //                                 {
                        //                                     rowData[
                        //                                         "child_category"
                        //                                         ].name
                        //                                 }
                        //                             </h4>
                        //                         </div>
                        //                     </div>
                        //                     <div>
                        //                         <h2 className="table-detail--title">
                        //                             Product Description
                        //                         </h2>
                        //                         <div className="table-detail--par">
                        //                             <p>{rowData.description}</p>
                        //                         </div>
                        //                     </div>
                        //
                        //                     <div>
                        //                         <h2 className="table-detail--title">
                        //                             Product Images
                        //                         </h2>
                        //                         <div className="table-detail--par">
                        //                             {rowData.images &&
                        //                                 rowData.images.map(
                        //                                     (image) => {
                        //                                         return (
                        //                                             <div
                        //                                                 className="product__table-image"
                        //                                                 key={
                        //                                                     image.id
                        //                                                 }
                        //                                             >
                        //                                                 <img
                        //                                                     className="product__table-image--img"
                        //                                                     src={`http://127.0.0.1:8000/storage/${image.path}`}
                        //                                                     alt={
                        //                                                         rowData.name
                        //                                                     }
                        //                                                 />
                        //
                        //                                                 <hr className="product__table-hr"/>
                        //
                        //                                                 <div className="product__table-image--btns">
                        //                                                     <Button
                        //                                                         variant="outlined"
                        //                                                         startIcon={
                        //                                                             <EditIcon/>
                        //                                                         }
                        //                                                         onClick={(
                        //                                                             e
                        //                                                         ) =>
                        //                                                             handleReplaceDialogOpen(
                        //                                                                 image.id,
                        //                                                                 image.product_id
                        //                                                             )
                        //                                                         }
                        //                                                     >
                        //                                                         Replace
                        //                                                         Image
                        //                                                     </Button>
                        //                                                     <Button
                        //                                                         variant="outlined"
                        //                                                         color="secondary"
                        //                                                         startIcon={
                        //                                                             <DeleteIcon/>
                        //                                                         }
                        //                                                         onClick={(
                        //                                                             e
                        //                                                         ) =>
                        //                                                             deleteProductImageHandler(
                        //                                                                 image.id
                        //                                                             )
                        //                                                         }
                        //                                                     >
                        //                                                         Delete
                        //                                                         Image
                        //                                                     </Button>
                        //                                                 </div>
                        //                                             </div>
                        //                                         );
                        //                                     }
                        //                                 )}
                        //                         </div>
                        //                     </div>
                        //                 </div>
                        //             </>
                        //         );
                        //     }}
                        // />
                    )}

                    <Dialog
                        open={openEditDialog}
                        aria-labelledby="draggable-dialog-title"
                        onClose={handleEditDialogClose}
                        fullWidth
                        disableScrollLock={true}
                    >
                        <UpdateProductScreen
                            onClose={handleEditDialogClose}
                            productData={productToBeEdited}
                        />

                        <DialogActions>
                            <StyledButton
                                onClick={handleEditDialogClose}
                                variant="contained"
                                color="secondary"
                            >
                                Cancel
                            </StyledButton>
                        </DialogActions>
                    </Dialog>

                    {/*<Dialog*/}
                    {/*    open={openAddDialog}*/}
                    {/*    aria-labelledby="draggable-dialog-title"*/}
                    {/*    onClose={handleAddDialogClose}*/}
                    {/*    fullWidth*/}
                    {/*    disableScrollLock={true}*/}
                    {/*>*/}
                    {/*    <AddProductScreen*/}
                    {/*        onClose={handleAddDialogClose}*/}
                    {/*    />*/}

                    {/*    <DialogActions>*/}
                    {/*        <StyledButton*/}
                    {/*            onClick={handleAddDialogClose}*/}
                    {/*            variant="contained"*/}
                    {/*            color="secondary"*/}
                    {/*        >*/}
                    {/*            Cancel*/}
                    {/*        </StyledButton>*/}
                    {/*    </DialogActions>*/}
                    {/*</Dialog>*/}

                    <Dialog
                        open={openAddProductImageDialog}
                        aria-labelledby="draggable-dialog-title"
                        onClose={handleAddProductImageDialogClose}
                        fullWidth
                    >
                        <AddProductImageScreen
                            onClose={handleAddProductImageDialogClose}
                            productId={productId}
                        />

                        <DialogActions>
                            <StyledButton
                                onClick={handleAddProductImageDialogClose}
                                variant="contained"
                                color="secondary"
                            >
                                Cancel
                            </StyledButton>
                        </DialogActions>
                    </Dialog>

                    {/*<Dialog*/}
                    {/*    open={openReplaceDialog}*/}
                    {/*    aria-labelledby="draggable-dialog-title"*/}
                    {/*    onClose={handleReplaceDialogClose}*/}
                    {/*    fullWidth*/}
                    {/*>*/}
                    {/*    <ReplaceProductImageScreen*/}
                    {/*        setOpenReplaceDialog={setOpenReplaceDialog}*/}
                    {/*        setRequestData={setRequestData}*/}
                    {/*        productReplaceImageId={*/}
                    {/*            productReplaceImageId && productReplaceImageId*/}
                    {/*        }*/}
                    {/*        productReplaceProductId={*/}
                    {/*            productReplaceImageId && productReplaceProductId*/}
                    {/*        }*/}
                    {/*    />*/}

                    {/*    <DialogActions>*/}
                    {/*        <Button*/}
                    {/*            onClick={handleReplaceDialogClose}*/}
                    {/*            variant="contained"*/}
                    {/*            color="secondary"*/}
                    {/*            className={classes.button}*/}
                    {/*        >*/}
                    {/*            Cancel*/}
                    {/*        </Button>*/}
                    {/*    </DialogActions>*/}
                    {/*</Dialog>*/}
                </>
            )}
        </Paper>
    );
};

export default ProductsScreen;
