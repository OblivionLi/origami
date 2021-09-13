import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, DialogActions, Paper, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Moment from "react-moment";
import Swal from "sweetalert2";
import { getReviewsList, deleteReview } from "./../../../actions/reviewActions";
import UpdateReviewScreen from "./UpdateReviewScreen";
import Loader from "./../../../components/alert/Loader";
import Message from "./../../../components/alert/Message";
import { Link } from "react-router-dom";

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

    link: {
        color: "#855C1B",

        "&:hover": {
            color: "#388667",
        },
    },
}));

const ReviewsScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const user_perms = [];

    const [isAdmin, setIsAdmin] = useState(false);
    const [reviewId, setReviewId] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [requestData, setRequestData] = useState(new Date());

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const reviewList = useSelector((state) => state.reviewList);
    const { loading, error, reviews } = reviewList;

    const reviewDelete = useSelector((state) => state.reviewDelete);
    const { loading: loadingDelete, success } = reviewDelete;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            if (!user_perms.includes("admin_view_reviews")) {
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
                dispatch(getReviewsList());
            }
        }
    }, [dispatch, userInfo, requestData]);

    if (!Array.isArray(user_perms) || !user_perms.length) {
        userInfo.data.details[0].permissions.map((perm) =>
            user_perms.push(perm.name)
        );
    }

    const handleEditDialogOpen = (id) => {
        console.log(id)
        if (user_perms.includes("admin_edit_reviews")) {
            setOpenEditDialog(true);
            setReviewId(id);
        } else {
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
                title: "You don't have access to this action",
            });
        }
    };

    const handleEditDialogClose = (e) => {
        setOpenEditDialog(false);
    };

    const deleteReviewHandler = (id) => {
        if (user_perms.includes("admin_delete_reviews")) {
            Swal.fire({
                title: "Are you sure?",
                text: `You can't recover this review after deletion!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                cancelButtonColor: "#d33",
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    dispatch(deleteReview(id));
                    setRequestData(new Date());
                    Swal.fire(
                        "Deleted!",
                        "The review with the id " + id + " has been deleted.",
                        "success"
                    );
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire(
                        "Cancelled",
                        `The selected review is safe, don't worry :)`,
                        "error"
                    );
                }
            });
        } else {
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
                title: "You don't have access to this action",
            });
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
                    <h2 className={classes.divider}>Reviews</h2>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <Message variant="error">{error}</Message>
                    ) : (
                        <MaterialTable
                            title="Reviews List"
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
                                    title: "Review By",
                                    field: "user.name",
                                },
                                {
                                    title: "Product Reviewed",
                                    field: "product.name",
                                    render: (reviews) => {
                                        {
                                            return (
                                                <Link
                                                    to={`/product/${reviews.product.slug}`}
                                                    className={classes.link}
                                                    target="_blank"
                                                >
                                                    {reviews.product.name}
                                                </Link>
                                            );
                                        }
                                    },
                                },
                                {
                                    title: "Review Edit By (admin)",
                                    field: "product.name",
                                    render: (reviews) => {
                                        {
                                            return reviews.admin_name == null
                                                ? " - "
                                                : reviews.admin_name;
                                        }
                                    },
                                },
                                {
                                    title: "Created At",
                                    field: "created_at",
                                    render: (reviews) => {
                                        {
                                            return (
                                                <Moment format="DD/MM/YYYY HH:mm">
                                                    {reviews.created_at}
                                                </Moment>
                                            );
                                        }
                                    },
                                },
                                {
                                    title: "Updated At",
                                    field: "updated_at",
                                    render: (reviews) => {
                                        {
                                            return (
                                                <Moment format="DD/MM/YYYY HH:mm">
                                                    {reviews.created_at}
                                                </Moment>
                                            );
                                        }
                                    },
                                },
                            ]}
                            data={reviews && reviews.data}
                            actions={[
                                (rowData) => ({
                                    icon: "edit",
                                    tooltip: "Edit Review",
                                    onClick: (event, rowData) => {
                                        handleEditDialogOpen(rowData.id);
                                    },
                                }),

                                (rowData) => ({
                                    icon: "delete",
                                    tooltip: "Delete Review",
                                    onClick: (event, rowData) => {
                                        deleteReviewHandler(rowData.id);
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
                                            User's Review Comment
                                        </h2>
                                        <div className="table-detail--par">
                                            {rowData.user_comment}
                                        </div>

                                        {rowData.admin_comment && (
                                            <>
                                                <h2 className="table-detail--title">
                                                    Admin's Review Comment
                                                </h2>
                                                <div className="table-detail--par">
                                                    {rowData.admin_comment}
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
                        <UpdateReviewScreen
                            setOpenEditDialog={setOpenEditDialog}
                            setRequestData={setRequestData}
                            reviewId={reviewId}
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

export default ReviewsScreen;
