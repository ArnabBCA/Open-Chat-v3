import { IoIosNotifications } from 'react-icons/io';
import SidebarButtons from '../wrappers/SidebarButtons';
import { useDispatch } from 'react-redux';
import { setCurrentPage } from '../../state';

const Notification = () => {
  const dispatch = useDispatch();
  const handleCurrentPage = () => {
    dispatch(setCurrentPage('notification'));
  };
  return (
    <SidebarButtons onClick={handleCurrentPage} lable="Notifications">
      <IoIosNotifications />
    </SidebarButtons>
  );
};

export default Notification;
