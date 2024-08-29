import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useSelector } from '../hooks/useSelector';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateMessage, setEditMessage } from '../state';
import moment from 'moment';
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';

interface MessageProps {
  message: {
    messageId: string;
    text: string;
    sender: string;
    displayName: string;
    timestamp: number;
    showTimestamp: boolean;
  };
}

const Message = (props: MessageProps) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const currentChatId = useSelector((state) => state.currentChatId);
  const isCurrentUser = props.message.sender === currentUser?.uid;
  const [showTimestamp, setShowTimestamp] = useState(false);
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

  const getTimestamp = (timestamp: any, isTypeDate?: boolean) => {
    // Convert to milliseconds by multiplying seconds by 1000
    const milliseconds =
      timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);
    const time = moment(milliseconds);
    if (isTypeDate) {
      return time.format('MMMM Do, YYYY');
    } else {
      return time.format('hh:mm:ss A');
    }
  };

  const handleDeleteMessage = async () => {
    const docRef = doc(
      db,
      'chats',
      currentChatId,
      'messages',
      props.message.messageId
    );
    await updateDoc(docRef, {
      text: 'This message has been deleted',
    });
  };

  const handleEditMessage = () => {
    dispatch(
      setEditMessage({
        id: props.message.messageId,
        text: props.message.text,
      })
    );
  };

  useEffect(() => {
    const unsub = updateMessages();
    setShowTimestamp(props.message.showTimestamp);
    return () => unsub?.();
  }, [props.message.messageId]);

  return (
    <>
      {showTimestamp && (
        <div className="flex w-full items-center justify-center">
          <span className="rounded-lg bg-input px-1.5 py-0.5 text-center text-sm text-neutral-500">
            {getTimestamp(props.message.timestamp, true)}
          </span>
        </div>
      )}
      <div
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} group`}
      >
        <div className={`flex max-w-[calc(70%)] flex-col`}>
          <span
            className={`text-[12px] text-inputText ${isCurrentUser ? 'self-end' : 'self-start'}`}
          >
            {getTimestamp(props.message.timestamp)}
          </span>
          <div
            className={`flex items-center gap-4 ${
              isCurrentUser ? 'self-end' : 'flex-row-reverse self-start'
            }`}
          >
            {isCurrentUser && (
              <div className="hidden overflow-hidden rounded-lg group-hover:block shadow-md">
                <div className="flex shadow-lg">
                  <button
                    className="flex items-center bg-input p-2 text-inputText hover:bg-input/50"
                    onClick={handleEditMessage}
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    className="flex items-center bg-input p-2 text-red-500 hover:bg-input/50"
                    onClick={handleDeleteMessage}
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            )}
            <p
              className={`max-w-max rounded-3xl px-4 py-2 ${
                isCurrentUser
                  ? 'self-end bg-blue-500 text-white'
                  : 'self-start bg-gray-300 text-black'
              }`}
            >
              {props.message.text === 'This message has been deleted' ? (
                <i>{props.message.text}</i>
              ) : (
                props.message.text
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Message;
