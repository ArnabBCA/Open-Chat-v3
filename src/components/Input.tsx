import { getDatabase, ref, update } from 'firebase/database';
import { IoIosSend } from 'react-icons/io';
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !currentChatId) return;
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
    <form onSubmit={handleSubmit} className="flex h-full w-full gap-2">
      <input
        onFocus={handleTyping}
        onBlur={handleNotTyping}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-full w-full rounded-lg bg-input px-4 py-2 text-inputText shadow-xl outline-none duration-300"
        type="text"
        placeholder="Type message..."
      />
      <button
        type="submit"
        className="flex min-h-12 min-w-12 items-center justify-center rounded-lg bg-sidebarButtonAccent shadow-xl"
      >
        <IoIosSend className="text-3xl text-white" />
      </button>
    </form>
  );
};

export default Input;
