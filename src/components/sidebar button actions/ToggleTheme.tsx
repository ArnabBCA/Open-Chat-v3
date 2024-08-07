import SidebarButtons from '../wrappers/SidebarButtons';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { setTheme } from '../../state';
import { useAppSelector } from '../../hooks/useSelector';

const ToggleTheme = () => {
  const dispatch = useDispatch();
  const theme = useAppSelector((state) => state.theme);
  const handleThemeToggle = () => {
    dispatch(setTheme());
  };
  return (
    <SidebarButtons onClick={handleThemeToggle} lable="Toggle Theme">
      {theme === 'dark' ? <MdLightMode /> : <MdDarkMode />}
    </SidebarButtons>
  );
};

export default ToggleTheme;
