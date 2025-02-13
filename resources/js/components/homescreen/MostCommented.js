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
import Loader from "../alert/Loader.js";
import { Link } from "react-router-dom";

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

const MostCommented = ({ mostCommented }) => {
    const classes = useStyles();

    return (
        <section className="ctn">
            <Paper elevation={3} className="content-title">
                <h2 className={classes.divider}>Most Commented Products</h2>
            </Paper>

            <div className="content">
                <div className="content__products">
                    {!mostCommented ? (
                        <Loader />
                    ) : (
                        mostCommented.map((product) => (
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
                                    <Link to={`/product/${product.slug}`}>
                                        View Product
                                    </Link>

                                    <span className="card-content--span2">
                                        {product.total_reviews > 0
                                            ? `${product.total_reviews} Review/s`
                                            : "No Reviews Yet"}
                                    </span>
                                </CardActions>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default MostCommented;
