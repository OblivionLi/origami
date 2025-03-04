import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, DialogActions, Paper, MenuItem, ListItemIcon, Box, Typography} from "@mui/material";
import Swal from "sweetalert2";
import UpdateReviewScreen from "./UpdateReviewScreen";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {Link, useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "@/store";
import {
    deleteReview,
    fetchAdminReviewsList,
    resetEditReviewSuccess,
    Review,
    ReviewProduct
} from "@/features/review/reviewSlice";
import {getUserRolesPermissions} from "@/features/user/userSlice";
import {StyledButton, StyledDivider} from "@/styles/muiStyles";
import {MaterialReactTable, MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {format} from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface ReviewsScreenProps {
}

const ReviewsScreen: React.FC<ReviewsScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [reviewToBeEdited, setReviewToBeEdited] = useState<Review | null>(null);

    const {
        userInfo,
        userPermissions,
    } = useSelector((state: RootState) => state.user);

    const {
        reviews,
        loading,
        error
    } = useSelector((state: RootState) => state.review);

    useEffect(() => {
        if (!userInfo || userInfo?.data?.is_admin != 1) {
            navigate("/login");
        } else {
            setIsAdmin(true);
            dispatch(fetchAdminReviewsList());
        }
    }, [dispatch, userInfo, navigate]);

    useEffect(() => {
        if (!userPermissions || userPermissions?.length === 0) {
            dispatch(getUserRolesPermissions({id: userInfo?.data?.id}));
        }
    }, [dispatch, userPermissions]);

    useEffect(() => {
        if (userPermissions && !userPermissions?.includes('admin_view_reviews')) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );

            navigate('/admin');
        }
    }, [dispatch, userPermissions]);

    const handleEditDialogOpen = useCallback((review: any) => {
        if (userPermissions?.includes("admin_edit_reviews")) {
            setReviewToBeEdited(review);
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
        setReviewToBeEdited(null);
        dispatch(resetEditReviewSuccess());
    }, []);

    const deleteReviewHandler = (id: number) => {
        if (!userPermissions?.includes("admin_delete_reviews")) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: `You can't recover this review after deletion!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            cancelButtonColor: "#d33",
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                dispatch(deleteReview({id}));
                Swal.fire(
                    "Deleted!",
                    "The review with the id " + id + " has been deleted.",
                    "success"
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    "Cancelled",
                    `The selected review is safe, don't worry :)`,
                    "error"
                );
            }
        });
    };

    const columns = useMemo<MRT_ColumnDef<Review, unknown>[]>(
        () => [
            {
                accessorKey: 'product',
                header: 'Product Review',
                size: 150,
                Cell: ({cell}) => {
                    const product = cell.getValue<ReviewProduct>();

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
                accessorKey: 'user_name',
                header: 'Review By',
                size: 150,
            },
            {
                accessorKey: 'admin_name',
                header: 'Review Edit By (admin)',
                size: 150,
                Cell: ({cell}) => {
                    const adminName = cell.getValue<string>();
                    return adminName ? adminName : ' - ';
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
        data: reviews || [],
        enableRowActions: true,
        enableExpanding: true,
        positionActionsColumn: 'last',
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
                    deleteReviewHandler(row.original.id!)
                    closeMenu();
                }}
                sx={{m: 0}}
            >
                <ListItemIcon>
                    <DeleteIcon/>
                </ListItemIcon>
                Delete
            </MenuItem>,
        ],
        renderDetailPanel: ({row}) => (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    maxWidth: '1000px',
                    width: '100%',
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        marginBottom: '16px',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #855C1B',
                        paddingBottom: '8px'
                    }}
                >
                    User's Review comment:
                </Typography>
                <Typography></Typography>
                <Typography>{row.original.user_comment ? row.original.user_comment : " - "}</Typography>

                <Typography
                    variant="h5"
                    sx={{
                        marginBottom: '16px',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #855C1B',
                        paddingBottom: '8px'
                    }}
                >
                    Admin's Review comment:
                </Typography>
                <Typography>{row.original.admin_comment ? row.original.admin_comment : " - "}</Typography>
            </Box>
        ),
    });

    return (
        <Paper className="admin-content">
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader/>
                </div>
            ) : (
                <>
                    <StyledDivider>Reviews</StyledDivider>
                    {loading ? (
                        <Loader/>
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialReactTable table={table} />
                    )}

                    <Dialog
                        open={openEditDialog}
                        aria-labelledby="draggable-dialog-title"
                        onClose={handleEditDialogClose}
                        fullWidth
                        disableScrollLock={true}
                    >
                        <UpdateReviewScreen
                            onClose={handleEditDialogClose}
                            reviewData={reviewToBeEdited}
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
                </>
            )}
        </Paper>
    );
};

export default ReviewsScreen;
