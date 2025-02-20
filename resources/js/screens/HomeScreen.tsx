import React, {useEffect} from "react";
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from "@/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NavbarCategories from "@/components/NavbarCategories";
import {getShowcaseList} from "@/features/product/productSlice";
import {StyledDivider3} from "@/styles/muiStyles";
import Loader from "@/components/alert/Loader";
import Message from "@/components/alert/Message";
import LatestProducts from "@/components/homescreen/LatestProducts";
import LatestDiscounts from "@/components/homescreen/LatestDiscounts";
import MostCommented from "@/components/homescreen/MostCommented";

interface HomeScreenProps {
}

const HomeScreen: React.FC<HomeScreenProps> = () => {
    const dispatch = useDispatch<AppDispatch>();

    const productShowcase = useSelector((state: RootState) => state.product);
    const {showcase, loading, error} = productShowcase;

    useEffect(() => {
        dispatch(getShowcaseList());
    }, [dispatch]);

    return (
        <>
            <Navbar/>
            <NavbarCategories/>

            {loading && (
                <>
                    <div className="loaderCenter">
                        <Loader/>
                    </div>
                </>
            )}
            {error && <Message variant="error">Product showcases not loaded.</Message>}

            {showcase && (
                <>
                    <LatestProducts latestProducts={showcase.latestProducts}/>
                    <LatestDiscounts latestDiscounts={showcase.latestDiscounts}/>
                    <MostCommented mostCommented={showcase.mostCommented}/>
                </>
            )}

            <StyledDivider3/>

            <Footer/>
        </>
    );
};

export default HomeScreen;
