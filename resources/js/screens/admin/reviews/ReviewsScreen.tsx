import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Dialog, DialogActions, Paper, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import MaterialTable from "material-table";
import Moment from "react-moment";
import Swal from "sweetalert2";
import {getReviewsList, deleteReview} from "./../../../actions/reviewActions";
import UpdateReviewScreen from "./UpdateReviewScreen";
import Loader from "../../../components/alert/Loader.js";
import Message from "../../../components/alert/Message.js";
import {Link, useNavigate} from "react-router-dom";
import {AppDispatch, RootState} from "@/store";
import {fetchReviews, Review} from "@/features/review/reviewSlice";
import {fetchChildCategories} from "@/features/categories/childCategorySlice";
import {getUserRolesPermissions} from "@/features/user/userSlice";

interface ReviewsScreenProps {
}

const ReviewsScreen: React.FC<ReviewsScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [isAdmin, setIsAdmin] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [reviewToBeEdited, setReviewToBeEdited] = useState<Review | null>(null);

    const {
        userInfo,
        userPermissions,
    } = useSelector((state: RootState) => state.user);

    const {
        reviews,
        loading,
        error
    } = useSelector((state: RootState) => state.review);

    useEffect(() => {
        if (!userInfo || userInfo?.data?.is_admin != 1) {
            navigate("/login");
        } else {
            setIsAdmin(true);
            dispatch(fetchReviews());
        }
    }, [dispatch, userInfo, navigate]);

    useEffect(() => {
        if (!userPermissions || userPermissions?.length === 0) {
            dispatch(getUserRolesPermissions({id: userInfo?.data?.id}));
        }
    }, [dispatch, userPermissions]);

    useEffect(() => {
        if (userPermissions && !userPermissions?.includes('admin_view_reviews')) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );

            navigate('/admin');
        }
    }, [dispatch, userPermissions]);

    const handleEditDialogOpen = useCallback((review: any) => {
        if (userPermissions?.includes("admin_edit_reviews")) {
            setReviewToBeEdited(review);
            setOpenEditDialog(true);
        } else {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
        }
    }, [userPermissions]);

    const handleEditDialogClose = useCallback(() => {
        setOpenEditDialog(false);
        setReviewToBeEdited(null);
        dispatch(resetEditReviewSuccess());
    }, []);

    const deleteReviewHandler = (id: number) => {
        if (!userPermissions?.includes("admin_delete_reviews")) {
            Swal.fire(
                "Sorry!",
                `You don't have access to this action.`,
                "warning"
            );
            return;
        }

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
    };

    return (
        <Paper className="admin-content">
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader/>
                </div>
            ) : (
                <>
                    <h2 className={classes.divider}>Reviews</h2>
                    {loading ? (
                        <Loader/>
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
                                        return (
                                            <Link
                                                to={`/product/${reviews.product.slug}`}
                                                className={classes.link}
                                                target="_blank"
                                            >
                                                {reviews.product.name}
                                            </Link>
                                        );
                                    },
                                },
                                {
                                    title: "Review Edit By (admin)",
                                    field: "product.name",
                                    render: (reviews) => {
                                        return reviews.admin_name == null
                                            ? " - "
                                            : reviews.admin_name;
                                    },
                                },
                                {
                                    title: "Created At",
                                    field: "created_at",
                                    render: (reviews) => {
                                        return (
                                            <Moment format="DD/MM/YYYY HH:mm">
                                                {reviews.created_at}
                                            </Moment>
                                        );
                                    },
                                },
                                {
                                    title: "Updated At",
                                    field: "updated_at",
                                    render: (reviews) => {
                                        return (
                                            <Moment format="DD/MM/YYYY HH:mm">
                                                {reviews.created_at}
                                            </Moment>
                                        );
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
