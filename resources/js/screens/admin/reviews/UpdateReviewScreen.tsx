import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    TextField,
    Divider,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import Swal from "sweetalert2";
import {fetchAdminReviewsList, Review, updateReview} from "@/features/review/reviewSlice";
import {AppDispatch, RootState} from "@/store";
import {StyledButton} from "@/styles/muiStyles";

interface UpdateReviewScreenProps {
    onClose: () => void;
    reviewData: Review | null;
}

const UpdateReviewScreen: React.FC<UpdateReviewScreenProps> = ({onClose, reviewData}) => {
    const dispatch = useDispatch<AppDispatch>();

    const [userComment, setUserComment] = useState<string | undefined>("");
    const [adminComment, setAdminComment] = useState<string | undefined>("");

    const {editReviewSuccess} = useSelector((state: RootState) => state.review);

    useEffect(() => {
        if (!reviewData) {
            onClose();
        }

        setUserComment(reviewData?.user_comment);
        setAdminComment(reviewData?.admin_comment);

    }, [reviewData]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        dispatch(updateReview({id: reviewData?.id, user_comment: userComment, admin_comment: adminComment}));

        Swal.mixin({
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
    };

    useEffect(() => {
        if (editReviewSuccess) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: `Review updated successfully`,
                showConfirmButton: false,
                timer: 2500,
                width: "65rem",
            });
            onClose();
            dispatch(fetchAdminReviewsList());
        }
    }, [editReviewSuccess, onClose, dispatch]);

    return (
        <>
            <DialogTitle id="draggable-dialog-title">Update Review</DialogTitle>
            <Divider/>
            <DialogContent>
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
                                value={userComment}
                                onChange={(e) => setUserComment(e.target.value)}
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

                    <StyledButton
                        variant="contained"
                        color="primary"
                        value="submit"
                        type="submit"
                        fullWidth
                    >
                        Update Review
                    </StyledButton>
                </form>
            </DialogContent>
        </>
    );
};

export default UpdateReviewScreen;
