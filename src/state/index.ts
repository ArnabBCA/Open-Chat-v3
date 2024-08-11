import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPageSearchParam } from '../components/utils/getPageSeachParam';

interface User {
  code: string;
  contacts: string[];
  displayName: string;
  email: string;
  friendReqReceived: string[];
  friendReqSend: string[];
  photoURL: string;
  uid: string;
}

interface AuthState {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  currentUser: User | null;
  currentPage: string;
  messages: [];
}

const initialState: AuthState = {
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  isSidebarOpen: false,
  currentUser: null,
  currentPage: getPageSearchParam(),
  messages: [],
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
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setMessages: (state, action: PayloadAction<[]>) => {
      state.messages = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setCurrentUser,
  setCurrentPage,
  setMessages,
} = authSlice.actions;
export default authSlice.reducer;
