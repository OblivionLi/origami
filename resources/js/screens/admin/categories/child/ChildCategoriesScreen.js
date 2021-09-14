import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogActions, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Moment from "react-moment";
import Swal from "sweetalert2";
import {
    getChildCatsList,
    deleteChildCat,
} from "./../../../../actions/childCategoryActions";
import UpdateChildCategoryScreen from "./UpdateChildCategoryScreen";
import AddChildCategoryScreen from "./AddChildCategoryScreen";
import Loader from "./../../../../components/alert/Loader";
import Message from "./../../../../components/alert/Message";

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

const ChildCategoriesScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const user_perms = [];

    const [isAdmin, setIsAdmin] = useState(false);
    const [childId, setChildId] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [requestData, setRequestData] = useState(new Date());

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const childCatList = useSelector((state) => state.childCatList);
    const { loading, error, childCats } = childCatList;

    const childCatDelete = useSelector((state) => state.childCatDelete);
    const { loading: loadingDelete, success } = childCatDelete;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            if (!user_perms.includes("admin_view_childCats")) {
                history.push("/admin");

                const Toast = Swal.mixin({
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

                Toast.fire({
                    icon: "error",
                    title: "You don't have access to this page",
                });
            } else {
                setIsAdmin(true);
                dispatch(getChildCatsList());
            }
        }
    }, [dispatch, userInfo, requestData]);

    if (!Array.isArray(user_perms) || !user_perms.length) {
        userInfo.data.details[0].permissions.map((perm) =>
            user_perms.push(perm.name)
        );
    }

    const handleAddDialogOpen = (e) => {
        if (user_perms.includes("admin_add_childCats")) {
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
        if (user_perms.includes("admin_edit_childCats")) {
            setOpenEditDialog(true);
            setChildId(id);
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

    const deleteChildCategoryHandler = (id) => {
        if (user_perms.includes("admin_delete_childCats")) {
            Swal.fire({
                title: "Are you sure?",
                text: `You can't recover this parent category after deletion!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                cancelButtonColor: "#d33",
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    dispatch(deleteChildCat(id));
                    setRequestData(new Date());
                    Swal.fire(
                        "Deleted!",
                        "The parent category with the id " +
                            id +
                            " has been deleted.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire(
                        "Cancelled",
                        `The selected parent category is safe, don't worry :)`,
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
                    <h2 className={classes.divider}>Child Categories</h2>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialTable
                            title="Child Categories List"
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
                                    title: "Relation (Parent Category)",
                                    field: "parentCat.name",
                                },
                                {
                                    title: "Total Products",
                                    field: "products.length",
                                },
                                {
                                    title: "Created At",
                                    field: "created_at",
                                    render: (childCats) => {
                                        {
                                            return (
                                                <Moment format="DD/MM/YYYY HH:mm">
                                                    {childCats.created_at}
                                                </Moment>
                                            );
                                        }
                                    },
                                },
                                {
                                    title: "Updated At",
                                    field: "updated_at",
                                    render: (childCats) => {
                                        {
                                            return (
                                                <Moment format="DD/MM/YYYY HH:mm">
                                                    {childCats.created_at}
                                                </Moment>
                                            );
                                        }
                                    },
                                },
                            ]}
                            data={childCats && childCats.data}
                            actions={[
                                {
                                    icon: "add",
                                    tooltip: "Add Child Category",
                                    isFreeAction: true,
                                    onClick: (event) =>
                                        handleAddDialogOpen(event),
                                },
                                (rowData) => ({
                                    icon: "edit",
                                    tooltip: "Edit Child Category",
                                    onClick: (event, rowData) => {
                                        handleEditDialogOpen(rowData.slug);
                                    },
                                }),

                                (rowData) => ({
                                    icon: "delete",
                                    tooltip: "Delete Child Category",
                                    onClick: (event, rowData) => {
                                        deleteChildCategoryHandler(
                                            rowData.slug
                                        );
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
                        <UpdateChildCategoryScreen
                            setOpenEditDialog={setOpenEditDialog}
                            setRequestData={setRequestData}
                            childId={childId}
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
                        <AddChildCategoryScreen
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

export default ChildCategoriesScreen;
