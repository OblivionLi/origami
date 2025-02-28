import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, DialogActions, Paper, MenuItem, ListItemIcon} from "@mui/material";
import Swal from "sweetalert2";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {AppDispatch, RootState} from "@/store";
import {
    deletePermission,
    fetchPermissions,
    Permission,
    resetAddPermissionSuccess,
    resetEditPermissionSuccess
} from "@/features/permission/permissionSlice";
import {useNavigate} from "react-router-dom";
import {getUserRolesPermissions} from "@/features/user/userSlice";
import {StyledButton, StyledDivider} from "@/styles/muiStyles";
import {MaterialReactTable, MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {format} from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPermissionScreen from "@/screens/admin/users/permissions/AddPermissionScreen";
import UpdatePermissionScreen from "@/screens/admin/users/permissions/UpdatePermissionScreen";

interface PermissionsScreenProps {
}

const PermissionsScreen: React.FC<PermissionsScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [permissionToBeEdited, setPermissionToBeEdited] = useState<Permission | null>(null);

    const {
        userInfo,
        userPermissions,
    } = useSelector((state: RootState) => state.user);

    const {
        permissions,
        loading,
        error,
    } = useSelector((state: RootState) => state.permission);

    useEffect(() => {
        if (!userInfo || userInfo?.data?.is_admin != 1) {
            navigate("/login");
        } else {
            setIsAdmin(true);
            dispatch(fetchPermissions());
        }
    }, [dispatch, userInfo, navigate]);

    useEffect(() => {
        if (!userPermissions || userPermissions?.length === 0) {
            dispatch(getUserRolesPermissions({id: userInfo?.data?.id}));
        }
    }, [dispatch, userPermissions]);

    useEffect(() => {
        if (userPermissions && !userPermissions?.includes('admin_view_permissions')) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );

            navigate('/admin');
        }
    }, [dispatch, userPermissions]);

    const handleAddDialogOpen = useCallback(() => {
        if (userPermissions?.includes("admin_create_permissions")) {
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
        dispatch(resetAddPermissionSuccess())
    }, []);

    const handleEditDialogOpen = useCallback((permission: any) => {
        if (userPermissions?.includes("admin_edit_permissions")) {
            setPermissionToBeEdited(permission);
            setOpenEditDialog(true);
        } else {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
        }
    }, []);

    const handleEditDialogClose = useCallback(() => {
        setOpenEditDialog(false);
        setPermissionToBeEdited(null);
        dispatch(resetEditPermissionSuccess());
    }, []);

    const deletePermissionHandler = (id: number) => {
        if (!userPermissions?.includes("admin_delete_permissions")) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: `You can't recover this permission after deletion!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            cancelButtonColor: "#d33",
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                dispatch(deletePermission({id}));
                Swal.fire(
                    "Deleted!",
                    "The permission with the id " +
                    id +
                    " has been deleted.",
                    "success"
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    "Cancelled",
                    `The selected permission is safe, don't worry :)`,
                    "error"
                );
            }
        });
    };

    const columns = useMemo<MRT_ColumnDef<Permission, unknown>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
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
        data: permissions || [],
        enableRowActions: true,
        enableExpanding: true,
        positionActionsColumn: 'last',
        renderTopToolbarCustomActions: () => (
            <StyledButton
                variant="contained"
                onClick={handleAddDialogOpen}
                sx={{marginLeft: '10px'}}
            >
                Add Permission
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
                    deletePermissionHandler(row.original.id!)
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
                    <StyledDivider>Permissions</StyledDivider>
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
                        <UpdatePermissionScreen
                            onClose={handleEditDialogClose}
                            permissionData={permissionToBeEdited}
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
                        <AddPermissionScreen
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

export default PermissionsScreen;
