import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Divider,
    FormControl,
    DialogContent,
    DialogTitle,
    FormLabel,
    FormHelperText,
    Checkbox,
    FormControlLabel,
    FormGroup,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import {
    getRole,
    editRole,
    getRolesList,
} from "./../../../../actions/roleActions";
import { getPermissionsList } from "./../../../../actions/permissionActions";
import Loader from "../../../../components/alert/Loader.js";
import Message from "../../../../components/alert/Message.js";

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const UpdateRoleScreen = ({ setOpenEditDialog, setRequestData, roleId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [isAdmin, setIsAdmin] = useState("");
    const [perms, setPerms] = useState([]);

    const [successModal, setSuccessModal] = useState(false);
    const [roleEmpty, setRoleEmpty] = useState(true);

    const roleShow = useSelector((state) => state.roleShow);
    const { loading, error, role } = roleShow;
    const { data } = role;

    const roleUpdate = useSelector((state) => state.roleUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = roleUpdate;

    const permissionList = useSelector((state) => state.permissionList);
    const { permissions } = permissionList;

    useEffect(() => {
        if (roleEmpty) {
            dispatch(getRole(roleId));
            dispatch(getPermissionsList());
            setRoleEmpty(false);
        } else {
            if (data) {
                setName(data.name);
                setIsAdmin(data.is_admin);

                let currentPerms = [];
                if (perms) {
                    data &&
                        data.permissions.map((perm) =>
                            currentPerms.push(+perm.id)
                        );

                    setPerms(currentPerms);
                }
            }
        }

        if (successModal) {
            dispatch(getRolesList());
        }
    }, [roleEmpty, data, successModal]);

    const handlePermCheckbox = (e) => {
        let newPerms = perms;
        let index;

        if (e.target.checked) {
            newPerms.push(+e.target.value);
        } else {
            index = newPerms.indexOf(+e.target.value);
            newPerms.splice(index, 1);
        }

        setPerms(newPerms);
    };

    const handleIsAdminCheckbox = (e) => {
        let isAdmin;
        e.target.checked ? (isAdmin = 1) : (isAdmin = 0);
        setIsAdmin(isAdmin);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(editRole(roleId, name, isAdmin, perms));

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenEditDialog(false);

        Swal.fire({
            position: "center",
            icon: "success",
            title: `Role updated successfully`,
            showConfirmButton: false,
            timer: 2500,
            width: "65rem",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update Role</DialogTitle>
            <Divider />
            <DialogContent>
                {loadingUpdate && <Loader />}
                {errorUpdate && (
                    <Message variant="error">{errorUpdate}</Message>
                )}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Message variant="error">{error}</Message>
                ) : (
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
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">
                                        Make this Role for Admin purposes
                                    </FormLabel>
                                    <FormGroup
                                        row
                                        onChange={handleIsAdminCheckbox}
                                    >
                                        <div className="form__field--checkboxes">
                                            <FormControlLabel
                                                value={isAdmin}
                                                control={
                                                    <Checkbox
                                                        style={{
                                                            color: "#388667",
                                                        }}
                                                        checked={
                                                            isAdmin &&
                                                            isAdmin == 1
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                }
                                                label="Is Admin?"
                                                name="isadmin"
                                            />
                                        </div>
                                    </FormGroup>
                                </FormControl>
                            </div>

                            {Object.keys(role).length != 0 && (
                                <div className="form__field">
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">
                                            Choose Permissions
                                        </FormLabel>
                                        <FormGroup
                                            row
                                            onChange={handlePermCheckbox}
                                        >
                                            <div className="form__field--checkboxes">
                                                {permissions &&
                                                    Object.keys(permissions)
                                                        .length != 0 &&
                                                    permissions.data.map(
                                                        (permission, i) => {
                                                            return (
                                                                <FormControlLabel
                                                                    key={
                                                                        permission.id
                                                                    }
                                                                    value={
                                                                        permission.id
                                                                    }
                                                                    control={
                                                                        <Checkbox
                                                                            style={{
                                                                                color: "#388667",
                                                                            }}
                                                                            defaultChecked={
                                                                                data &&
                                                                                data.permissions.some(
                                                                                    (
                                                                                        p
                                                                                    ) =>
                                                                                        p.id ===
                                                                                        permission.id
                                                                                )
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                        />
                                                                    }
                                                                    label={
                                                                        permission.name
                                                                    }
                                                                    name="permission"
                                                                />
                                                            );
                                                        }
                                                    )}
                                            </div>
                                        </FormGroup>
                                        <FormHelperText>
                                            Be consistent with distributing
                                            permissions between users.
                                        </FormHelperText>
                                    </FormControl>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            value="submit"
                            type="submit"
                            fullWidth
                            className={classes.button}
                        >
                            Update Role
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default UpdateRoleScreen;
