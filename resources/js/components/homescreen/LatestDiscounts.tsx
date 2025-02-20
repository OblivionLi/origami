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
import {ASSET_URL} from "@/config";

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
                <div className="content__products" style={{display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap', gap: '1rem'}}>
                    {latestDiscounts.length === 0 ? (
                        <Loader/>
                    ) : (
                        latestDiscounts.map((product) => (
                            <StyledCard key={product.id}>
                                <CardActionArea>
                                    <StyledCardMedia
                                        image={`${ASSET_URL}/${product.product_images[0].path}`}
                                        title={`Image for product: ${product.name}`}
                                    />
                                    <CardContent className="card-content-top" sx={{flexGrow: 1}}>
                                        <Typography
                                            gutterBottom
                                            variant="h5"
                                            component="h2"
                                            className="card-content-h2"
                                            sx={{
                                                height: '3em',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {product.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            component="p"
                                            className="card-content-p"
                                            sx={{
                                                height: '6em',
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical'
                                            }}
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
