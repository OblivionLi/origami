import React, {useState, useEffect} from "react";
import {AppDispatch, RootState} from "@/store";
import {Link, useParams, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loader from "@/components/alert/Loader.js";
import NavbarCategories from "@/components/NavbarCategories.js";
import Navbar from "@/components/Navbar.js";
import Footer from "@/components/Footer.js";
import Message from "@/components/alert/Message.js";
import {
    Breadcrumbs,
    Paper,
    Typography,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
    Box,
    Rating
} from "@mui/material";
import {StyledCard, StyledCardMedia, StyledDivider, StyledRating} from "@/styles/muiStyles";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import AccessoriesPaginate from "./../../../components/paginations/AccessoriesPaginate";
import ReactPaginate from "react-paginate";
import {getAccessories} from "./../../../actions/categoryActions";
import {Product} from '@/features/product/productSlice';

const AccessoriesScreen = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {page: pageParam = '1'} = useParams();
    const page = parseInt(pageParam, 10);



    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [childCatSlug, setChildCatSlug] = useState("");

    const accessoryList = useSelector((state: RootState) => state.category);
    const {loading, error, accessories} = accessoryList;
    // const {childCat, productsWithPag, products} = accessories;

    const current_page = accessories?.meta?.current_page ?? 1;
    const last_page = accessories?.meta?.last_page ?? 1;

    // let current_page = productsWithPag && productsWithPag.current_page;
    // let last_page = productsWithPag && productsWithPag.last_page;

    const [pageNumber, setPageNumber] = useState(0);
    const productsPerPage = 6;
    const pagesVisited = pageNumber * productsPerPage;
    const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

    const displayFilteredProducts = (
        filteredProducts &&
        filteredProducts.slice(pagesVisited, pagesVisited + productsPerPage)
    ).map((product) => {
        return (
            <StyledCard key={product.id}>
                <CardActionArea>
                    <StyledCardMedia
                        image={`http://127.0.0.1:8000/storage/${product.product_images[0].path}`}
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
                            {product.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions className="card-content">
                    <Link to={`/product/${product.slug}`}>View Product</Link>
                    <Box
                        component="fieldset"
                        borderColor="transparent"
                        className={classes.box}
                    >
                        <StyledRating
                            size="small"
                            name="rating"
                            value={parseFloat(product.rating)}
                            text={`${product.total_reviews} reviews`}
                            precision={0.5}
                            readOnly
                        />
                    </Box>
                    <span className="card-content--span">
                        &euro;{product.price}
                    </span>
                </CardActions>
            </StyledCard>
        );
    });

    const changePage = ({selected}) => {
        setPageNumber(selected);
    };
    // ======================

    useEffect(() => {
        dispatch(getAccessories(page));
    }, [dispatch, page]);

    const handleCategory = (id, slug) => {
        setFilteredProducts(
            products && products.filter((item) => item.child_category_id == id)
        );

        setChildCatSlug(slug);
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
                                    Accessories
                                </Typography>
                                {childCatSlug && (
                                    <Typography className="bc-p">
                                        {childCatSlug.toUpperCase()}
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
                                        <a
                                            href="/accessories"
                                            className="filterLink"
                                        >
                                            Show All
                                        </a>
                                    </li>
                                    {childCat &&
                                        childCat.map((child) => (
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
                                                        childCatSlug ==
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
                                    {filteredProducts == ""
                                        ? productsWithPag &&
                                        productsWithPag.data.map(
                                            (product) => (
                                                <Card
                                                    className={classes.card}
                                                    key={product.id}
                                                >
                                                    <CardActionArea>
                                                        <CardMedia
                                                            className={
                                                                classes.media
                                                            }
                                                            image={`http://127.0.0.1:8000/storage/${product.product_images[0].path}`}
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
                                                            className={
                                                                classes.box
                                                            }
                                                        >
                                                            <Rating
                                                                size="small"
                                                                name="rating"
                                                                value={parseFloat(
                                                                    product.rating
                                                                )}
                                                                text={`${product.total_reviews} reviews`}
                                                                precision={
                                                                    0.5
                                                                }
                                                                className={
                                                                    classes.rating
                                                                }
                                                                readOnly
                                                            />
                                                        </Box>
                                                        <span className="card-content--span">
                                                              &euro;
                                                            {product.price}
                                                          </span>
                                                    </CardActions>
                                                </Card>
                                            )
                                        )
                                        : displayFilteredProducts}
                                </div>

                                <div className="category--products-pag">
                                    {filteredProducts == "" ? (
                                        <AccessoriesPaginate
                                            page={current_page}
                                            pages={last_page}
                                        />
                                    ) : (
                                        <ReactPaginate
                                            previousLabel={<ChevronLeftIcon/>}
                                            nextLabel={<ChevronRightIcon/>}
                                            pageCount={pageCount}
                                            onPageChange={changePage}
                                            containerClassName={
                                                "category--products-pag--buttons"
                                            }
                                            previousLinkClassName={
                                                "category--products-pag--previous"
                                            }
                                            nextLinkClassName={
                                                "category--products-pag--next"
                                            }
                                            disabledClassName={
                                                "category--products-pag--disabled"
                                            }
                                            activeClassName={
                                                "category--products-pag--active"
                                            }
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </section>

            <StyledDivider/>
            <Footer/>
        </>
    );
};

export default AccessoriesScreen;
