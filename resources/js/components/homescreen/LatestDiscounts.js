import React from "react";
import {
    Paper,
    makeStyles,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
    Button,
} from "@material-ui/core";

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
        maxWidth: 320,
        boxShadow:
            "0px 3px 3px -2px rgb(190 142 76), 0px 3px 4px 0px rgb(190 142 76), 0px 1px 8px 0px rgb(190 142 76)",
    },

    media: {
        height: 340,
    },
}));

const LatestDiscounts = () => {
    const classes = useStyles();

    return (
        <section className="ctn">
            <Paper elevation={3} className="content-title">
                <h2 className={classes.divider}>Latest Product Discounts</h2>
            </Paper>

            <div className="content">
                <div className="content__products">
                    <Card className={classes.card}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="http://127.0.0.1:8000/storage/img1.jpeg"
                                title="Contemplative Reptile"
                            />
                            <CardContent className="card-content">
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="h2"
                                    className="card-content-h2"
                                >
                                    Lizard
                                </Typography>
                                <Typography
                                    variant="body2"
                                    component="p"
                                    className="card-content-p"
                                >
                                    Lizards are a widespread group of squamate
                                    reptiles, with over 6,000 species, ranging
                                    across all continents except Antarctica
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions className="card-content">
                            <Button size="small" color="primary">
                                View Product
                            </Button>

                            <div className="card-content--span">
                                <span>
                                    &euro;
                                    1.55
                                    {/* {(
                                        mostDiscountedProduct.price -
                                        (mostDiscountedProduct.price *
                                            mostDiscountedProduct.discount) /
                                            100
                                    ).toFixed(2)} */}
                                </span>
                                {" - "}
                                <strike>
                                    &euro;
                                    2.99
                                    {/* {mostDiscountedProduct.price} */}
                                </strike>
                            </div>
                        </CardActions>
                    </Card>
                    <Card className={classes.card}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="http://127.0.0.1:8000/storage/img1.jpeg"
                                title="Contemplative Reptile"
                            />
                            <CardContent className="card-content">
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="h2"
                                    className="card-content-h2"
                                >
                                    Lizard
                                </Typography>
                                <Typography
                                    variant="body2"
                                    component="p"
                                    className="card-content-p"
                                >
                                    Lizards are a widespread group of squamate
                                    reptiles, with over 6,000 species, ranging
                                    across all continents except Antarctica
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions className="card-content">
                            <Button size="small" color="primary">
                                View Product
                            </Button>
                            <div className="card-content--span">
                                <span>
                                    &euro;
                                    1.55
                                    {/* {(
                                        mostDiscountedProduct.price -
                                        (mostDiscountedProduct.price *
                                            mostDiscountedProduct.discount) /
                                            100
                                    ).toFixed(2)} */}
                                </span>
                                {" - "}
                                <strike>
                                    &euro;
                                    2.99
                                    {/* {mostDiscountedProduct.price} */}
                                </strike>
                            </div>
                        </CardActions>
                    </Card>
                    <Card className={classes.card}>
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="http://127.0.0.1:8000/storage/img1.jpeg"
                                title="Contemplative Reptile"
                            />
                            <CardContent className="card-content">
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="h2"
                                    className="card-content-h2"
                                >
                                    Lizard
                                </Typography>
                                <Typography
                                    variant="body2"
                                    component="p"
                                    className="card-content-p"
                                >
                                    Lizards are a widespread group of squamate
                                    reptiles, with over 6,000 species, ranging
                                    across all continents except Antarctica
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions className="card-content">
                            <Button size="small" color="primary">
                                View Product
                            </Button>
                            <div className="card-content--span">
                                <span>
                                    &euro;
                                    1.55
                                    {/* {(
                                        mostDiscountedProduct.price -
                                        (mostDiscountedProduct.price *
                                            mostDiscountedProduct.discount) /
                                            100
                                    ).toFixed(2)} */}
                                </span>
                                {" - "}
                                <strike>
                                    &euro;
                                    2.99
                                    {/* {mostDiscountedProduct.price} */}
                                </strike>
                            </div>
                        </CardActions>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export default LatestDiscounts;
