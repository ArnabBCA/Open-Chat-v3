import { getDatabase, ref, update } from 'firebase/database';
import { IoIosSend } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';
import { useSelector } from '../hooks/useSelector';
import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { v4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { setEditMessage } from '../state';

const Input = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const currentChatId = useSelector((state) => state.currentChatId);
  const editMessage = useSelector((state) => state.editMessage);
  const [input, setInput] = useState('');
  if (!currentUser) return;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !currentChatId) return;
    if (editMessage.text) {
      const docRef = doc(
        db,
        'chats',
        currentChatId,
        'messages',
        editMessage.id
      );
      await updateDoc(docRef, {
        text: input,
      });
      dispatch(setEditMessage({ id: '', text: '' }));
    } else {
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
    }

    setInput('');
  };

  const cancelEditing = () => {
    dispatch(setEditMessage({ id: '', text: '' }));
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

  useEffect(() => {
    setInput(editMessage.text);
  }, [editMessage.id]);

  return (
    <div
      className={`flex max-h-[7rem] flex-col gap-2 p-2 ${!editMessage ? 'min-h-[3rem]' : ''}`}
    >
      {editMessage.text && (
        <div className="flex min-h-8 w-full items-center gap-2">
          <button onClick={cancelEditing} className="text-red-500">
            <MdCancel size={30} />
          </button>
          <div className="flex min-h-8 w-full items-center gap-2 rounded-lg bg-input px-4 text-sm">
            <span className="text-inputText text-yellow-500">
              <i>Editing</i>
            </span>
            <p className="text-inputText">{editMessage.text}</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex h-full w-full gap-2">
        <input
          onFocus={handleTyping}
          onBlur={handleNotTyping}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-lg bg-input px-4 text-inputText shadow-xl outline-none duration-300"
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
    </div>
  );
};

export default Input;
