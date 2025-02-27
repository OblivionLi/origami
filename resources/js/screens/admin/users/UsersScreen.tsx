import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, DialogActions, Paper, Button, Box, Typography, MenuItem, ListItemIcon} from "@mui/material";
import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import Swal from "sweetalert2";
import {AppDispatch, RootState} from "@/store";
import {useNavigate} from "react-router-dom";
import {getUserRolesPermissions, getUsersList, resetEditUserSuccess, User, UserList} from "@/features/user/userSlice";
import {StyledButton, StyledDivider} from "@/styles/muiStyles";
import {MaterialReactTable, MRT_ColumnDef, useMaterialReactTable} from "material-react-table";
import {Role} from "@/features/role/roleSlice";
import {format} from "date-fns";
import {Address} from "@/features/address/addressSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UpdateUserScreen from "@/screens/admin/users/UpdateUserScreen";

interface UsersScreenProps {
}

const UsersScreen: React.FC<UsersScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [userToBeEdited, setUserToBeEdited] = useState<UserList | null>(null);

    const {
        userInfo,
        userPermissions,
        success,
        loading,
        error: errorUsers,
        adminUsersList
    } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (!userInfo || userInfo?.data?.is_admin != 1) {
            navigate("/login");
        } else {
            setIsAdmin(true);
            dispatch(getUsersList());
        }
    }, [dispatch, userInfo, navigate]);

    useEffect(() => {
        if (!userPermissions || userPermissions?.length === 0) {
            dispatch(getUserRolesPermissions({id: userInfo?.data?.id}));
        }
    }, [dispatch, userPermissions]);

    useEffect(() => {
        if (userPermissions && !userPermissions?.includes('admin_view_users')) {
            navigate('/admin');
        }
    }, [dispatch, userPermissions]);

    const handleEditDialogOpen = useCallback((user: any) => {
        if (userPermissions?.includes("admin_edit_users")) {
            setUserToBeEdited(user);
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
        setUserToBeEdited(null);
        dispatch(resetEditUserSuccess());
    }, []);

    const deleteUserHandler = (id: number) => {
        if (!userPermissions?.includes("admin_delete_users")) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
            return;
        }
        Swal.fire({
            title: "Are you sure?",
            text: `You can't recover this user after deletion!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            cancelButtonColor: "#d33",
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                // dispatch(deleteUser(id));
                // setRequestData(new Date());
                Swal.fire(
                    "Deleted!",
                    "The user with the id " + id + " has been deleted.",
                    "success"
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    "Cancelled",
                    `The selected user is safe, don't worry :)`,
                    "error"
                );
            }
        });
    }

    const columns = useMemo<MRT_ColumnDef<User, unknown>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Username',
                size: 150,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 150,
            },
            {
                accessorKey: 'roles',
                header: 'Roles',
                size: 150,
                Cell: ({cell}) => {
                    const roles = cell.getValue<Role[]>();

                    if (!roles || roles.length == 0) {
                        return <span>N/A</span>;
                    }

                    if (roles.length == 1) {
                        return <span>{roles[0].name}</span>;
                    }

                    const roleNames = roles.map((role) => role.name).join(', ');
                    return <span>{roleNames}</span>
                }
            },
            {
                accessorKey: 'created_at',
                header: 'Date Joined',
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
        data: adminUsersList || [],
        enableRowActions: true,
        enableExpanding: true,
        renderDetailPanel: ({row}) => (
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-around',
                    left: '30px',
                    maxWidth: '1000px',
                    position: 'sticky',
                    width: '100%',
                }}
            >
                <Typography variant="h4">Addresses:</Typography>
                {row.original.addresses.length > 0 ? (
                    row.original.addresses.map((address: Address, index: number) => (
                        <Box key={address.id} sx={{marginBottom: '8px'}}>
                            <Typography variant="h6">Address {index + 1}</Typography>
                            <Typography>Name: {address.name} {address.surname}</Typography>
                            <Typography>Country: {address.country}</Typography>
                            <Typography>City: {address.city}</Typography>
                            <Typography>Address: {address.address}</Typography>
                            <Typography>Postal Code: {address.postal_code}</Typography>
                            <Typography>Phone Number: {address.phone_number}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography>No addresses found.</Typography>
                )}
            </Box>
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
                    deleteUserHandler(row.original.id!)
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
                    <StyledDivider>Users</StyledDivider>
                    {loading ? (
                        <Loader/>
                    ) : errorUsers ? (
                        <Message variant="error">{errorUsers}</Message>
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
                        <UpdateUserScreen
                            onClose={handleEditDialogClose}
                            userData={userToBeEdited}
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

export default UsersScreen;
