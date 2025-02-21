import React, {useEffect, useState} from "react";
import {AppDispatch, RootState} from "@/store";
import {ASSET_URL} from "@/config";
import {useSelector, useDispatch} from "react-redux";
import {Link, useParams, useNavigate} from "react-router-dom";
import {
    Paper,
    Typography,
    Breadcrumbs,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import {Carousel} from "react-responsive-carousel";

import Message from "@/components/alert/Message.js";
import Loader from "@/components/alert/Loader.js";
import Navbar from "@/components/Navbar.js";
import NavbarCategories from "@/components/NavbarCategories.js";
import Footer from "@/components/Footer.js";
import {fetchProductBySlug} from '@/features/product/productSlice';
import {resetReviewState, createReview, Review} from '@/features/review/reviewSlice';
import {StyledButton, StyledDivider3, StyledRating, StyledRatingContainer, StyledReviewText} from "@/styles/muiStyles";
import {ProductImage} from '@/features/product/productSlice';
import {addToCart} from "@/features/cart/cartSlice";


// const useStyles = makeStyles((theme) => ({
//
//     link2: {
//         color: "wheat",
//
//         "&:hover": {
//             color: "wheat",
//             textDecoration: "none",
//         },
//     },
//
//     link: {
//         color: "#855C1B",
//         fontWeight: "600",
//
//         "&:hover": {
//             color: "#388667",
//         },
//     },
// }));

interface ShowProductScreenProps {
}

const ShowProductScreen: React.FC<ShowProductScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {slug: productSlug} = useParams();

    const userLogin = useSelector((state: RootState) => state.user.userInfo);

    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const [qty, setQty] = useState<number>(1);

    const productShow = useSelector((state: RootState) => state.product);
    const {loading, error, currentProduct} = productShow;

    const reviewCreate = useSelector((state: RootState) => state.review);
    const {success: successProductReview, error: errorProductReview} = reviewCreate;

    useEffect(() => {
        if (!userLogin) {
            navigate('/login');
        }

        if (!productSlug) return;

        if (successProductReview) {
            setRating(0);
            setComment("");
            dispatch(resetReviewState());
        }

        dispatch(fetchProductBySlug(productSlug));
    }, [dispatch, productSlug, successProductReview]);

    const addToCartHandler = () => {
        if (!currentProduct) return;

        dispatch(addToCart({product: currentProduct, qty}));

        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener("mouseenter", Swal.stopTimer);
                toast.addEventListener("mouseleave", Swal.resumeTimer);
            },
        });

        Toast.fire({
            icon: "success",
            title: `Added Product ${currentProduct?.name} to cart`,
        });

        navigate('/cart');
    };

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();

        if (!productSlug || !userLogin?.data?.id) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Product or user information is missing!",
            });

            return;
        }

        dispatch(createReview({
            product_id: currentProduct!.id,
            user_id: userLogin.data.id,
            username: userLogin.data.name || "Unknown",
            rating: rating,
            comment: comment
        }));
    };

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
                                <Typography className="bc-p">
                                    {currentProduct?.name}
                                </Typography>
                            </Breadcrumbs>
                        </Paper>
                        <div className="show">
                            <div className="show__carousel">
                                <Carousel showArrows={true}>
                                    {currentProduct?.images && currentProduct.images.map((image: ProductImage) => (
                                        <div key={image.id}>
                                            <img
                                                className="show__carousel-img"
                                                src={`${ASSET_URL}/${image.path}`}
                                                alt={`Image for product: ${currentProduct?.name}`}
                                                title={`Image id: ${currentProduct?.name}`}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            </div>

                            <Paper className="show__paper">
                                <div className="show__paper--rating">
                                    {currentProduct && currentProduct.total_quantities! > 0 ? (
                                        <p className="inStock">
                                            &#8226; Product in stock.
                                        </p>
                                    ) : (
                                        <p className="notInStock">
                                            &#8226; Not in stock.
                                        </p>
                                    )}

                                    <StyledRatingContainer>
                                        <StyledRating
                                            size="small"
                                            name="rating"
                                            value={Number(currentProduct?.rating ?? 0)}
                                            precision={0.5}
                                            readOnly
                                        />
                                        <StyledReviewText>
                                            {`${currentProduct?.total_reviews} reviews`}
                                        </StyledReviewText>
                                    </StyledRatingContainer>
                                    <Divider/>
                                </div>

                                <div className="show__paper--details">
                                    <div>
                                        <h4 className="divider">
                                            Product Name:
                                        </h4>
                                        <p className="show__paper--p">
                                            {currentProduct?.name}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="divider">
                                            Product Code:
                                        </h4>
                                        <p className="show__paper--p">
                                            {currentProduct?.product_code}
                                        </p>
                                    </div>
                                </div>
                            </Paper>

                            {currentProduct && currentProduct.total_quantities! > 0 && (
                                <Paper className="show__paper">
                                    <div className="show__paper--div">
                                        <h4 className="divider">Discount:</h4>
                                        <p className="show__paper--p">
                                            {currentProduct?.discount} %
                                        </p>
                                    </div>

                                    <div className="show__paper--div">
                                        <h4 className="divider">Price:</h4>
                                        <span
                                            color="inherit"
                                            className="show__paper--p"
                                        >
                                            &euro;
                                            {(
                                                currentProduct.price! -
                                                (currentProduct.price! *
                                                    currentProduct.discount!) /
                                                100
                                            ).toFixed(2)}
                                        </span>
                                        {" - "}
                                        <s>
                                            &euro;
                                            {currentProduct?.price}
                                        </s>
                                    </div>

                                    <div className="show__paper--div">
                                        <h4 className="divider">Quantity:</h4>
                                        <p className="show__paper--p">
                                            {currentProduct?.total_quantities} left
                                        </p>
                                    </div>

                                    <hr className="divider"/>

                                    <div className="show-tabel-form">
                                        <form>
                                            <div className="form__field">
                                                <StyledButton
                                                    variant="contained"
                                                    type="button"
                                                    onClick={addToCartHandler}
                                                    disabled={currentProduct?.total_quantities === 0}
                                                >
                                                    Add to Cart
                                                </StyledButton>
                                            </div>
                                        </form>
                                    </div>
                                </Paper>
                            )}
                        </div>

                        <Paper className="show__container">
                            <h3 className="divider">Product Description</h3>
                            <p className="show__paper--p">
                                {currentProduct?.description}
                            </p>
                        </Paper>

                        <Paper className="show__container">
                            <h3 className="divider">Reviews</h3>
                            {currentProduct?.reviews && currentProduct.reviews.length === 0 && (
                                <Message variant="info">No Reviews</Message>
                            )}

                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>
                                        Open Review form
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {userLogin ? (
                                        <Paper
                                            className="reviews-form"
                                            elevation={3}
                                        >
                                            <form onSubmit={submitHandler}>
                                                <div className="form">
                                                    <div className="form__field rating-form">
                                                        <Box
                                                            component="fieldset"
                                                            mb={3}
                                                            borderColor="transparent"
                                                        >
                                                            <Typography component="legend">
                                                                Please Rate our
                                                                product
                                                            </Typography>
                                                            {errorProductReview && (
                                                                <Message variant="error">
                                                                    {
                                                                        errorProductReview
                                                                    }
                                                                </Message>
                                                            )}
                                                            <Divider/>

                                                            <StyledRating
                                                                size="small"
                                                                name="Rating Label"
                                                                precision={0.5}
                                                                value={rating}
                                                                onChange={(event, newValue) => {
                                                                    if (newValue !== null) {
                                                                        setRating(newValue);
                                                                    }
                                                                }}
                                                                // required
                                                            />
                                                        </Box>
                                                    </div>

                                                    <div className="form__field">
                                                        <TextField
                                                            variant="outlined"
                                                            label="Your comment"
                                                            multiline
                                                            rows={4}
                                                            fullWidth
                                                            onChange={(e) =>
                                                                setComment(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            name="comment"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <StyledButton
                                                    variant="contained"
                                                    name="submit"
                                                    type="submit"
                                                    fullWidth
                                                >
                                                    Add Review
                                                </StyledButton>
                                            </form>
                                        </Paper>
                                    ) : (
                                        <Message variant="error">
                                            Please{" "}
                                            <Link
                                                to="/login"
                                            >
                                                sign in
                                            </Link>{" "}
                                            to write a review.
                                        </Message>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        </Paper>

                        {currentProduct?.reviews && currentProduct.reviews.length > 0 && (
                            <Paper className="show__container">
                                {currentProduct.reviews.map((review: Review) => (
                                    <Paper
                                        key={review.id}
                                        className="show__container--content"
                                    >
                                        <div className="review-top">
                                            <h3>{review.user_name}</h3>
                                            <StyledRating
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
                                            <p className="show__paper--p">
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
                                                <Divider/>

                                                <div className="review-bottom">
                                                    <p>
                                                        User comment was edited
                                                        by{" "}
                                                        <span className="reviewEdited">
                                                            {review.admin_name}
                                                        </span>{" "}
                                                        because of the following
                                                        motives:{" "}
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

                                {currentProduct?.reviews.length > 1 && (
                                    <StyledButton
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => {
                                            navigate(`/reviews/product/${currentProduct.id}`)
                                        }}
                                        style={{marginTop: '1.2rem'}}
                                    >
                                        View all Reviews
                                    </StyledButton>
                                )}
                            </Paper>
                        )}
                    </>
                )}
            </section>

            <StyledDivider3/>
            <Footer/>
        </>
    );
};

export default ShowProductScreen;
