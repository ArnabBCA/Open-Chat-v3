import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useSelector } from '../hooks/useSelector';
import { db } from '../firebase';
import { update } from 'firebase/database';

interface MessageProps {
  message: {
    messageId: string;
    text: string;
    sender: string;
    displayName: string;
  };
}

const Message = (props: MessageProps) => {
  const currentUser = useSelector((state) => state.currentUser);
  const currentChatId = useSelector((state) => state.currentChatId);
  const isCurrentUser = props.message.sender === currentUser?.uid;
  if (!currentUser || !currentChatId) return null;

  const handleClick = async () => {
    try {
      const docRef = doc(
        db,
        'chats',
        currentChatId,
        'messages',
        props.message.messageId
      );
      updateDoc(docRef, {
        text: 'You clicked on this message!',
      });
    } catch (error) {
      console.error('Error getting document:', error);
    }
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[calc(70%)]`} onClick={handleClick}>
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
