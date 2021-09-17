import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./../../../components/Navbar";
import NavbarCategories from "./../../../components/NavbarCategories";
import Footer from "./../../../components/Footer";
import { getSpecialOffers } from "./../../../actions/categoryActions";
import Loader from "../../../components/alert/Loader";
import Message from "../../../components/alert/Message";
import {
    Breadcrumbs,
    Paper,
    Typography,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    CardActions,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import SpecialOffersPaginate from './../../../components/paginations/SpecialOffersPaginate';

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

const SpecialOffers = ({ match }) => {
    const classes = useStyles();

    const dispatch = useDispatch();

    const specialOfferList = useSelector((state) => state.specialOfferList);
    const { loading, error, offers } = specialOfferList;
    const { data } = offers;

    const page = match.params.page || 1;
    let current_page = offers && offers.current_page;
    let last_page = offers && offers.last_page;

    useEffect(() => {
        dispatch(getSpecialOffers(page));
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
                                <Typography className="bc-p">
                                    Origami Collection
                                </Typography>
                            </Breadcrumbs>
                        </Paper>

                        <div className="category">
                            <div className="category--products">
                                <div className="category--products-items">
                                    {data &&
                                        data.map((product) => (
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
                                                    <span className="card-content--span">
                                                        &euro;{product.price}
                                                    </span>
                                                </CardActions>
                                            </Card>
                                        ))}
                                </div>

                                <div className="category--products-pag">
                                    {data && data.length > 0 && (
                                        <SpecialOffersPaginate
                                            page={current_page}
                                            pages={last_page}
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

export default SpecialOffers;
