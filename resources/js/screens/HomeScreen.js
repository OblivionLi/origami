import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavbarCategories from "../components/NavbarCategories";
import LatestProducts from "../components/homescreen/LatestProducts";
import LatestDiscounts from "../components/homescreen/LatestDiscounts";
import MostCommented from "../components/homescreen/MostCommented";

const HomeScreen = () => {
    return (
        <>
            <Navbar />
            <NavbarCategories />

            <LatestProducts />
            <LatestDiscounts />
            <MostCommented />

            <hr className="divider2" />

            <Footer />
        </>
    );
};

export default HomeScreen;
