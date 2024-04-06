import { useSelector } from 'react-redux';
import './App.css';
import Home from './components/pages/Home';
import { useEffect } from 'react';
import Auth from './components/pages/Auth';

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
    <div>
      <Auth/>
    </div>
  );
}

export default App;
