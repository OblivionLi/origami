import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogActions, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Moment from "react-moment";
import Swal from "sweetalert2";
import { getRolesList, deleteRole } from "./../../../../actions/roleActions";
import UpdateRoleScreen from "./UpdateRoleScreen";
import Loader from "./../../../../components/alert/Loader";
import Message from "./../../../../components/alert/Message";
import AddRoleScreen from "./AddRoleScreen";

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

const RolesScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const user_perms = [];

    const [isAdmin, setIsAdmin] = useState(false);
    const [roleId, setRoleId] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [requestData, setRequestData] = useState(new Date());

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const roleList = useSelector((state) => state.roleList);
    const { loading, error, roles } = roleList;

    const roleDelete = useSelector((state) => state.roleDelete);
    const { loading: loadingDelete, success } = roleDelete;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            if (!user_perms.includes("admin_view_roles")) {
                history.push("/admin/users");

                Swal.fire(
                    "Sorry!",
                    `You don't have access to this action.`,
                    "warning"
                );
            } else {
                setIsAdmin(true);
                dispatch(getRolesList());
            }
        }
    }, [dispatch, userInfo, requestData]);

    if (!Array.isArray(user_perms) || !user_perms.length) {
        userInfo.data.details[0].permissions.map((perm) =>
            user_perms.push(perm.name)
        );
    }

    const handleAddDialogOpen = (e) => {
        if (user_perms.includes("admin_add_roles")) {
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
        if (user_perms.includes("admin_edit_roles")) {
            setOpenEditDialog(true);
            setRoleId(id);
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

    const deleteRoleHandler = (id) => {
        if (user_perms.includes("admin_delete_roles")) {
            Swal.fire({
                title: "Are you sure?",
                text: `You can't recover this role after deletion!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                cancelButtonColor: "#d33",
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    dispatch(deleteRole(id));
                    setRequestData(new Date());
                    Swal.fire(
                        "Deleted!",
                        "The role with the id " + id + " has been deleted.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire(
                        "Cancelled",
                        `The selected role is safe, don't worry :)`,
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
                    <h2 className={classes.divider}>Roles</h2>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialTable
                            title="Roles List"
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
                                    title: "Is Admin?",
                                    field: "is_admin",
                                    render: (roles) => {
                                        return roles.is_admin == 1
                                            ? "Yes"
                                            : "No";
                                    },
                                },
                                {
                                    title: "Role's users count",
                                    field: "roles",
                                    render: (roles) => {
                                        return roles.users.length;
                                    },
                                },
                                {
                                    title: "Created At",
                                    field: "created_at",
                                    render: (roles) => {
                                        return (
                                            <Moment format="DD/MM/YYYY HH:mm">
                                                {roles.created_at}
                                            </Moment>
                                        );
                                    },
                                },
                                {
                                    title: "Updated At",
                                    field: "updated_at",
                                    render: (roles) => {
                                        return (
                                            <Moment format="DD/MM/YYYY HH:mm">
                                                {roles.created_at}
                                            </Moment>
                                        );
                                    },
                                },
                            ]}
                            data={roles && roles.data}
                            actions={[
                                {
                                    icon: "add",
                                    tooltip: "Add Role",
                                    isFreeAction: true,
                                    onClick: (event) =>
                                        handleAddDialogOpen(event),
                                },
                                (rowData) => ({
                                    icon: "edit",
                                    tooltip: "Edit Role",
                                    onClick: (event, rowData) => {
                                        handleEditDialogOpen(rowData.id);
                                    },
                                }),

                                (rowData) => ({
                                    icon: "delete",
                                    tooltip: "Delete Role",
                                    onClick: (event, rowData) => {
                                        deleteRoleHandler(rowData.id);
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
                            detailPanel={(rowData) => {
                                return (
                                    <div className="table-detail">
                                        <h2 className="table-detail--title">
                                            Permissions
                                        </h2>
                                        <div className="table-detail--par">
                                            {rowData.permissions.length ? (
                                                rowData.permissions.map(
                                                    (permission) => (
                                                        <p
                                                            key={
                                                                permission.name
                                                            }
                                                        >
                                                            {permission.name}
                                                        </p>
                                                    )
                                                )
                                            ) : (
                                                <p>
                                                    This Role ({rowData.name})
                                                    has no permissions.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
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
                        <UpdateRoleScreen
                            setOpenEditDialog={setOpenEditDialog}
                            setRequestData={setRequestData}
                            roleId={roleId}
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
                        <AddRoleScreen
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

export default RolesScreen;
