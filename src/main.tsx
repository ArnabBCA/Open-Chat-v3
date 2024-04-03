import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import authReducer from './state/index.ts';

const store = configureStore({
  reducer: authReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
