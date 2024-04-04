import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'dark',
  isSidebarOpen: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTheme: (state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      state.theme = newTheme;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { setTheme, toggleSidebar } = authSlice.actions;

export default authSlice.reducer;
