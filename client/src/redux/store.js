import {  configureStore , combineReducers } from "@reduxjs/toolkit";
import userReducer from './user/userSlice'
import themeReducer from './theme/themeSlice'
import { persistReducer } from 'redux-persist'
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";



// if we have more than one reducer we combine them 
const rootReducer = combineReducers({
    user : userReducer,
    theme : themeReducer,
});

const persistConfig  = {
    key : 'root',
    storage,
    version : 1,
};

const persistedReducer =persistReducer(persistConfig , rootReducer)

export const store = configureStore({
    reducer : persistedReducer,
    //we use middleware to not get an error
    middleware : (getDefaultMiddleware) => getDefaultMiddleware(
        {serializableCheck:false}
    )
});


export const persistor = persistStore(store);