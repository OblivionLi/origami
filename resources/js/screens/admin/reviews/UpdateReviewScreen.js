import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    TextField,
    Button,
    Divider,
    DialogContent,
    DialogTitle,
} from "@material-ui/core";
import Swal from "sweetalert2";
import { makeStyles } from "@material-ui/core/styles";
import {
    getReviewsList,
    getReview,
    editReview,
} from "./../../../actions/reviewActions";
import Loader from "./../../../components/alert/Loader";
import Message from "./../../../components/alert/Message";

const useStyles = makeStyles((theme) => ({
    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const UpdateReviewScreen = ({
    setOpenEditDialog,
    setRequestData,
    reviewId,
}) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [comment, setComment] = useState("");
    const [adminComment, setAdminComment] = useState("");

    const [successModal, setSuccessModal] = useState(false);
    const [reviewEmpty, setReviewEmpty] = useState(true);

    const reviewShow = useSelector((state) => state.reviewShow);
    const { loading, error, review } = reviewShow;
    const { data } = review;

    const reviewUpdate = useSelector((state) => state.reviewUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = reviewUpdate;

    useEffect(() => {
        if (reviewEmpty) {
            dispatch(getReview(reviewId));
            setReviewEmpty(false);
        } else {
            if (data) {
                setComment(data.user_comment);
                setAdminComment(data.admin_comment);
            }
        }

        if (successModal) {
            dispatch(getReviewsList());
        }
    }, [reviewEmpty, data, successModal]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(editReview(reviewId, comment, adminComment));

        setRequestData(new Date());
        setSuccessModal(true);
        setOpenEditDialog(false);

        Swal.fire({
            position: "center",
            icon: "success",
            title: `Review updated successfully`,
            showConfirmButton: false,
            timer: 2500,
            width: "65rem",
        });
    };

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update Review</DialogTitle>
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
                                    name="comment"
                                    label="User Comment"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form__field">
                                <TextField
                                    variant="outlined"
                                    name="admin_comment"
                                    label="Admin Comment"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={adminComment ? adminComment : ""}
                                    onChange={(e) =>
                                        setAdminComment(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            variant="contained"
                            color="primary"
                            value="submit"
                            type="submit"
                            fullWidth
                            className={classes.button}
                        >
                            Update Review
                        </Button>
                    </form>
                )}
            </DialogContent>
        </>
    );
};

export default UpdateReviewScreen;
