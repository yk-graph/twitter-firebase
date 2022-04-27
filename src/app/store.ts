<<<<<<< HEAD
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
=======
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
>>>>>>> firebase-ver8-material-ver4

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
