import './assets/main.css'
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from "redux-persist";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import './i18n';
import App from './components/App';
import reducers from "./_reducers";
import Working from "./components/Working";
import * as serviceWorker from './serviceWorker';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['form', 'worker', 'alert']
}

const persistedReducer = persistReducer(persistConfig, reducers);

let store = createStore(persistedReducer, applyMiddleware(thunk));
if (process.env.NODE_ENV === 'development') {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));
}
let persistor = persistStore(store)

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={<Working />} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
