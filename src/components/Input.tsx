import { IoIosSend, IoIosAddCircle } from 'react-icons/io';

const Input = () => {
  return (
    <div className="flex h-full gap-1 rounded-lg bg-input p-2 shadow-xl duration-300">
      <button>
        <IoIosAddCircle className="text-3xl text-neutral-500" />
      </button>
      <input
        className="h-full w-full bg-transparent outline-none text-inputText"
        type="text"
        placeholder="Type message..."
      />
      <button>
        <IoIosSend className="text-3xl text-neutral-500" />
      </button>
    </div>
  );
};

export default Input;
