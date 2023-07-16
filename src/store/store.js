import { configureStore } from '@reduxjs/toolkit'
import homeSlice from './homeSlice';

export const store = configureStore({
  reducer: {
    home: homeSlice // store value of action
  },
});

// redux file 