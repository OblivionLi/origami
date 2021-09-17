import React from "react";
import { Link } from "react-router-dom";
import { GiGemNecklace, GiFoldedPaper } from "react-icons/gi";
import { MdLocalOffer } from "react-icons/md";
import { IoMdMail } from "react-icons/io";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-container--links">
                    <h2 className="footer-container--title">Categories</h2>
                    <ul>
                        <li>
                            <GiGemNecklace className="icon" /> <Link className="footer-container-link" to="/accessories">Accessories</Link>
                        </li>
                        <li>
                            <GiFoldedPaper className="icon" />{" "}
                            <Link className="footer-container-link" to="/origami">Origami Collection</Link>
                        </li>
                        <li>
                            <MdLocalOffer className="icon" /> <Link className="footer-container-link" to="/special-offers">Special Offers</Link>
                        </li>
                    </ul>
                </div>

                <div className="footer-container--contact">
                    <h2 className="footer-container--title">Contact</h2>
                    <div>
                        <IoMdMail className="icon" />{" "}
                        <a className="footer-container-link" href="mailto:yona@gmail.com">yonashop@gmail.com</a>
                    </div>
                </div>
            </div>

            <hr className="divider3" />

            <p className="footer-copyright">&copy; Copyright 2021</p>
        </footer>
    );
};

export default Footer;
