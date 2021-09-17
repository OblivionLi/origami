import React from "react";
import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const SpecialOffersPaginate = ({ page, pages }) => {
    return (
        pages > 1 && (
            <Pagination>
                {[...Array(pages).keys()].map(x => (
                    <LinkContainer
                        key={x + 1}
                        to={
                            `/special-offers/${x + 1}`
                        }
                    >
                        <Pagination.Item active={x + 1 === page}>
                            {x + 1}
                        </Pagination.Item>
                    </LinkContainer>
                ))}
            </Pagination>
        )
    );
};

export default SpecialOffersPaginate;
