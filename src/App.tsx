import { useSelector } from 'react-redux';
import './App.css';
import Home from './components/pages/Home';
import { useEffect } from 'react';
import Auth from './components/pages/Auth';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  const theme = useSelector((state) => state.theme);
  useEffect(() => {
    if(theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    else{
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="login" element={<Auth />} />
          <Route path="register" element={<Auth />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
