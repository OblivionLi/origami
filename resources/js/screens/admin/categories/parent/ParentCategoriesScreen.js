import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogActions, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Moment from "react-moment";
import Swal from "sweetalert2";
import Loader from "./../../../../components/alert/Loader";
import Message from "./../../../../components/alert/Message";
import {
    getParentCatsList,
    deleteParentCat,
} from "./../../../../actions/parentCategoryActions";
import UpdateParentCategoryScreen from "./UpdateParentCategoryScreen";
import AddParentCategoryScreen from "./AddParentCategoryScreen";

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

const ParentCategoriesScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const user_perms = [];

    const [isAdmin, setIsAdmin] = useState(false);
    const [parentId, setParentId] = useState(null);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [requestData, setRequestData] = useState(new Date());

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const parentCatList = useSelector((state) => state.parentCatList);
    const { loading, error, parentCats } = parentCatList;

    const parentCatDelete = useSelector((state) => state.parentCatDelete);
    const { loading: loadingDelete, success } = parentCatDelete;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            if (!user_perms.includes("admin_view_parentCats")) {
                history.push("/admin");

                Swal.fire(
                    "Sorry!",
                    `You don't have access to this action.`,
                    "warning"
                );
            } else {
                setIsAdmin(true);
                dispatch(getParentCatsList());
            }
        }
    }, [dispatch, userInfo, requestData]);

    if (!Array.isArray(user_perms) || !user_perms.length) {
        userInfo.data.details[0].permissions.map((perm) =>
            user_perms.push(perm.name)
        );
    }

    const handleAddDialogOpen = (e) => {
        if (user_perms.includes("admin_add_parentCats")) {
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
        if (user_perms.includes("admin_edit_parentCats")) {
            setOpenEditDialog(true);
            setParentId(id);
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

    const deleteParentCategoryHandler = (id) => {
        if (user_perms.includes("admin_delete_parentCats")) {
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
                    dispatch(deleteParentCat(id));
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
                    <h2 className={classes.divider}>Parent Categories</h2>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialTable
                            title="Parent Categories List"
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
                                    render: (parentCats) => {
                                        return (
                                            <Moment format="DD/MM/YYYY HH:mm">
                                                {parentCats.created_at}
                                            </Moment>
                                        );
                                    },
                                },
                                {
                                    title: "Updated At",
                                    field: "updated_at",
                                    render: (parentCats) => {
                                        return (
                                            <Moment format="DD/MM/YYYY HH:mm">
                                                {parentCats.created_at}
                                            </Moment>
                                        );
                                    },
                                },
                            ]}
                            data={parentCats && parentCats.data}
                            actions={[
                                {
                                    icon: "add",
                                    tooltip: "Add Parent Category",
                                    isFreeAction: true,
                                    onClick: (event) =>
                                        handleAddDialogOpen(event),
                                },
                                (rowData) => ({
                                    icon: "edit",
                                    tooltip: "Edit Parent Category",
                                    onClick: (event, rowData) => {
                                        handleEditDialogOpen(rowData.slug);
                                    },
                                }),

                                (rowData) => ({
                                    icon: "delete",
                                    tooltip: "Delete Parent Category",
                                    onClick: (event, rowData) => {
                                        deleteParentCategoryHandler(
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
                            detailPanel={(rowData) => {
                                return (
                                    <div className="table-detail">
                                        <h2 className="table-detail--title">
                                            Parent Category's Child Categories
                                        </h2>
                                        <div className="table-detail--par">
                                            {rowData.childCat.length > 0 ? (
                                                rowData.childCat.map(
                                                    (childCat) => (
                                                        <h4 key={childCat}>
                                                            {childCat}
                                                        </h4>
                                                    )
                                                )
                                            ) : (
                                                <p>
                                                    This Parent Category has no child
                                                    categories.
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
                        <UpdateParentCategoryScreen
                            setOpenEditDialog={setOpenEditDialog}
                            setRequestData={setRequestData}
                            parentId={parentId}
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
                        <AddParentCategoryScreen
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

export default ParentCategoriesScreen;
