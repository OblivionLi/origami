import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    TextField,
    Divider,
    FormControl,
    DialogContent,
    DialogTitle,
    Checkbox,
    FormControlLabel,
    FormGroup, Grid2, Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import {AppDispatch, RootState} from "@/store";
import {fetchPermissions, Permission} from "@/features/permission/permissionSlice";
import {updateRole, Role, fetchRoles} from '@/features/role/roleSlice';
import {Item2, StyledButton, StyledDivider} from "@/styles/muiStyles";

interface UpdateRoleScreenProps {
    onClose: () => void;
    roleData: Role | null;
}

const UpdateRoleScreen: React.FC<UpdateRoleScreenProps> = ({onClose, roleData}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState<string | undefined>("");
    const [isAdmin, setIsAdmin] = useState<number>(0);
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[] | undefined>([]);

    const {editRoleSuccess} = useSelector((state: RootState) => state.role);
    const {permissions, success, loading} = useSelector((state: RootState) => state.permission);

    useEffect(() => {
        if (!roleData) {
            onClose();
        }

        setName(roleData?.name);
        setIsAdmin(roleData?.is_admin || 0)
        const rolePermissionIds = roleData?.permissions.map((permission: Permission) => permission.id);
        setSelectedPermissionIds(rolePermissionIds);

    }, [roleData]);

    useEffect(() => {
        dispatch(fetchPermissions());
    }, [dispatch]);

    const handlePermissionChange = useCallback((permissionId: number) => {
        setSelectedPermissionIds((prevSelectedPermissionIds) => {
            if (prevSelectedPermissionIds?.includes(permissionId)) {
                return prevSelectedPermissionIds?.filter((id) => id !== permissionId);
            } else {
                return [...prevSelectedPermissionIds!, permissionId];
            }
        });
    }, []);

    const handleIsAdminCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsAdmin(e.target.checked ? 1 : 0);
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(updateRole({
            id: roleData?.id,
            name,
            is_admin: isAdmin,
            perms: selectedPermissionIds
        }));

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
        if (editRoleSuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Role updated successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(fetchRoles());
        }
    }, [editRoleSuccess, onClose, dispatch]);

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update Role</DialogTitle>
            <Divider/>
            <DialogContent>
                <form onSubmit={submitHandler}>
                    <div className="form">
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
                            <Typography
                                variant="h5"
                                sx={{
                                    marginBottom: '16px',
                                    fontWeight: 'bold',
                                    borderBottom: '2px solid #855C1B',
                                    paddingBottom: '8px'
                                }}
                            >
                                Is this role an admin?
                            </Typography>
                            <FormControlLabel
                                value="isAdmin"
                                control={
                                    <Checkbox
                                        style={{
                                            color: "#388667",
                                        }}
                                        checked={isAdmin === 1}
                                        onChange={handleIsAdminCheckbox}
                                    />
                                }
                                label="(checked = yes, unchecked = no)"
                                name="isadmin"
                            />
                        </div>

                        <div className="form__field">
                            <Typography
                                variant="h5"
                                sx={{
                                    marginBottom: '16px',
                                    fontWeight: 'bold',
                                    borderBottom: '2px solid #855C1B',
                                    paddingBottom: '8px'
                                }}
                            >
                                Permissions:
                            </Typography>
                            <FormControl component="fieldset" fullWidth>
                                <FormGroup>
                                    <Grid2 container spacing={2}>
                                        {(permissions || []).map((permission) => (
                                            <Grid2 key={permission.id}>
                                                <Item2 elevation={0}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={selectedPermissionIds?.includes(permission.id)}
                                                                onChange={() => handlePermissionChange(permission.id)}
                                                                name={permission.name}
                                                            />
                                                        }
                                                        label={permission.name}
                                                    />
                                                </Item2>
                                            </Grid2>
                                        ))}
                                    </Grid2>
                                </FormGroup>
                            </FormControl>
                        </div>
                    </div>

                    <StyledButton
                        variant="contained"
                        color="primary"
                        value="submit"
                        type="submit"
                        fullWidth
                    >
                        Update Role
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default UpdateRoleScreen;
