import { configureStore } from '@reduxjs/toolkit';
import authReducer from './Slices/authslice.js';
import  {apiSlice}  from './Slices/apiSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

export default store;