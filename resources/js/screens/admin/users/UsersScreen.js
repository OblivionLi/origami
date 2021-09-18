import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogActions, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Message from "./../../../components/alert/Message";
import Loader from "./../../../components/alert/Loader";
import Moment from "react-moment";
import UpdateUserScreen from "./UpdateUserScreen";
import { getUsersList, deleteUser } from "../../../actions/userActions";
import Swal from "sweetalert2";

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

const UsersScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const user_perms = [];

    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [requestData, setRequestData] = useState(new Date());

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userList = useSelector((state) => state.userList);
    const { loading, error, users } = userList;

    const userDelete = useSelector((state) => state.userDelete);
    const { loading: loadingDelete, success } = userDelete;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            if (!user_perms.includes("admin_view_users")) {
                history.push("/admin");

                Swal.fire(
                    "Sorry!",
                    `You don't have access to this action.`,
                    "warning"
                );
            } else {
                setIsAdmin(true);
                dispatch(getUsersList());
            }
        }
    }, [dispatch, userInfo, requestData]);

    if (!Array.isArray(user_perms) || !user_perms.length) {
        userInfo.data.details[0].permissions.map((perm) =>
            user_perms.push(perm.name)
        );
    }

    const handleEditDialogOpen = (id) => {
        if (user_perms.includes("admin_edit_users")) {
            setOpenEditDialog(true);
            setUserId(id);
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

    const deleteUserHandler = (id) => {
        if (user_perms.includes("admin_delete_users")) {
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
                    dispatch(deleteUser(id));
                    setRequestData(new Date());
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
                    <h2 className={classes.divider}>Users</h2>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialTable
                            title="Users List"
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
                                    title: "Username",
                                    field: "name",
                                },
                                {
                                    title: "Email",
                                    field: "email",
                                },
                                {
                                    title: "Role",
                                    field: "roles[0].name",
                                },
                                {
                                    title: "Date Joined",
                                    field: "created_at",
                                    render: (users) => {
                                        
                                            return (
                                                <Moment format="DD/MM/YYYY HH:mm">
                                                    {users.created_at}
                                                </Moment>
                                            );
                                        
                                    },
                                },
                                {
                                    title: "Updated At",
                                    field: "updated_at",
                                    render: (users) => {
                                        
                                            return (
                                                <Moment format="DD/MM/YYYY HH:mm">
                                                    {users.created_at}
                                                </Moment>
                                         );
                                        
                                    },
                                },
                            ]}
                            data={users && users.data}
                            actions={[
                                (rowData) => ({
                                    icon: "edit",
                                    tooltip: "Edit User",
                                    onClick: (event, rowData) => {
                                        handleEditDialogOpen(rowData.user_id);
                                    },
                                }),

                                (rowData) => ({
                                    icon: "delete",
                                    tooltip: "Delete User",
                                    onClick: (event, rowData) => {
                                        deleteUserHandler(rowData.id);
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
                                        {!rowData.address ? (
                                            <h2 className="table-detail--title">
                                                User didn't set their details
                                                yet.
                                            </h2>
                                        ) : (
                                            <>
                                                <h2 className="table-detail--title">
                                                    Full Name
                                                </h2>
                                                <div className="table-detail--par">
                                                    <p>
                                                        {
                                                            rowData.address[0]
                                                                .name
                                                        }{" "}
                                                        {
                                                            rowData.address[0]
                                                                .surname
                                                        }
                                                    </p>
                                                </div>

                                                <h2 className="table-detail--title">
                                                    Full Address
                                                </h2>
                                                <div className="table-detail--par">
                                                    <p>
                                                        {`Country: ${rowData.address[0].country}`}
                                                        {", "}
                                                        {`City: ${rowData.address[0].city}`}
                                                        {", "}
                                                        {`Street: ${rowData.address[0].address}`}
                                                        {", "}
                                                        {`Postal Code: ${rowData.address[0].postal_code}`}
                                                    </p>
                                                </div>

                                                <h2 className="table-detail--title">
                                                    Phone Number
                                                </h2>
                                                <div className="table-detail--par">
                                                    <p>
                                                        {
                                                            rowData.address[0]
                                                                .phone_number
                                                        }
                                                    </p>
                                                </div>
                                            </>
                                        )}
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
                        <UpdateUserScreen
                            setOpenEditDialog={setOpenEditDialog}
                            setRequestData={setRequestData}
                            userId={userId}
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
                </>
            )}
        </Paper>
    );
};

export default UsersScreen;
