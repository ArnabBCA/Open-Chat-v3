import { IoIosNotifications } from 'react-icons/io';
import SidebarButtons from '../wrappers/SidebarButtons';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../../state';
import { useSelector } from '../../hooks/useSelector';

const Notification = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentPage);

  const handleCurrentPage = () => {
    dispatch(setCurrentPage('notification'));
  };
  return (
    <SidebarButtons
      onClick={handleCurrentPage}
      lable="Notifications"
      isHoverActive={currentPage === 'notification' && true}
    >
      <IoIosNotifications />
    </SidebarButtons>
  );
};

export default Notification;
