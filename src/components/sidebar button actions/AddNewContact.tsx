import SidebarButtons from '../wrappers/SidebarButtons';
import { IoAdd } from 'react-icons/io5';
import { setCurrentPage } from '../../state';
import { useDispatch } from 'react-redux';

const AddNewContact = () => {
  const dispatch = useDispatch();
  const handleCurrentPage = () => {
    dispatch(setCurrentPage('addNewContact'));
  };

  return (
    <SidebarButtons onClick={handleCurrentPage} lable="Add Contact">
      <IoAdd />
    </SidebarButtons>
  );
}

export default AddNewContact