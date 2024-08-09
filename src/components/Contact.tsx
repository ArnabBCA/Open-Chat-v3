import { ContactProps } from './Contacts';
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { getDatabase, onValue, ref } from 'firebase/database';
import ProfilePic from './wrappers/ProfilePic';
import { db } from '../firebase';
import { useSelector } from '../hooks/useSelector';

const Contact = ({ contact }: { contact: ContactProps }) => {
  const currentUser = useSelector((state) => state.currentUser);
  const currentPage = useSelector((state) => state.currentPage);
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

  const getFriendRequestStatus = () => {
    const unsubscribe = onSnapshot(contactUserDocRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (
        data?.friendReqReceived &&
        data.friendReqReceived.includes(currentUser.uid)
      ) {
        setIsRequested(true);
      } else {
        setIsRequested(false);
      }
    });
    return () => unsubscribe();
  };

  useEffect(() => {
    return getFriendRequestStatus();
  }, [contact.uid]);

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
    <div className="flex max-h-16 w-full items-center gap-2 rounded-xl p-2 duration-300 hover:bg-button hover:shadow-xl">
      <ProfilePic photoURL={contact.photoURL} uid={contact.uid} />
      <div>
        <p className="text-inputText">{contact.displayName}</p>
        {currentPage === 'addNewContact' ? (
          <button
            type="button"
            className="rounded-lg bg-accent px-2 text-sm text-white"
            onClick={handleSendOrRevoke}
          >
            {isRequested ? 'Revoke' : 'Request'}
          </button>
        ) : (
          <span className="text-green-500">{isTyping ? 'typing...' : ''}</span>
        )}
      </div>
    </div>
  );
};

export default Contact;
