import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPageSearchParam } from '../components/utils/getPageSeachParam';
import { getChatIdSearchParam } from '../components/utils/getChatIdSearchParam';

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
  isMobile: boolean;
  currentUser: User | null;
  currentPage: string;
  currentChatId: string | null;
  messages: [];
}

const initialState: AuthState = {
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  isSidebarOpen: false,
  isMobile: true,
  currentUser: null,
  currentPage: getPageSearchParam(),
  currentChatId: getChatIdSearchParam(),
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
    toggleIsMobile: (state) => {
      state.isMobile = !state.isMobile;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    setCurrentChatId: (state, action: PayloadAction<string | null>) => {
      state.currentChatId = action.payload;
    },
    setMessages: (state, action: PayloadAction<[]>) => {
      state.messages = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  toggleIsMobile,
  setCurrentUser,
  setCurrentPage,
  setMessages,
  setCurrentChatId,
} = authSlice.actions;
export default authSlice.reducer;
