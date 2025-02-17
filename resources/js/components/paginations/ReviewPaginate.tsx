import React from "react";
import {Link} from "react-router-dom";
import {Pagination, PaginationItem} from "@mui/material";

interface ReviewPaginateProps {
    product: string | number | null;
    page: number;
    pages: number;
}

const ReviewPaginate: React.FC<ReviewPaginateProps> = ({product, page, pages}) => {
    return (
        pages > 1 && (
            <Pagination
                count={pages}
                page={page}
                renderItem={(item) => (
                    <PaginationItem
                        aria-label={`Go to page ${item.page}`}
                        component={Link}
                        to={`/reviews/product/${product}/${item.page}`}
                        {...item}
                    />
                )}
            />
        )
    );
};

export default ReviewPaginate;
