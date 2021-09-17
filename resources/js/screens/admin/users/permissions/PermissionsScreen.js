import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogActions, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Moment from "react-moment";
import Swal from "sweetalert2";
import {
    getPermissionsList,
    deletePermission,
} from "./../../../../actions/permissionActions";
import Loader from "./../../../../components/alert/Loader";
import Message from "./../../../../components/alert/Message";
import UpdatePermissionScreen from "./UpdatePermissionScreen";
import AddPermissionScreen from "./AddPermissionScreen";

const useStyles = makeStyles((theme) => ({
    divider: {
        marginBottom: "20px",
        borderBottom: "1px solid #855C1B",
        paddingBottom: "10px",
        width: "30%",

        [theme.breakpoints.down("sm")]: {
            width: "90%",
            margin: "0 auto 20px auto",
        },

        color: "#855C1B",
        fontFamily: "Quicksand",
    },

    materialTable: {
        fontFamily: "Quicksand",
        fontWeight: "bold",
        color: "#388667",
    },

    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#388667",

        "&:hover": {
            backgroundColor: "#855C1B",
        },
    },
}));

const PermissionsScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const user_perms = [];

    const [isAdmin, setIsAdmin] = useState(false);
    const [permId, setPermissionId] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [requestData, setRequestData] = useState(new Date());

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const permissionList = useSelector((state) => state.permissionList);
    const { loading, error, permissions } = permissionList;

    const permissionDelete = useSelector((state) => state.permissionDelete);
    const { loading: loadingDelete, success } = permissionDelete;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            if (!user_perms.includes("admin_view_perms")) {
                history.push("/admin/users");

                Swal.fire(
                    "Sorry!",
                    `You don't have access to this action.`,
                    "warning"
                );
            } else {
                setIsAdmin(true);
                dispatch(getPermissionsList());
            }
        }
    }, [dispatch, userInfo, requestData]);

    if (!Array.isArray(user_perms) || !user_perms.length) {
        userInfo.data.details[0].permissions.map((perm) =>
            user_perms.push(perm.name)
        );
    }

    const handleAddDialogOpen = (e) => {
        if (user_perms.includes("admin_add_perms")) {
            setOpenAddDialog(true);
        } else {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
        }
    };

    const handleAddDialogClose = (e) => {
        setOpenAddDialog(false);
    };

    const handleEditDialogOpen = (id) => {
        if (user_perms.includes("admin_edit_perms")) {
            setOpenEditDialog(true);
            setPermissionId(id);
        } else {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
        }
    };

    const handleEditDialogClose = (e) => {
        setOpenEditDialog(false);
    };

    const deletePermissionHandler = (id) => {
        if (user_perms.includes("admin_delete_perms")) {
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
                    dispatch(deletePermission(id));
                    setRequestData(new Date());
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
        } else {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
        }
    };

    return (
        <Paper className="admin-content">
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader />
                </div>
            ) : (
                <>
                    <h2 className={classes.divider}>Permissions</h2>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialTable
                            title="Permissions List"
                            components={{
                                Container: (props) => (
                                    <Paper
                                        className={classes.materialTable}
                                        {...props}
                                    />
                                ),
                            }}
                            columns={[
                                {
                                    title: "Name",
                                    field: "name",
                                },
                                {
                                    title: "Created At",
                                    field: "created_at",
                                    render: (permissions) => {
                                        return (
                                            <Moment format="DD/MM/YYYY HH:mm">
                                                {permissions.created_at}
                                            </Moment>
                                        );
                                    },
                                },
                                {
                                    title: "Updated At",
                                    field: "updated_at",
                                    render: (permissions) => {
                                        return (
                                            <Moment format="DD/MM/YYYY HH:mm">
                                                {permissions.created_at}
                                            </Moment>
                                        );
                                    },
                                },
                            ]}
                            data={permissions && permissions.data}
                            actions={[
                                {
                                    icon: "add",
                                    tooltip: "Add Permission",
                                    isFreeAction: true,
                                    onClick: (event) =>
                                        handleAddDialogOpen(event),
                                },
                                (rowData) => ({
                                    icon: "edit",
                                    tooltip: "Edit Permission",
                                    onClick: (event, rowData) => {
                                        handleEditDialogOpen(rowData.id);
                                    },
                                }),

                                (rowData) => ({
                                    icon: "delete",
                                    tooltip: "Delete Permission",
                                    onClick: (event, rowData) => {
                                        deletePermissionHandler(rowData.id);
                                    },
                                }),
                            ]}
                            options={{
                                actionsColumnIndex: -1,
                                headerStyle: {
                                    color: "#855C1B",
                                    fontFamily: "Quicksand",
                                    fontSize: "1.2rem",
                                    backgroundColor: "#FDF7E9",
                                },
                            }}
                        />
                    )}

                    <Dialog
                        open={openEditDialog}
                        aria-labelledby="draggable-dialog-title"
                        onClose={handleEditDialogClose}
                        fullWidth
                        disableScrollLock={true}
                    >
                        <UpdatePermissionScreen
                            setOpenEditDialog={setOpenEditDialog}
                            setRequestData={setRequestData}
                            permId={permId}
                        />

                        <DialogActions>
                            <Button
                                onClick={handleEditDialogClose}
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                            >
                                Cancel
                            </Button>
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
                            setOpenAddDialog={setOpenAddDialog}
                            setRequestData={setRequestData}
                        />

                        <DialogActions>
                            <Button
                                onClick={handleAddDialogClose}
                                variant="contained"
                                color="secondary"
                                className={classes.button}
                            >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                </>
            )}
        </Paper>
    );
};

export default PermissionsScreen;
