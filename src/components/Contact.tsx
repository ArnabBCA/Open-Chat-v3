import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';
import ProfilePic from './wrappers/ProfilePic';
import { db } from '../firebase';
import { useSelector } from '../hooks/useSelector';
import { MdDone } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { useDispatch } from 'react-redux';
import { setCurrentChatId, toggleIsMobile, ContactProps } from '../state';

const Contact = ({ contact }: { contact: ContactProps }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const currentPage = useSelector((state) => state.currentPage);
  const currentChatId = useSelector((state) => state.currentChatId);
  if (!currentUser) return;

  const currentUserDocRef = doc(db, 'users', currentUser.uid);
  const contactUserDocRef = doc(db, 'users', contact.uid);
  const [isTyping, setIsTyping] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleSendOrRevoke = () => {
    if (isRequested) {
      updateDoc(currentUserDocRef, {
        friendReqSend: arrayRemove(contact.uid),
      });
      updateDoc(contactUserDocRef, {
        friendReqReceived: arrayRemove(currentUser.uid),
      });
      setIsRequested(false);
    } else {
      updateDoc(currentUserDocRef, {
        friendReqSend: arrayUnion(contact.uid),
      });
      updateDoc(contactUserDocRef, {
        friendReqReceived: arrayUnion(currentUser.uid),
      });
      setIsRequested(true);
    }
  };

  const generateChatId = (uid1: string, uid2: string) => {
    const sortedUids = [uid1, uid2].sort();
    return `${sortedUids[0]}_${sortedUids[1]}`;
  };

  const handleAddFriendRequest = async () => {
    updateDoc(currentUserDocRef, {
      contacts: arrayUnion(contact.uid),
      friendReqReceived: arrayRemove(contact.uid),
      friendReqSend: arrayRemove(contact.uid),
    });
    updateDoc(contactUserDocRef, {
      contacts: arrayUnion(currentUser.uid),
      friendReqSend: arrayRemove(currentUser.uid),
      friendReqReceived: arrayRemove(currentUser.uid),
    });
    await setDoc(
      doc(db, 'chats', generateChatId(currentUser.uid, contact.uid)),
      {
        messages: [],
      }
    );
  };

  const handleRemoveFriendRequest = () => {
    updateDoc(currentUserDocRef, {
      friendReqReceived: arrayRemove(contact.uid),
    });
    updateDoc(contactUserDocRef, {
      friendReqSend: arrayRemove(currentUser.uid),
    });
  };

  const getFriendRequestStatus = () => {
    const unsubscribe = onSnapshot(contactUserDocRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data?.friendReqReceived?.includes(currentUser.uid)) {
        setIsRequested(true);
      } else {
        setIsRequested(false);
      }
    });
    return unsubscribe;
  };

  const handleChatClick = () => {
    dispatch(setCurrentChatId(generateChatId(currentUser.uid, contact.uid)));
    dispatch(toggleIsMobile());
  };

  useEffect(() => {
    if (currentPage !== 'addNewContact') return;
    const unsubscribe = getFriendRequestStatus();
    return () => unsubscribe();
  }, []);

  const isConatctBelongToChatId = () => {
    if (!currentChatId) return false;
    const chatId = currentChatId.split('_');
    return chatId.includes(contact.uid);
  };

  const rdb = getDatabase();
  const isTypingRef = ref(rdb, `users/${contact.uid}/isTyping`);

  useEffect(() => {
    const unsubscribe = onValue(isTypingRef, (snap) => {
      setIsTyping(snap.val() ?? false);
    });
    return () => {
      unsubscribe();
    };
  }, [contact.uid]);

  return (
    <div
      className={`flex max-h-16 w-full cursor-pointer items-center justify-between gap-2 rounded-lg p-2 duration-300 hover:bg-button hover:shadow-xl ${currentPage === 'chats' && isConatctBelongToChatId() ? 'bg-button' : ''}`}
      onClick={handleChatClick}
    >
      <div className="flex h-full items-center gap-2">
        <ProfilePic photoURL={contact.photoURL} uid={contact.uid} />
        <div>
          <p className="text-inputText">{contact.displayName}</p>
          {currentPage === 'addNewContact' ? (
            <button
              className="rounded-lg bg-accent px-2 text-sm text-white"
              onClick={handleSendOrRevoke}
            >
              {isRequested ? 'Revoke' : 'Request'}
            </button>
          ) : (
            <span className="text-green-500">
              {isTyping ? 'typing...' : ''}
            </span>
          )}
        </div>
      </div>
      {currentPage === 'notification' && (
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center rounded-lg bg-green-500 p-2 text-white"
            onClick={handleAddFriendRequest}
          >
            <MdDone size={18} />
          </button>
          <button
            className="flex items-center justify-center rounded-lg bg-red-500 p-2 text-white"
            onClick={handleRemoveFriendRequest}
          >
            <RxCross2 size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Contact;
