import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const handleCurrentPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const page = searchParams.get('page') || 'chats';
  if (
    page !== 'chats' &&
    page !== 'addNewContact' &&
    page !== 'notification'
  ) {
    return 'chats';
  }
  return page;
};

const initialState: AuthState = {
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  isSidebarOpen: false,
  currentUser: null,
  currentPage: handleCurrentPage(),
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
  },
});

export const { setTheme, toggleSidebar, setCurrentUser, setCurrentPage } =
  authSlice.actions;
export default authSlice.reducer;
