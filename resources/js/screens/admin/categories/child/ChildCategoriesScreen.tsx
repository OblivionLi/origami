import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, DialogActions, Paper, ListItemIcon, MenuItem} from "@mui/material";
import Swal from "sweetalert2";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {AppDispatch, RootState} from "@/store";
import {useNavigate} from "react-router-dom";
import {getUserRolesPermissions} from "@/features/user/userSlice";
import {
    ChildCategorySlice,
    deleteChildCategory, fetchAdminChildCategories,
    resetAddChildCategorySuccess,
    resetEditChildCategorySuccess
} from "@/features/categories/childCategorySlice";
import {MaterialReactTable, MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {format} from "date-fns";
import {StyledButton, StyledDivider} from "@/styles/muiStyles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddChildCategoryScreen from "@/screens/admin/categories/child/AddChildCategoryScreen";
import UpdateChildCategoryScreen from "@/screens/admin/categories/child/UpdateChildCategoryScreen";

interface ChildCategoriesScreenProps {
}

const ChildCategoriesScreen: React.FC<ChildCategoriesScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [categoryToBeEdited, setCategoryToBeEdited] = useState<ChildCategorySlice | null>(null);

    const {
        userInfo,
        userPermissions,
    } = useSelector((state: RootState) => state.user);

    const {
        childCategories,
        loading,
        error
    } = useSelector((state: RootState) => state.childCategory);

    useEffect(() => {
        if (!userInfo || userInfo?.data?.is_admin != 1) {
            navigate("/login");
        } else {
            setIsAdmin(true);
            dispatch(fetchAdminChildCategories());
        }
    }, [dispatch, userInfo, navigate]);

    useEffect(() => {
        if (!userPermissions || userPermissions?.length === 0) {
            dispatch(getUserRolesPermissions({id: userInfo?.data?.id}));
        }
    }, [dispatch, userPermissions]);

    useEffect(() => {
        if (userPermissions && !userPermissions?.includes('admin_view_childcategories')) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );

            navigate('/admin');
        }
    }, [dispatch, userPermissions]);

    const handleAddDialogOpen = useCallback(() => {
        if (userPermissions?.includes("admin_create_childcategories")) {
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
        dispatch(resetAddChildCategorySuccess());
    }, []);

    const handleEditDialogOpen = useCallback((childCategory: any) => {
        if (userPermissions?.includes("admin_edit_childcategories")) {
            setCategoryToBeEdited(childCategory);
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
        setCategoryToBeEdited(null);
        dispatch(resetEditChildCategorySuccess());
    }, []);

    const deleteChildCategoryHandler = (id: number) => {
        if (!userPermissions?.includes("admin_delete_childcategories")) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
            return;
        }
        Swal.fire({
            title: "Are you sure?",
            text: `You can't recover this child category after deletion!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            cancelButtonColor: "#d33",
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                dispatch(deleteChildCategory({id}));
                Swal.fire(
                    "Deleted!",
                    "The parent category with the id " +
                    id +
                    " has been deleted.",
                    "success"
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    "Cancelled",
                    `The selected parent category is safe, don't worry :)`,
                    "error"
                );
            }
        });
    };

    const columns = useMemo<MRT_ColumnDef<ChildCategorySlice, unknown>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: 150,
            },
            {
                accessorKey: 'quantity',
                header: 'Product Quantities',
                size: 150,
            },
            {
                accessorKey: 'parentCategory.name',
                header: 'Relation (Parent)',
                size: 150,
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
        data: childCategories || [],
        enableRowActions: true,
        enableExpanding: false,
        positionActionsColumn: 'last',
        renderTopToolbarCustomActions: () => (
            <StyledButton
                variant="contained"
                onClick={handleAddDialogOpen}
                sx={{marginLeft: '10px'}}
            >
                Add Child Category
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
                    deleteChildCategoryHandler(row.original.id!)
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
    });

    return (
        <Paper className="admin-content">
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader/>
                </div>
            ) : (
                <>
                    <StyledDivider>Child Categories</StyledDivider>
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
                        <UpdateChildCategoryScreen
                            onClose={handleEditDialogClose}
                            childCategoryData={categoryToBeEdited}
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
                        <AddChildCategoryScreen
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
                </>
            )}
        </Paper>
    );
};

export default ChildCategoriesScreen;
