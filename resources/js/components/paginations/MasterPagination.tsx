import React from "react";
import {Link} from "react-router-dom";
import {Pagination, PaginationItem} from "@mui/material";

interface MasterPaginationProps {
    page: number;
    pages: number;
    baseURL: string;
    id?: string | number | null;
}

export const MasterPagination: React.FC<MasterPaginationProps> = ({page, pages, baseURL, id = null}) => {
    return (
        pages > 1 && (
            <Pagination
                count={pages}
                page={page}
                renderItem={(item) => (
                    <PaginationItem
                        component={Link}
                        to={`${baseURL}${id ? `/${id}` : ''}/${item.page}`}
                        aria-label={`Go to page ${item.page}`}
                        {...item}
                    />
                )}
            />
        )
    );
};

export default MasterPagination;
