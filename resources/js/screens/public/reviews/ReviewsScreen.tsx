import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {AppDispatch, RootState} from '@/store';
import {Link, useParams} from "react-router-dom";
import Navbar from "@/components/Navbar.js";
import NavbarCategories from "@/components/NavbarCategories.js";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {Paper, Typography, Breadcrumbs, Divider} from "@mui/material";
import Rating from "@mui/material/Rating";
import MasterPagination from "@/components/paginations/MasterPagination";
import Footer from '@/components/Footer.js';
import {fetchReviewsWithPagination} from "@/features/review/reviewSlice";
import {Review} from '@/features/review/reviewSlice'
import {StyledDivider3} from "@/styles/muiStyles";

interface ReviewsScreenProps {
}

const ReviewsScreen: React.FC<ReviewsScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {id: productId, page: pageParam = '1'} = useParams();
    const page = parseInt(pageParam, 10);

    const reviewListPag = useSelector((state: RootState) => state.review);
    const {loading, error, paginatedReviews} = reviewListPag;
    const current_page = paginatedReviews?.meta?.current_page ?? 1;
    const last_page = paginatedReviews?.meta?.last_page ?? 1;

    useEffect(() => {
        if (productId) {
            dispatch(fetchReviewsWithPagination({productId: Number(productId), page: page}));
        }
    }, [dispatch, productId, page]);

    return (
        <>
            <Navbar/>
            <NavbarCategories/>

            <section className="ctn">
                {loading ? (
                    <div className="loaderCenter">
                        <Loader/>
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
                                {paginatedReviews?.data && paginatedReviews.data.length > 0 && (
                                    <Link
                                        color="inherit"
                                        to={`/product/${paginatedReviews.data[0].product.slug}`}
                                        className="bc"
                                    >
                                        {paginatedReviews.data[0].product.name}
                                    </Link>
                                )}
                                <Typography className="bc-p">
                                    Reviews
                                </Typography>
                            </Breadcrumbs>
                        </Paper>

                        <Paper className="show__container">
                            {paginatedReviews?.data && paginatedReviews.data.map((review: Review) => (
                                <Paper
                                    key={review.id}
                                    className="show__container--content"
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
                                        />
                                    </div>
                                    <Divider/>

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

                                    {review.admin_name || review.admin_comment && (
                                        <>
                                            <Divider/>

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
                                    )}
                                </Paper>
                            ))}
                        </Paper>

                        {paginatedReviews?.data && paginatedReviews.data.length > 0 && !loading && (
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <MasterPagination
                                    baseURL={`/reviews/product/${productId}`}
                                    page={current_page}
                                    pages={last_page}
                                />
                            </div>
                        )}
                    </>
                )}
            </section>

            <StyledDivider3/>
            <Footer/>
        </>
    );
};

export default ReviewsScreen;
