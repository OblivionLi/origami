import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, DialogActions, Paper} from "@mui/material";
import Swal from "sweetalert2";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {AppDispatch, RootState} from "@/store";
import {useNavigate} from "react-router-dom";
import {
    deleteParentCategory, fetchAdminParentCategories,
    ParentCategory,
    resetAddParentCategorySuccess, resetEditParentCategorySuccess
} from "@/features/categories/parentCategorySlice";
import {getUserRolesPermissions} from "@/features/user/userSlice";
import {MaterialReactTable, MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {format} from "date-fns";
import {StyledButton, StyledDivider} from "@/styles/muiStyles";
import {Box, Chip, ListItemIcon, MenuItem, Typography} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {ChildCategory} from "@/features/categories/categorySlice";
import AddParentCategoryScreen from "@/screens/admin/categories/parent/AddParentCategoryScreen";
import UpdateParentCategoryScreen from "@/screens/admin/categories/parent/UpdateParentCategoryScreen";

interface ParentCategoriesScreenProps {

}

const ParentCategoriesScreen: React.FC<ParentCategoriesScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [categoryToBeEdited, setCategoryToBeEdited] = useState<ParentCategory | null>(null);

    const {
        userInfo,
        userPermissions,
    } = useSelector((state: RootState) => state.user);

    const {
        parentCategories,
        loading,
        error
    } = useSelector((state: RootState) => state.parentCategory);

    useEffect(() => {
        if (!userInfo || userInfo?.data?.is_admin != 1) {
            navigate("/login");
        } else {
            setIsAdmin(true);
            dispatch(fetchAdminParentCategories());
        }
    }, [dispatch, userInfo, navigate]);

    useEffect(() => {
        if (!userPermissions || userPermissions?.length === 0) {
            dispatch(getUserRolesPermissions({id: userInfo?.data?.id}));
        }
    }, [dispatch, userPermissions]);

    useEffect(() => {
        if (userPermissions && !userPermissions?.includes('admin_view_parentcategories')) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );

            navigate('/admin');
        }
    }, [dispatch, userPermissions]);

    const handleAddDialogOpen = useCallback(() => {
        if (userPermissions?.includes("admin_create_parentcategories")) {
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
        dispatch(resetAddParentCategorySuccess());
    }, []);

    const handleEditDialogOpen = useCallback((parentCategory: any) => {
        if (userPermissions?.includes("admin_edit_parentcategories")) {
            setCategoryToBeEdited(parentCategory);
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
        dispatch(resetEditParentCategorySuccess());
    }, []);

    const deleteParentCategoryHandler = (id: number) => {
        if (!userPermissions?.includes("admin_delete_parentcategories")) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: `You can't recover this parent category after deletion!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            cancelButtonColor: "#d33",
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                dispatch(deleteParentCategory({id}));
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

    const columns = useMemo<MRT_ColumnDef<ParentCategory, unknown>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                size: 150,
            },
            {
                accessorKey: 'products_count',
                header: 'Products Count',
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
        data: parentCategories || [],
        enableRowActions: true,
        enableExpanding: true,
        positionActionsColumn: 'last',
        renderTopToolbarCustomActions: () => (
            <StyledButton
                variant="contained"
                onClick={handleAddDialogOpen}
                sx={{marginLeft: '10px'}}
            >
                Add Parent Category
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
                    deleteParentCategoryHandler(row.original.id!)
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
                    Child Categories:
                </Typography>
                {row.original.childCategories?.length > 0 ? (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '12px'}}>
                        {row.original.childCategories.map((childCat: ChildCategory) => (
                            <Chip
                                key={childCat.id}
                                label={childCat.name}
                                sx={{
                                    backgroundColor: '#FDF7E9',
                                    color: '#855C1B',
                                    fontWeight: '500',
                                    padding: '8px 4px',
                                    '&:hover': {
                                        backgroundColor: '#f0e6d2'
                                    }
                                }}
                            />
                        ))}
                    </Box>
                ) : (
                    <Typography sx={{fontStyle: 'italic', color: '#666'}}>
                        No child categories found.
                    </Typography>
                )}
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
                    <StyledDivider>Parent Categories</StyledDivider>
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
                        <UpdateParentCategoryScreen
                            onClose={handleEditDialogClose}
                            parentCategoryData={categoryToBeEdited}
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
                        <AddParentCategoryScreen
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

export default ParentCategoriesScreen;
