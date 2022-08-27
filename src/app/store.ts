import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import imageScrollerReducer from '../features/imageScroller/imageScrollerSlice';

export const store = configureStore({
  reducer: {
    imageScroller: imageScrollerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
