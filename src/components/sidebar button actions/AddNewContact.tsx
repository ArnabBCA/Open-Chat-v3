import SidebarButtons from '../wrappers/SidebarButtons';
import { IoAdd } from 'react-icons/io5';
import { setCurrentPage } from '../../state';
import { useDispatch } from 'react-redux';
import { useSelector } from '../../hooks/useSelector';

const AddNewContact = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.currentPage);

  const handleCurrentPage = () => {
    dispatch(setCurrentPage('addNewContact'));
  };

  return (
    <SidebarButtons
      onClick={handleCurrentPage}
      lable="Add Contact"
      isHoverActive={currentPage === 'addNewContact' && true}
    >
      <IoAdd />
    </SidebarButtons>
  );
};

export default AddNewContact;
