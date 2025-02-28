import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    TextField,
    Divider,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import Swal from "sweetalert2";
import {fetchPermissions, Permission, updatePermission} from "@/features/permission/permissionSlice";
import {AppDispatch, RootState} from "@/store";
import {StyledButton} from "@/styles/muiStyles";

interface UpdatePermissionScreenProps {
    onClose: () => void;
    permissionData: Permission | null;
}

const UpdatePermissionScreen: React.FC<UpdatePermissionScreenProps> = ({onClose, permissionData}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState<string | undefined>("");

    const {editPermissionSuccess} = useSelector((state: RootState) => state.permission);

    useEffect(() => {
        if (!permissionData) {
            onClose();
        }

        setName(permissionData?.name);

    }, [permissionData]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(updatePermission({id: permissionData?.id, name}));

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
        if (editPermissionSuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Permission updated successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(fetchPermissions());
        }
    }, [editPermissionSuccess, onClose, dispatch]);

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update Permission</DialogTitle>
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
                    </div>

                    <StyledButton
                        variant="contained"
                        color="primary"
                        value="submit"
                        type="submit"
                        fullWidth
                    >
                        Update Permission
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default UpdatePermissionScreen;
