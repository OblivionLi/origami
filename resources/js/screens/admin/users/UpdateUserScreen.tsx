import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    TextField,
    Divider,
    FormControl,
    DialogContent,
    DialogTitle, FormGroup, FormControlLabel, Checkbox, Grid2,
} from "@mui/material";
import Swal from "sweetalert2";
import {AppDispatch, RootState} from "@/store";
import {Item2, StyledButton} from "@/styles/muiStyles";
import {editUser, getUsersList, resetEditUserSuccess, UserList} from "@/features/user/userSlice";
import {fetchRoles, Role} from "@/features/role/roleSlice";

interface UpdateUserScreenProps {
    onClose: () => void;
    userData: UserList | null;
}

const UpdateUserScreen: React.FC<UpdateUserScreenProps> = ({onClose, userData}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState<string | undefined>("");
    const [email, setEmail] = useState<string | undefined>("");
    const [selectedRoleIds, setSelectedRoleIds] = useState<number[] | undefined>([]);

    const {role: roles, success, loading} = useSelector((state: RootState) => state.role)
    const {editUserSuccess, loading: loadingUpdate} = useSelector((state: RootState) => state.user)

    useEffect(() => {
        if (!userData) {
            onClose();
        }

        setName(userData?.name);
        setEmail(userData?.email)
        const userRoleIds = userData?.roles.map((role: Role) => role.id);
        setSelectedRoleIds(userRoleIds);

    }, [userData]);

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    const handleRoleChange= useCallback((roleId: number) => {
        setSelectedRoleIds((prevSelectedRoleIds) => {
            if (prevSelectedRoleIds?.includes(roleId)) {
                return prevSelectedRoleIds?.filter((id) => id !== roleId);
            } else {
                return [...prevSelectedRoleIds!, roleId];
            }
        });
    }, []);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(editUser(
            {
                id: userData?.id,
                name,
                email,
                roles: selectedRoleIds
            }
        ));

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
        if (editUserSuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `User updated successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(getUsersList());
        }
    }, [editUserSuccess, onClose, dispatch]);

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update User</DialogTitle>
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
                            <TextField
                                variant="outlined"
                                name="email"
                                label="Email"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form__field">
                            <FormControl component="fieldset" fullWidth>
                                <FormGroup>
                                    <Grid2 container spacing={2}>
                                        {(roles || []).map((role) => (
                                            <Grid2 key={role.id}>
                                                <Item2 elevation={0}>
                                                    <FormControlLabel
                                                        control={
                                                            <Checkbox
                                                                checked={selectedRoleIds?.includes(role.id)}
                                                                onChange={() => handleRoleChange(role.id)}
                                                                name={role.name}
                                                            />
                                                        }
                                                        label={role.name}
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
                        Update User
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default UpdateUserScreen;
