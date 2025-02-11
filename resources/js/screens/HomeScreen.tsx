import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NavbarCategories from "../components/NavbarCategories";
import LatestProducts from "../components/homescreen/LatestProducts";
import LatestDiscounts from "../components/homescreen/LatestDiscounts";
import MostCommented from "../components/homescreen/MostCommented";
import { getShowcaseList } from './../actions/productActions';

const HomeScreen: React.FC<HomeScreenProps> = () => {
    const dispatch = useDispatch();

    const [isShowcaseEmpty, setIsShowcaseEmpty] = useState(true)

    const productShowcase = useSelector((state) => state.productShowcase);
    const { showcase } = productShowcase;

    useEffect(() => {
        isShowcaseEmpty ? dispatch(getShowcaseList()) : setIsShowcaseEmpty(false);
    }, [isShowcaseEmpty])

    return (
        <>
            <Navbar />
            <NavbarCategories />

            <LatestProducts latestProducts={showcase && showcase.latestProducts} />
            <LatestDiscounts latestDiscounts={showcase && showcase.latestDiscounts} />
            <MostCommented mostCommented={showcase && showcase.mostCommented} />

            <hr className="divider2" />

            <Footer />
        </>
    );
};

export default HomeScreen;
