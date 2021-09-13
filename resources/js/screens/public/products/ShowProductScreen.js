import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./../../../components/Navbar";
import NavbarCategories from "./../../../components/NavbarCategories";
import { makeStyles } from "@material-ui/core/styles";
import Footer from "./../../../components/Footer";
import {
    Paper,
    Typography,
    Breadcrumbs,
    Divider,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    TextField,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { getProduct } from "./../../../actions/productActions";
import Loader from "./../../../components/alert/Loader";
import Rating from "@material-ui/lab/Rating";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Message from "./../../../components/alert/Message";
import { REVIEW_STORE_RESET } from "../../../constants/reviewConstants";
import { createReview } from "../../../actions/reviewActions";
import Swal from "sweetalert2";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { set } from "lodash";

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

    button2: {
        fontFamily: "Quicksand",
        backgroundColor: "#855C1B",

        "&:hover": {
            backgroundColor: "#388667",
        },
    },

    link2: {
        color: 'wheat',

        '&:hover': {
            color: 'wheat',
            textDecoration: 'none',
        }
    }
}));

const ShowProductScreen = ({ history, match }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const productSlug = match.params.slug;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [qty, setQty] = useState(1);

    const productShow = useSelector((state) => state.productShow);
    const { loading, error, product } = productShow;
    const { data } = product;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const reviewStore = useSelector((state) => state.reviewStore);
    const { success: successProductReview, error: errorProductReview } =
        reviewStore;

    useEffect(() => {
        if (successProductReview) {
            setRating(0);
            setComment("");
            dispatch({ type: REVIEW_STORE_RESET });
        }

        dispatch(getProduct(productSlug));
    }, [dispatch, successProductReview]);

    const addToCartHandler = (e) => {
        // history.push(`/cart/${}`)
    };

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(
            createReview(
                productSlug,
                userInfo.data.id,
                userInfo.data.name,
                rating,
                comment
            )
        );
    };

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
                                <Typography className="bc-p">
                                    {data && data.name}
                                </Typography>
                            </Breadcrumbs>
                        </Paper>
                        <div className="product">
                            <div className="product__carousel">
                                <Carousel>
                                    {data &&
                                        data.images.map((image) => (
                                            <div key={image.id}>
                                                <img
                                                    className="product__carousel-img"
                                                    src={`http://127.0.0.1:8000/storage/${image.path}`}
                                                    title={`Image id: ${data.name}`}
                                                />
                                            </div>
                                        ))}
                                </Carousel>
                            </div>

                            <Paper className="product__paper">
                                <div className="product__paper--rating">
                                    {data && data.total_quantities > 1 ? (
                                        <p className="inStock">
                                            &#8226; Product in stock.
                                        </p>
                                    ) : (
                                        <p className="notInStock">
                                            &#8226; Not in stock.
                                        </p>
                                    )}

                                    <Rating
                                        size="small"
                                        name="rating"
                                        value={parseFloat(data && data.rating)}
                                        text={`${
                                            data && data.total_reviews
                                        } reviews`}
                                        precision={0.5}
                                        className={classes.rating}
                                        readOnly
                                    />
                                    <Divider />
                                </div>

                                <div className="product__paper--details">
                                    <div>
                                        <h4 className="divider">
                                            Product Name:
                                        </h4>
                                        <p className="product__paper--p">
                                            {data && data.name}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="divider">
                                            Product Code:
                                        </h4>
                                        <p className="product__paper--p">
                                            {data && data.product_code}
                                        </p>
                                    </div>
                                </div>
                            </Paper>

                            {data && data.total_quantities > 0 && (
                                <Paper className="product__paper">
                                    <div className="product__paper--div">
                                        <h4 className="divider">Discount:</h4>
                                        <p className="product__paper--p">
                                            {data && data.discount} %
                                        </p>
                                    </div>

                                    <div className="product__paper--div">
                                        <h4 className="divider">Price:</h4>
                                        <span
                                            color="inherit"
                                            className="product__paper--p"
                                        >
                                            &euro;
                                            {(
                                                data &&
                                                data.price -
                                                    (data.price *
                                                        data.discount) /
                                                        100
                                            ).toFixed(2)}
                                        </span>
                                        {" - "}
                                        <strike>
                                            &euro;
                                            {data && data.price}
                                        </strike>
                                    </div>

                                    <div className="product__paper--div">
                                        <h4 className="divider">Quantity:</h4>
                                        <p className="product__paper--p">
                                            {data && data.total_quantities} left
                                        </p>
                                    </div>

                                    <hr className="divider" />

                                    <div className="product-tabel-form">
                                        <form>
                                            <div className="form__field">
                                                <Button
                                                    variant="contained"
                                                    className={classes.button}
                                                    type="button"
                                                    onClick={addToCartHandler}
                                                    disabled={
                                                        data &&
                                                        data.total_quantities ==
                                                            0
                                                    }
                                                >
                                                    Add to Cart
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </Paper>
                            )}
                        </div>

                        <Paper className="product__container">
                            <h3 className="divider">Product Description</h3>
                            <p className="product__paper--p">
                                {data && data.description} left
                            </p>
                        </Paper>

                        <Paper className="product__container">
                            <h3 className="divider">Reviews</h3>
                            {data && data.reviews.length === 0 && (
                                <Message variant="info">No Reviews</Message>
                            )}

                            <Accordion className={classes.accord}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.heading}>
                                        Open Review form
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {userInfo ? (
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
                                                            <Divider />

                                                            <Rating
                                                                size="small"
                                                                name="Rating Label"
                                                                precision={0.5}
                                                                value={rating}
                                                                onChange={(
                                                                    e,
                                                                    newValue
                                                                ) => {
                                                                    setRating(
                                                                        newValue
                                                                    );
                                                                }}
                                                                className={
                                                                    classes.rating
                                                                }
                                                                required
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
                                                <Button
                                                    variant="contained"
                                                    className={classes.button}
                                                    name="submit"
                                                    type="submit"
                                                    fullWidth
                                                >
                                                    Add Review
                                                </Button>
                                            </form>
                                        </Paper>
                                    ) : (
                                        <Message variant="error">
                                            Please{" "}
                                            <Link to="/login">sign in</Link> to
                                            write a review.
                                        </Message>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        </Paper>

                        <Paper className="product__container">
                            {data &&
                                data.reviews.map((review) => (
                                    <Paper
                                        key={review.id}
                                        className="product__container2"
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


                            {data && data.reviews.length > 1 && (
                                <Button size="small" className={classes.button2}>
                                    <Link
                                        to={`/reviews/product/${data.id}`}
                                        className={classes.link2}
                                    >
                                        View all Reviews
                                    </Link>
                                </Button>
                            )}
                        </Paper>
                    </>
                )}
            </section>

            <hr className="divider2" />
            <Footer />
        </>
    );
};

export default ShowProductScreen;
