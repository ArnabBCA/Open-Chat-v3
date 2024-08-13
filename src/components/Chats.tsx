import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentChatId, setMessages } from '../state';
import { useSelector } from '../hooks/useSelector';
import { db } from '../firebase';
import Message from './Message';

const Chats = () => {
  const dispatch = useDispatch();
  const currentChatId = useSelector((state) => state.currentChatId);
  const currentUser = useSelector((state) => state.currentUser);
  const contacts = useSelector((state) => state.contacts);
  const messages = useSelector((state) => state.messages);
  const [lastDoc, setLastDoc] = useState(null);

  const getOldMessages = async () => {
    if (!currentChatId) return;

    const docRef = doc(db, 'chats', currentChatId);
    const collectionRef = collection(docRef, 'messages');
    const q = query(
      collectionRef,
      orderBy('timestamp', 'desc'),
      ...(lastDoc ? [startAfter(lastDoc)] : []),
      limit(3)
    );

    try {
      const querySnapshot = await getDocs(q);
      const newMessages = querySnapshot.docs.map((doc) =>
        handleMessage(doc.data())
      );
      if (newMessages.length > 0) {
        setLastDoc(newMessages[newMessages.length - 1].timestamp);
        dispatch(setMessages(newMessages));
      }
    } catch (error) {
      console.error('Error fetching old messages: ', error);
    }
  };

  let c = 0;
  const getNewMessages = () => {
    if (!currentChatId) return;
    const docRef = doc(db, 'chats', currentChatId);
    const collectionRef = collection(docRef, 'messages');
    const q = query(collectionRef, orderBy('timestamp', 'desc'), limit(1));

    const unsub = onSnapshot(q, (querySnapshot) => {
      c++;
      if (c === 1) return;
      const newMessages = querySnapshot.docs.map((doc) =>
        handleMessage(doc.data())
      );
      if (newMessages.length > 0 && !querySnapshot.metadata.hasPendingWrites) {
        dispatch(setMessages(newMessages));
      }
    });
    return unsub;
  };

  const handleMessage = (messageData: any) => {
    let additionalDetails = {};
    if (messageData.sender === currentUser?.uid) {
      additionalDetails = {
        displayName: currentUser?.displayName,
        photoURL: currentUser?.photoURL,
      };
    }
    if (messageData.sender !== currentUser?.uid) {
      const senderDetails = contacts.find(
        (contact) => contact.uid === messageData.sender
      );
      additionalDetails = senderDetails || {};
    }
    return {
      ...messageData,
      ...additionalDetails,
    };
  };
  const isChatIdExists = async () => {
    if (!currentChatId) return;
    try {
      const docRef = doc(db, 'chats', currentChatId);
      const docSnapshot = await getDoc(docRef);
      if (!docSnapshot.exists()) {
        dispatch(setCurrentChatId(null));
      }
    } catch (error) {
      console.error('Error checking document existence:', error);
    }
  };

  useEffect(() => {
    isChatIdExists();
    getOldMessages();
    const unsub = getNewMessages();
    return unsub;
  }, [currentChatId]);

  return (
    <div className="flex h-[calc(100%-8rem)] flex-col-reverse gap-2 overflow-y-scroll p-2">
      {messages.map((message: any) => (
        <Message key={message.messageId} message={message} />
      ))}
      <button onClick={getOldMessages}>Load more</button>
    </div>
  );
};

export default Chats;
