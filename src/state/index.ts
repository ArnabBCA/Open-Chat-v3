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

interface ContactProps {
  uid: string;
  displayName: string;
  photoURL: string;
}

interface AuthState {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  isMobile: boolean;
  currentUser: User | null;
  currentPage: string;
  currentChatId: string | null;
  messages: any[];
  contacts: ContactProps[];
  editMessage: {
    id: string;
    text: string;
  };
}

const initialState: AuthState = {
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark',
  isSidebarOpen: false,
  isMobile: true,
  currentUser: null,
  currentPage: getPageSearchParam(),
  currentChatId: getChatIdSearchParam(),
  messages: [],
  contacts: [],
  editMessage: {
    id: '',
    text: '',
  },
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
    setMessages: (state, action: PayloadAction<any[]>) => {
      const messages = action.payload;
      const messageMap = new Map<string, any>();
      // Add existing messages to the map
      state.messages.forEach((message) => {
        messageMap.set(message.messageId, message);
      });
      // Add new messages to the map, replacing old ones with the same ID
      messages.forEach((message) => {
        messageMap.set(message.messageId, message);
      });
      // Convert the map values to an array and sort by timestamp
      const sortedMessages = Array.from(messageMap.values()).sort(
        (a, b) => b.timestamp - a.timestamp
      );
      // Set the showTimestamp property
      let previousDate = null;
      for (let i = sortedMessages.length - 1; i >= 0; i--) {
        const message = sortedMessages[i];
        const messageDate = new Date(
          message.timestamp.seconds * 1000
        ).toDateString();

        if (previousDate !== messageDate) {
          message.showTimestamp = true;
          previousDate = messageDate;
        } else {
          message.showTimestamp = false;
        }
      }
      state.messages = sortedMessages;
    },
    resetMessages: (state) => {
      state.messages = [];
    },
    updateMessage: (state, action: PayloadAction<any>) => {
      const updatedMessage = action.payload;
      const messageIndex = state.messages.findIndex(
        (message) => message.messageId === updatedMessage.messageId
      );
      if (messageIndex !== -1) {
        state.messages[messageIndex] = updatedMessage;
      }
    },
    setEditMessage: (
      state,
      action: PayloadAction<{ id: string; text: string }>
    ) => {
      state.editMessage = action.payload;
    },
    setContacts: (state, action: PayloadAction<ContactProps[]>) => {
      state.contacts = action.payload;
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
  setContacts,
  resetMessages,
  updateMessage,
  setEditMessage,
} = authSlice.actions;
export default authSlice.reducer;
