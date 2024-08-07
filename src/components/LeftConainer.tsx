import { useSelector } from '../hooks/useSelector';
import Contacts from './Contacts';

const LeftConainer = () => {
  const currentPage = useSelector((state) => state.currentPage);
  return (
    <div
      className={`flex h-full w-[calc(100%-7rem)] flex-col gap-2 bg-left p-2 transition-colors duration-300 sm:max-w-80`}
    >
      <h1 className="text-2xl text-inputText">
        {currentPage === 'home'
          ? 'Chats'
          : currentPage == 'addNewContact'
            ? 'Add Contact'
            : 'Notification'}
      </h1>
      <Contacts />
    </div>
  );
};

export default LeftConainer;
