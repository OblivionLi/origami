import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    TextField,
    Divider,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import Swal from "sweetalert2";
import {AppDispatch, RootState} from "@/store";
import {createPermission, fetchPermissions} from "@/features/permission/permissionSlice";
import {StyledButton} from "@/styles/muiStyles";

interface AddPermissionScreenProps {
    onClose: () => void;
}

const AddPermissionScreen: React.FC<AddPermissionScreenProps> = ({onClose}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState<string | undefined>("");
    const {addPermissionSuccess} = useSelector((state: RootState) => state.permission);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(createPermission({name}));
    };

    useEffect(() => {
        if (addPermissionSuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Permission created successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(fetchPermissions());
        }
    }, [dispatch, onClose, addPermissionSuccess]);

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Add Permission</DialogTitle>
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
                        Add Permission
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default AddPermissionScreen;
