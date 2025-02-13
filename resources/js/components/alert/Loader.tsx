import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

interface LoaderProps {
}

const Loader: React.FC<LoaderProps> = () => {
    return (
        <CircularProgress/>
    )
}

export default Loader
