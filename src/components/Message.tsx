import { doc, onSnapshot } from 'firebase/firestore';
import { useSelector } from '../hooks/useSelector';
import { db } from '../firebase';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateMessage } from '../state';

interface MessageProps {
  message: {
    messageId: string;
    text: string;
    sender: string;
    displayName: string;
  };
}

const Message = (props: MessageProps) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const currentChatId = useSelector((state) => state.currentChatId);
  const isCurrentUser = props.message.sender === currentUser?.uid;
  if (!currentUser || !currentChatId) return null;

  const updateMessages = () => {
    const docRef = doc(
      db,
      'chats',
      currentChatId,
      'messages',
      props.message.messageId
    );
    const unsub = onSnapshot(docRef, (snapshot) => {
      const messageData = snapshot.data();
      dispatch(updateMessage(messageData));
    });
    return unsub;
  };

  /*const handleClick = async () => {
    const docRef = doc(
      db,
      'chats',
      currentChatId,
      'messages',
      props.message.messageId
    );
    await updateDoc(docRef, {
      text: '[This message has been deleted]',
    });
  };*/

  useEffect(() => {
    const unsub = updateMessages();
    return () => unsub?.();
  }, [props.message.messageId]);

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[calc(70%)]`}>
        <p
          className={`max-w-max rounded-3xl px-4 py-2 ${
            isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
          }`}
        >
          {props.message.text}
        </p>
      </div>
    </div>
  );
};

export default Message;
