import './App.css';
import Home from './components/pages/Home';
import { useEffect } from 'react';
import Auth from './components/pages/Auth';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/routes/ProtectedRoute';
import { useSelector } from './hooks/useSelector';

const App = () => {
  const theme = useSelector((state) => state.theme);

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    toggleTheme();
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Auth />} />
        <Route path="register" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
