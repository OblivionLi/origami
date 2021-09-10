import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper } from "@material-ui/core";
import Loader from "../../components/alert/Loader";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    divider: {
        marginBottom: "20px",
        borderBottom: "1px solid #855C1B",
        paddingBottom: "10px",
        width: "30%",

        [theme.breakpoints.down("sm")]: {
            width: "90%",
            margin: "0 auto 20px auto",
        },

        color: '#855C1B',
        fontFamily: 'Quicksand'
    },
}));

const DashboardScreen = ({ history }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [isAdmin, setIsAdmin] = useState(false);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (!userInfo || userInfo == null || userInfo.data.is_admin != 1) {
            history.push("/login");
        } else {
            setIsAdmin(true);
        }
    }, [userInfo]);

    return (
        <>
            {!isAdmin ? (
                <div className="admin-loader">
                    <Loader />
                </div>
            ) : (
                <>
                    <Paper className="admin-content">
                        <h2 className={classes.divider}>Dashboard</h2>
                    </Paper>
                </>
            )}
        </>
    );
};

export default DashboardScreen;
