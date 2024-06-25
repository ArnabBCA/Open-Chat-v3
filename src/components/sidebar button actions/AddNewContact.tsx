import SidebarButtons from '../wrappers/SidebarButtons';
import { IoAdd } from 'react-icons/io5';

const AddNewContact = () => {
  return (
    <SidebarButtons onClick={() => {}} lable="Add Contact">
      <IoAdd />
    </SidebarButtons>
  );
}

export default AddNewContact