import React from "react";
import {
    Paper,
    CardActionArea,
    CardContent,
    Typography,
    CardActions,
} from "@mui/material";
import {Link} from "react-router-dom";
import Loader from '@/components/alert/Loader';
import {StyledDivider, StyledCard, StyledCardMedia} from '@/styles/muiStyles';
import {Product} from '@/features/product/productSlice';

interface LatestDiscountsProps {
    latestDiscounts: Product[];
}

const LatestDiscounts: React.FC<LatestDiscountsProps> = ({latestDiscounts}) => {
    return (
        <section className="ctn">
            <Paper elevation={3} className="content-title">
                <StyledDivider>Latest Product Discounts</StyledDivider>
            </Paper>

            <div className="content">
                <div className="content__products">
                    {latestDiscounts.length === 0 ? (
                        <Loader/>
                    ) : (
                        latestDiscounts.map((product) => (
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
                                    <Link to={`/product/${product.slug}`}>
                                        View Product
                                    </Link>

                                    <div className="card-content--span">
                                        {product.price && product.discount && (
                                            <>
                                                <span>
                                                    &euro;
                                                    {(
                                                        product.price -
                                                        (product.price *
                                                            product.discount) /
                                                        100
                                                    ).toFixed(2)}
                                                </span>
                                                {" - "}
                                                <s>&euro; {product.price}</s>
                                            </>
                                        )}
                                    </div>
                                </CardActions>
                            </StyledCard>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default LatestDiscounts;
