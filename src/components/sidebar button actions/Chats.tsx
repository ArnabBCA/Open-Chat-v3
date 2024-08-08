import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../../state';
import SidebarButtons from '../wrappers/SidebarButtons';
import { IoChatbubbles } from 'react-icons/io5';
import { useSelector } from '../../hooks/useSelector';

const Chats = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentPage);

  const handleCurrentPage = () => {
    dispatch(setCurrentPage('chats'));
  };
  return (
    <SidebarButtons
      onClick={handleCurrentPage}
      lable="Chats"
      isHoverActive={currentPage === 'chats' && true}
    >
      <IoChatbubbles />
    </SidebarButtons>
  );
};

export default Chats;
