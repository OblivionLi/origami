import React, {useState, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import Navbar from "@/components/Navbar.js";
import NavbarCategories from "@/components/NavbarCategories.js";
import Footer from "@/components/Footer.js";
import Loader from "@/components/alert/Loader.js";
import Message from "@/components/alert/Message.js";
import {
    Typography,
    CardActionArea,
    CardContent,
    CardActions,
    Box, Paper, Breadcrumbs,
} from "@mui/material";
import {Link, useNavigate, useParams} from "react-router-dom";
import {AppDispatch, RootState} from "@/store";
import {
    ChildCategory,
    fetchProductsByOrigamiCategory,
    Product
} from "@/features/categories/categorySlice";
import {StyledCard, StyledCardMedia, StyledRating, StyledReviewText} from "@/styles/muiStyles";
import {ASSET_URL} from "@/config";
import MasterPagination from "@/components/paginations/MasterPagination";

interface OrigamiScreenProps {
}

const OrigamiScreen: React.FC<OrigamiScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {page: pageParam = '1'} = useParams();
    const page = parseInt(pageParam, 10);

    const [childCategorySlug, setChildCategorySlug] = useState<string>("");
    const [childCategoryId, setChildCategoryId] = useState<number | null>(null);

    const {loading, error, products, childCategories, meta} = useSelector((state: RootState) => state.categoryProduct);

    const current_page = meta?.current_page ?? 1;
    const last_page = meta?.last_page ?? 1;

    useEffect(() => {
        dispatch(fetchProductsByOrigamiCategory({page, childCategoryId}));
    }, [dispatch, page, childCategoryId]);

    const handleCategory = (id: number, slug: string) => {
        setChildCategoryId(id);
        setChildCategorySlug(slug);

        if (page !== 1) {
            navigate('/origami/1');
        }
    };

    const handleShowAll = () => {
        setChildCategoryId(null);
        setChildCategorySlug("");

        if (page !== 1) {
            navigate('/origami')
        }
    }

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
                                {childCategorySlug && (
                                    <Typography className="bc-p">
                                        {childCategorySlug.toUpperCase()}
                                    </Typography>
                                )}
                            </Breadcrumbs>
                        </Paper>

                        <div className="category">
                            <div className="category--sidebar">
                                <div className="category--sidebar-title">
                                    <h4>Sub-Categories</h4>
                                </div>

                                <ul>
                                    <li className="category--sidebar-title-item">
                                        <Link
                                            to={'/accessories'}
                                            onClick={handleShowAll}
                                        >
                                            Show All
                                        </Link>
                                    </li>
                                    {childCategories &&
                                        childCategories.map((child: ChildCategory) => (
                                            <li
                                                key={child.id}
                                                className="category--sidebar-title-item"
                                            >
                                                <p
                                                    onClick={() =>
                                                        handleCategory(
                                                            child.id,
                                                            child.slug
                                                        )
                                                    }
                                                    className={
                                                        childCategorySlug ==
                                                        child.slug
                                                            ? "active"
                                                            : "filterButtons"
                                                    }
                                                >
                                                    {child.name}
                                                </p>
                                            </li>
                                        ))}
                                </ul>

                                <p className="info">
                                    If a category has 0 products, then all
                                    products will be displayed.
                                </p>
                            </div>
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
                                                                precision={
                                                                    0.5
                                                                }
                                                                readOnly
                                                            />
                                                            <StyledReviewText>
                                                                {`${product.total_reviews} reviews`}
                                                            </StyledReviewText>
                                                        </Box>
                                                        <span className="card-content--span">
                                                              &euro;
                                                            {product.price}
                                                          </span>
                                                    </CardActions>
                                                </StyledCard>
                                            )
                                        )}
                                </div>

                                <div className="category--products-pag">
                                    <MasterPagination
                                        baseURL={`/origami`}
                                        page={current_page}
                                        pages={last_page}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>

            <hr className="divider2"/>
            <Footer/>
        </>
    );
};

export default OrigamiScreen;
