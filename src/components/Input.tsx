import { getDatabase, ref, update } from 'firebase/database';
import { IoIosSend, IoIosAddCircle } from 'react-icons/io';
import { useSelector } from '../hooks/useSelector';
import { useState } from 'react';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { v4 } from 'uuid';

const Input = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const currentChatId = useSelector((state) => state.currentChatId);
  const [input, setInput] = useState('');
  if (!currentUser) return;

  const handleSubmit = async () => {
    if (!input || !currentChatId) return;
    const currentChatDocRef = doc(db, 'chats', currentChatId);
    const messagesCollectionRef = collection(currentChatDocRef, 'messages');
    const messageId = v4();
    const newMessageDocRef = doc(messagesCollectionRef, messageId);

    await setDoc(newMessageDocRef, {
      messageId: messageId,
      text: input,
      sender: currentUser.uid,
      timestamp: serverTimestamp(),
    });

    setInput('');
  };

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
        onChange={(e) => setInput(e.target.value.trim())}
        className="h-full w-full bg-transparent text-inputText outline-none"
        type="text"
        placeholder="Type message..."
      />
      <button>
        <IoIosSend
          className="text-3xl text-neutral-500"
          onClick={handleSubmit}
        />
      </button>
    </div>
  );
};

export default Input;
