import { useSelector } from '../hooks/useSelector';

interface MessageProps {
  message: {
    text: string;
    sender: string;
  };
}

const Message = (props: MessageProps) => {
  const currentUser = useSelector((state) => state.currentUser);

  // Determine alignment based on senderId
  const isCurrentUser = props.message.sender === currentUser?.uid;

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[calc(70%)]`}>
        <p
          className={`max-w-max px-4 py-2 rounded-3xl ${
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
