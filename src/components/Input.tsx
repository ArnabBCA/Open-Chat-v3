import { getDatabase, ref, update } from 'firebase/database';
import { IoIosSend, IoIosAddCircle } from 'react-icons/io';
import { useSelector } from '../hooks/useSelector';

const Input = () => {
  const currentUser = useSelector((state) => state.currentUser);
  if (!currentUser) return;
  const rdb = getDatabase();
  const userConnectionsRef = ref(rdb, `users/${currentUser.uid}`);

  const handleTyping = () => {
    update(userConnectionsRef, {
      isTyping: true,
    });
  };
  const handleNotTyping = () => {
    update(userConnectionsRef, {
      isTyping: false,
    });
  };

  return (
    <div className="flex h-full gap-1 rounded-lg bg-input p-2 shadow-xl duration-300">
      <button>
        <IoIosAddCircle className="text-3xl text-neutral-500" />
      </button>
      <input
        onFocus={handleTyping}
        onBlur={handleNotTyping}
        className="h-full w-full bg-transparent text-inputText outline-none"
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
