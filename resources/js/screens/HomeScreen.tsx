import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from "@/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavbarCategories from "@/components/NavbarCategories";
import LatestProducts from "../components/homescreen/LatestProducts";
import LatestDiscounts from "../components/homescreen/LatestDiscounts";
import MostCommented from "../components/homescreen/MostCommented";
import {getShowcaseList} from './../actions/productActions';

interface ShowcaseData {
    latestProducts: any[];
    latestDiscounts: any[];
    mostCommented: any[];
}

interface HomeScreenProps {
}

const HomeScreen: React.FC<HomeScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();

    const productShowcase = useSelector((state: RootState) => state.product);
    const {showcase, loading, error} = productShowcase;

    useEffect(() => {
        dispatch(getShowcaseList());
    }, [dispatch]);

    // const [isShowcaseEmpty, setIsShowcaseEmpty] = useState(true)
    //
    // const productShowcase = useSelector((state) => state.productShowcase);
    // const {showcase} = productShowcase;
    //
    // useEffect(() => {
    //     isShowcaseEmpty ? dispatch(getShowcaseList()) : setIsShowcaseEmpty(false);
    // }, [isShowcaseEmpty])

    return (
        <>
            <Navbar/>
            <NavbarCategories/>

            <LatestProducts latestProducts={showcase.latestProducts || []}/>
            <LatestDiscounts latestDiscounts={showcase.latestDiscounts || []}/>
            <MostCommented mostCommented={showcase.mostCommented || []}/>

            <hr className="divider2"/>

            <Footer/>
        </>
    );
};

export default HomeScreen;
