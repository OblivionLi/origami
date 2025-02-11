import React from 'react';
import ReactDOM from "react-dom/client";
import Index from "@/Index";
import './bootstrap';
import {store} from './store';
import {Provider} from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <Index/>
        </Provider>
    </React.StrictMode>
);
