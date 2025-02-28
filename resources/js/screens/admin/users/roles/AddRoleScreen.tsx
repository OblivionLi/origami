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
import {createRole, fetchRoles} from "@/features/role/roleSlice";
import {StyledButton} from "@/styles/muiStyles";

interface AddRoleScreenProps {
    onClose: () => void;
}

const AddRoleScreen: React.FC<AddRoleScreenProps> = ({onClose}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState<string | undefined>("");

    const {addRoleSuccess} = useSelector((state: RootState) => state.role);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(createRole({name}));

        Swal.fire({
            position: "center",
            icon: "success",
            title: `Role created successfully`,
            showConfirmButton: false,
            timer: 2500,
            width: "65rem",
        });
    };

    useEffect(() => {
        if (addRoleSuccess) {
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
    }, [dispatch, onClose, addRoleSuccess]);

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Add Role</DialogTitle>
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
                        Add Role
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default AddRoleScreen;
