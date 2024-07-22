import { configureStore } from '@reduxjs/toolkit';
import MenuReducer from '@/slice/menuSlice';
import ToolboxReducer from '@/slice/toolboxSlice';

export const store = configureStore({
  reducer: {
    menu: MenuReducer,
    toolbox: ToolboxReducer,
    // add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
