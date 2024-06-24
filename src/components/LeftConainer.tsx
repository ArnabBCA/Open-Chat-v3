import Contacts from './Contacts';
import Search from './Search';

const LeftConainer = () => {
  return (
    <div
      className={`flex h-full w-[calc(100%-7rem)] flex-col gap-2 bg-left p-2 transition-colors duration-300 sm:max-w-80`}
    >
      <h1 className="text-2xl text-inputText">Chats</h1>
      <Search />
      <Contacts />
    </div>
  );
};

export default LeftConainer;
