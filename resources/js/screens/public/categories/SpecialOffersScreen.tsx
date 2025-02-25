import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Navbar from "@/components/Navbar.js";
import NavbarCategories from "@/components/NavbarCategories.js";
import Footer from "@/components/Footer.js";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {
    Breadcrumbs,
    Paper,
    Typography,
    CardActionArea,
    CardContent,
    CardActions,
    Box,
} from "@mui/material";
import {Link, useParams} from "react-router-dom";
import {AppDispatch, RootState} from "@/store";
import {fetchProductsBySpecialOffers} from "@/features/categories/categorySlice";
import {StyledCard, StyledCardMedia, StyledDivider3, StyledRating, StyledReviewText} from "@/styles/muiStyles";
import MasterPagination from "@/components/paginations/MasterPagination";
import {ASSET_URL} from "@/config";
import {Product} from "@/features/categories/categorySlice";

interface SpecialOffersProps {
}

const SpecialOffers: React.FC<SpecialOffersProps> = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {loading, error, products, meta} = useSelector((state: RootState) => state.categoryProduct);

    const {page: pageParam = '1'} = useParams();
    const page = parseInt(pageParam, 10);

    const current_page = meta?.current_page ?? 1;
    const last_page = meta?.last_page ?? 1;

    useEffect(() => {
        dispatch(fetchProductsBySpecialOffers({page}));
    }, [dispatch, page]);

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
                                    Origami Collection
                                </Typography>
                            </Breadcrumbs>
                        </Paper>

                        <div className="category">
                            <div className="category--products">
                                <div className="category--products-items">
                                    {products &&
                                        products.map((product: Product) => (
                                            <StyledCard key={product.id}>
                                                <CardActionArea>
                                                    <StyledCardMedia
                                                        image={`${ASSET_URL}/${product.product_images[0].path}`}
                                                        title={`Image for product: ${product.name}`}
                                                    />
                                                    <CardContent className="card-content-top">
                                                        <Typography
                                                            gutterBottom
                                                            variant="h5"
                                                            component="h2"
                                                            className="card-content-h2"
                                                        >
                                                            {product.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            component="p"
                                                            className="card-content-p"
                                                        >
                                                            {
                                                                product.description
                                                            }
                                                        </Typography>
                                                    </CardContent>
                                                </CardActionArea>
                                                <CardActions className="card-content">
                                                    <Link
                                                        to={`/product/${product.slug}`}
                                                    >
                                                        View Product
                                                    </Link>
                                                    <Box
                                                        component="fieldset"
                                                        borderColor="transparent"
                                                    >
                                                        <StyledRating
                                                            size="small"
                                                            name="rating"
                                                            value={parseFloat(
                                                                product.rating
                                                            )}
                                                            precision={0.5}
                                                            readOnly
                                                        />
                                                        <StyledReviewText>
                                                            {`${product.total_reviews} reviews`}
                                                        </StyledReviewText>
                                                    </Box>
                                                    <span className="card-content--span">
                                                        &euro;{product.price}
                                                    </span>
                                                </CardActions>
                                            </StyledCard>
                                        ))}
                                </div>

                                <div className="category--products-pag">
                                    <MasterPagination
                                        baseURL={`/special-offers`}
                                        page={current_page}
                                        pages={last_page}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>

            <StyledDivider3/>
            <Footer/>
        </>
    );
};

export default SpecialOffers;
