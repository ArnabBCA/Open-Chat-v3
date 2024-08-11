import { useEffect } from 'react';
import { useSelector } from '../hooks/useSelector';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '../firebase';
import { useDispatch } from 'react-redux';
import { setCurrentChatId, setMessages } from '../state';
import Message from './Message';

const Chats = () => {
  const dispatch = useDispatch();
  const currentChatId = useSelector((state) => state.currentChatId);
  const messages = useSelector((state) => state.messages);

  useEffect(() => {
    if (!currentChatId) return;
    const currentChatDocRef = doc(db, 'chats', currentChatId);
    const unsubscribe = onSnapshot(currentChatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const messagesCollectionRef = collection(currentChatDocRef, 'messages');
        const orderedMessagesQuery = query(
          messagesCollectionRef,
          orderBy('timestamp', 'asc')
        );
        const unsubscribeMessages = onSnapshot(
          orderedMessagesQuery,
          (querySnapshot: any) => {
            dispatch(
              setMessages(querySnapshot.docs.map((doc: any) => doc.data()))
            );
          }
        );
        return () => unsubscribeMessages();
      } else {
        dispatch(setCurrentChatId(null));
      }
    });

    return () => unsubscribe();
  }, [currentChatId, dispatch]);

  return (
    <div className="flex h-[calc(100%_-_8rem)] flex-col gap-2 p-2">
      {messages.map((message: any, i) => (
        <Message key={i} message={message} />
      ))}
    </div>
  );
};

export default Chats;
