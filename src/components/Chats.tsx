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
import { useEffect, useRef, useState, useCallback } from 'react';
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
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | undefined>(undefined);

  const lastMessageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log('Visible');
          getOldMessages();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const getOldMessages = async () => {
    setLoading(true);
    if (!currentChatId) return;

    const docRef = doc(db, 'chats', currentChatId);
    const collectionRef = collection(docRef, 'messages');
    const q = query(
      collectionRef,
      orderBy('timestamp', 'desc'),
      ...(lastDoc ? [startAfter(lastDoc)] : []),
      limit(30)
    );

    try {
      const querySnapshot = await getDocs(q);
      const newMessages = querySnapshot.docs.map((doc) =>
        handleMessage(doc.data())
      );
      if (newMessages.length > 0) {
        setLastDoc(newMessages[newMessages.length - 1].timestamp);
        setHasMore(newMessages.length === 30);
        dispatch(setMessages(newMessages));
      }
    } catch (error) {
      console.error('Error fetching old messages: ', error);
    } finally {
      setLoading(false);
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
      {messages.map((message: any, index) => {
        if (index === messages.length - 1) {
          return (
            <div ref={lastMessageRef} key={message.messageId}>
              <Message message={message} />
            </div>
          );
        } else {
          return (
            <div key={message.messageId}>
              <Message message={message} />
            </div>
          );
        }
      })}
      {loading && (
        <span className="absolute left-1/2 top-20 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-input px-1.5 py-0.5 text-sm text-inputText">
          Loading...
        </span>
      )}
      {!hasMore && (
        <div className="flex w-full items-center justify-center">
          <span className="rounded-lg bg-input px-1.5 py-0.5 text-center text-sm text-neutral-500">
            No more messages to show
          </span>
        </div>
      )}
    </div>
  );
};

export default Chats;
