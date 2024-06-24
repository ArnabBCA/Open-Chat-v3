import Contacts from './Contacts';
import Search from './Search';

const LeftConainer = () => {
  return (
    <div className="h-full w-full  bg-left p-2 transition-colors duration-300 sm:max-w-80 flex flex-col gap-2">
      <h1 className='text-inputText text-2xl'>Chats</h1>
      <Search />
      <Contacts />
    </div>
  );
};

export default LeftConainer;
