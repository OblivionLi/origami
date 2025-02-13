import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../../components/Navbar.js";
import NavbarCategories from "./../../../components/NavbarCategories";
import Footer from "../../../components/Footer.js";
import { getOrigami } from "./../../../actions/categoryActions";
import Loader from "../../../components/alert/Loader.js";
import Message from "../../../components/alert/Message.js";
import {
    Breadcrumbs,
    Paper,
    Typography,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
    Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import OrigamiPaginate from "./../../../components/paginations/OrigamiPaginate";
import ReactPaginate from "react-paginate";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Rating from "@material-ui/lab/Rating";

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
}));

const OrigamiScreen = ({ match }) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [childCatSlug, setChildCatSlug] = useState("");

    const origamiList = useSelector((state) => state.origamiList);
    const { loading, error, origamies } = origamiList;
    const { childCat, productsWithPag, products } = origamies;

    const page = match.params.page || 1;
    let current_page = productsWithPag && productsWithPag.current_page;
    let last_page = productsWithPag && productsWithPag.last_page;

    const [pageNumber, setPageNumber] = useState(0);
    const productsPerPage = 6;
    const pagesVisited = pageNumber * productsPerPage;
    const pageCount = Math.ceil(filteredProducts.length / productsPerPage);

    const displayFilteredProducts = (
        filteredProducts &&
        filteredProducts.slice(pagesVisited, pagesVisited + productsPerPage)
    ).map((product) => {
        return (
            <Card className={classes.card} key={product.id}>
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
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
                        <Rating
                            size="small"
                            name="rating"
                            value={parseFloat(product.rating)}
                            text={`${product.total_reviews} reviews`}
                            precision={0.5}
                            className={classes.rating}
                            readOnly
                        />
                    </Box>
                    <span className="card-content--span">
                        &euro;{product.price}
                    </span>
                </CardActions>
            </Card>
        );
    });
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
    // ======================

    useEffect(() => {
        dispatch(getOrigami(page));
    }, [dispatch, page]);

    const handleCategory = (id, slug) => {
        setFilteredProducts(
            products && products.filter((item) => item.child_category_id == id)
        );

        setChildCatSlug(slug);
    };

    return (
        <>
            <Navbar />
            <NavbarCategories />
            <section className="ctn">
                {loading ? (
                    <div className="loaderCenter">
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
                                    Origami Collection
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
                                            href="/origami"
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
                                        <OrigamiPaginate
                                            page={current_page}
                                            pages={last_page}
                                        />
                                    ) : (
                                        <ReactPaginate
                                            previousLabel={<ChevronLeftIcon />}
                                            nextLabel={<ChevronRightIcon />}
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

            <hr className="divider2" />
            <Footer />
        </>
    );
};

export default OrigamiScreen;
