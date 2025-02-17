import React from "react";

const NavbarCategories = () => {

    return (
        <div className="categories">
            <nav className="categories__nav">
                <ul className="categories__nav-list">
                    <li className="categories__nav-list--item acc">
                        <a
                            href="/accessories"
                            className="categories__nav-list--item-menu"
                        >
                            Accessories
                        </a>
                    </li>

                    <li className="categories__nav-list--item ori">
                        <a
                            href="/origami"
                            className="categories__nav-list--item-menu"
                        >
                            Origami Collection
                        </a>
                    </li>

                    <li className="categories__nav-list--item spec">
                        <a
                            href="/special-offers"
                            className="categories__nav-list--item-menu"
                        >
                            Special Offers
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default NavbarCategories;
