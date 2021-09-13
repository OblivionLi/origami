import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./../../../components/Navbar";
import NavbarCategories from "./../../../components/NavbarCategories";
import Loader from "./../../../components/alert/Loader";
import Message from "./../../../components/alert/Message";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography, Breadcrumbs, Divider } from "@material-ui/core";
import { Link } from "react-router-dom";
import { getReviewsPagList } from "../../../actions/reviewActions";
import Rating from "@material-ui/lab/Rating";
import ReviewPaginate from "../../../components/ReviewPaginate";

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
    },

    card: {
        maxWidth: 345,
        minWidth: 345,
        boxShadow:
            "0px 3px 3px -2px rgb(190 142 76), 0px 3px 4px 0px rgb(190 142 76), 0px 1px 8px 0px rgb(190 142 76)",
    },

    media: {
        height: 345,
        width: "100%",
    },

    button: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",
        color: "white",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },
}));

const ReviewsScreen = ({ match }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const page = match.params.page || 1;

    const reviewListPag = useSelector((state) => state.reviewListPag);
    const { loading, error, reviews } = reviewListPag;

    let current_page = reviews && reviews.meta && reviews.meta.current_page;
    let last_page = reviews && reviews.meta && reviews.meta.last_page;

    useEffect(() => {
        dispatch(getReviewsPagList(match.params.id, page));
    }, [dispatch, page]);


    return (
        <>
            <Navbar />
            <NavbarCategories />

            <section className="ctn">
                {loading ? (
                    <div className="product">
                        <Loader />
                    </div>
                ) : error ? (
                    <Message variant="error">{error}</Message>
                ) : (
                    <>
                        <Paper elevation={3} className="content-title">
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link color="inherit" to="/" className="bc">
                                    Homescreen
                                </Link>
                                <Link
                                    color="inherit"
                                    to={`/product/${
                                        reviews &&
                                        reviews.data &&
                                        reviews.data[0].product.slug
                                    }`}
                                    className="bc"
                                >
                                    {reviews &&
                                        reviews.data &&
                                        reviews.data[0].product.name}
                                </Link>
                                <Typography className="bc-p">
                                    Reviews
                                </Typography>
                            </Breadcrumbs>
                        </Paper>

                        <Paper className="product__container">
                            <h3 className="divider">Reviews</h3>
                            <div className="review">
                                {reviews.data &&
                                    reviews.data.map((review) => (
                                        <Paper
                                            key={review.id}
                                            className="product__container3"
                                        >
                                            <div className="review-top">
                                                <h3>{review.user_name}</h3>
                                                <Rating
                                                    size="small"
                                                    name="rating"
                                                    value={parseFloat(
                                                        review.rating
                                                    )}
                                                    precision={0.5}
                                                    readOnly
                                                    className={classes.rating}
                                                />
                                            </div>
                                            <Divider />

                                            <div className="review-bottom">
                                                <p className="product__paper--p">
                                                    {review.user_comment}
                                                </p>

                                                <p className="review-bottom--date">
                                                    {review.created_at.substring(
                                                        0,
                                                        10
                                                    )}
                                                </p>
                                            </div>

                                            {review.admin_name ||
                                            review.admin_comment ? (
                                                <>
                                                    <Divider />

                                                    <div className="review-bottom">
                                                        <p>
                                                            User comment was
                                                            edited by{" "}
                                                            <span className="reviewEdited">
                                                                {
                                                                    review.admin_name
                                                                }
                                                            </span>{" "}
                                                            because of the
                                                            following motives:{" "}
                                                            <span className="reviewEdited">
                                                                {
                                                                    review.admin_comment
                                                                }
                                                            </span>
                                                        </p>

                                                        <p>
                                                            Date of edit:{" "}
                                                            {review.updated_at.substring(
                                                                0,
                                                                10
                                                            )}
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </Paper>
                                    ))}
                            </div>

                            {console.log(reviews)}

                            {reviews.data &&
                                reviews.data.length > 0 &&
                                !loading && (
                                    <div className="pagination">
                                        <ReviewPaginate
                                            product={match.params.id}
                                            page={current_page}
                                            pages={last_page}
                                        />
                                    </div>
                                )}
                        </Paper>
                    </>
                )}
            </section>
        </>
    );
};

export default ReviewsScreen;
