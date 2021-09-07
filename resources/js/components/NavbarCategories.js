import React from "react";
import { Link } from "react-router-dom";
import { Paper, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
}));

const NavbarCategories = () => {
    const classes = useStyles();

    return (
        <div className="categories">
            <nav className="categories__nav">
                <ul className="categories__nav-list">
                    <li className="categories__nav-list--item acc">
                        <Link
                            to="/"
                            className="categories__nav-list--item-menu"
                        >
                            Accessories
                        </Link>
                    </li>

                    <li className="categories__nav-list--item ori">
                        <Link
                            to="/"
                            className="categories__nav-list--item-menu"
                        >
                            Origami Collection
                        </Link>
                    </li>

                    <li className="categories__nav-list--item spec">
                        <Link
                            to="/"
                            className="categories__nav-list--item-menu"
                        >
                            Special Offers
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default NavbarCategories;
