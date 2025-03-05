import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Box, Button, Card, CardContent, CardMedia, Dialog, DialogActions, Paper, Typography} from "@mui/material";
import Swal from "sweetalert2";
import UpdateProductScreen from "./UpdateProductScreen";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {Link, useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "@/store";
import {getUserRolesPermissions} from "@/features/user/userSlice";
import {
    AdminProduct,
    deleteProduct, deleteProductImage,
    fetchAdminProductsList, ProductImage,
    resetAddProductImageSuccess,
    resetAddProductSuccess, resetEditProductImageSuccess,
    resetEditProductSuccess
} from "@/features/product/productSlice";
import {StyledButton, StyledDivider} from "@/styles/muiStyles";
import {MaterialReactTable, MRT_ColumnDef, MRT_Row, useMaterialReactTable} from "material-react-table";
import {format} from "date-fns";
import {ListItemIcon, MenuItem} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddProductImageScreen from "@/screens/admin/products/AddProductImageScreen";
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import {ASSET_URL} from "@/config";
import ReplaceProductImageScreen from "@/screens/admin/products/ReplaceProductImageScreen";
import AddProductScreen from "@/screens/admin/products/AddProductScreen";

interface ProductsScreenProps {
}

const ProductsScreen: React.FC<ProductsScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [productId, setProductId] = useState<number>(0);

    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [productToBeEdited, setProductToBeEdited] = useState<AdminProduct | null>(null);
    const [productImageToBeEdited, setProductImageToBeEdited] = useState<ProductImage | null>(null);

    const [openAddProductImageDialog, setOpenAddProductImageDialog] = useState(false);
    const [openImageReplaceDialog, setOpenImageReplaceDialog] = useState(false);

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

    const handleReplaceDialogOpen = useCallback((image: ProductImage) => {
        if (userPermissions?.includes("admin_edit_productimages")) {
            setProductImageToBeEdited(image);
            setOpenImageReplaceDialog(true);
        } else {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
        }
    }, [userPermissions]);

    const handleReplaceDialogClose = useCallback(() => {
        setOpenImageReplaceDialog(false);
        dispatch(resetEditProductImageSuccess());
    }, []);

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

    const deleteProductImageHandler = (id: number) => {
        if (!userPermissions?.includes("admin_delete_productimages")) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
            return;
        }

        Swal.fire({
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
                dispatch(deleteProductImage({id}));
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
    };

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

    const StyledButtonDetailPanel = ({children, ...props}: {
        children: React.ReactNode
    } & React.ComponentProps<typeof Button>) => (
        <Button sx={{mr: 1}} {...props}>
            {children}
        </Button>
    );

    const DetailPanelContainer = ({children}: { children: React.ReactNode }) => (
        <Box
            style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '1000px',
                width: '100%',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            {children}
        </Box>
    );

    const SectionTitle = ({children}: { children: React.ReactNode }) => (
        <Typography
            variant="h5"
            style={{
                marginBottom: '16px',
                fontWeight: 'bold',
                borderBottom: '2px solid #855C1B',
                paddingBottom: '8px',
            }}
        >
            {children}
        </Typography>
    );

    const SectionContent = ({children}: { children: React.ReactNode }) => (
        <Typography style={{marginBottom: '16px'}}>{children}</Typography>
    );

    const ProductImageContainer = ({children}: { children: React.ReactNode }) => (
        <Card style={{marginBottom: '16px', width: 'fit-content'}}>
            {children}
        </Card>
    );

    interface RenderDetailPanelProps {
        row: MRT_Row<AdminProduct>;
    }

    const renderDetailPanel = ({row}: RenderDetailPanelProps) => {
        const {original} = row;

        return (
            <>
                <DetailPanelContainer>
                    <SectionTitle>Parent Category:</SectionTitle>
                    <SectionContent>{original?.parentCategory?.name || " - "}</SectionContent>

                    <SectionTitle>Child Category:</SectionTitle>
                    <SectionContent>{original?.childCategory?.name || " - "}</SectionContent>

                    <SectionTitle>Description:</SectionTitle>
                    <SectionContent>{original?.description || " - "}</SectionContent>
                </DetailPanelContainer>

                <DetailPanelContainer>
                    <SectionTitle>Product Images:</SectionTitle>
                    <Box sx={{display: 'flex', flexWrap: 'wrap'}}>
                        {original?.images && original.images.length > 0 ? (
                            original.images.map((image) => (
                                <ProductImageContainer key={image.id}>
                                    <CardMedia
                                        component="img"
                                        image={`${ASSET_URL}/${image.path}`}
                                        alt="Product Image"
                                        style={{
                                            width: '100px',
                                            height: 'auto',
                                        }}
                                    />
                                    <CardContent>
                                        <StyledDivider/>
                                        <div style={{
                                            display: 'flex',
                                            marginTop: '8px',
                                            justifyContent: 'space-between'
                                        }}>
                                            <StyledButtonDetailPanel
                                                variant="outlined"
                                                startIcon={<EditIcon/>}
                                                onClick={() => handleReplaceDialogOpen(image)}
                                            >
                                                Replace
                                            </StyledButtonDetailPanel>
                                            <StyledButtonDetailPanel
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<DeleteIcon/>}
                                                onClick={() => deleteProductImageHandler(image.id)}
                                            >
                                                Delete
                                            </StyledButtonDetailPanel>
                                        </div>
                                    </CardContent>
                                </ProductImageContainer>
                            ))
                        ) : (
                            <SectionContent>No images available</SectionContent>
                        )}
                    </Box>
                </DetailPanelContainer>
            </>
        );
    };

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
        renderDetailPanel: renderDetailPanel,
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

                    <Dialog
                        open={openAddDialog}
                        aria-labelledby="draggable-dialog-title"
                        onClose={handleAddDialogClose}
                        fullWidth
                        disableScrollLock={true}
                    >
                        <AddProductScreen
                            onClose={handleAddDialogClose}
                        />

                        <DialogActions>
                            <StyledButton
                                onClick={handleAddDialogClose}
                                variant="contained"
                                color="secondary"
                            >
                                Cancel
                            </StyledButton>
                        </DialogActions>
                    </Dialog>

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

                    <Dialog
                        open={openImageReplaceDialog}
                        aria-labelledby="draggable-dialog-title"
                        onClose={handleReplaceDialogClose}
                        fullWidth
                    >
                        <ReplaceProductImageScreen
                            onClose={handleReplaceDialogClose}
                            imageData={productImageToBeEdited}
                        />

                        <DialogActions>
                            <StyledButton
                                onClick={handleReplaceDialogClose}
                                variant="contained"
                                color="secondary"
                            >
                                Cancel
                            </StyledButton>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Paper>
    );
};

export default ProductsScreen;
