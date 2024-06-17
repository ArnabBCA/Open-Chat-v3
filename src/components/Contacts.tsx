import { useEffect, useState } from 'react';
import ProfilePic from './wrappers/ProfilePic';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import { getDatabase, onValue, ref } from 'firebase/database';

interface ContactProps {
  uid: string;
  displayName: string;
  photoURL: string;
}

const Contact = ({ contact }: { contact: ContactProps }) => {
  const [isTyping, setIsTyping] = useState(false);
  const rdb = getDatabase();
  const isTypingRef = ref(rdb, `users/${contact.uid}/isTyping`);

  useEffect(() => {
    const unsubscribe = onValue(isTypingRef, (snap) => {
      setIsTyping(snap.val());
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
        <span className="text-green-500">{isTyping && 'typing...'}</span>
      </div>
    </div>
  );
};

const Contacts = () => {
  const [contacts, setContacts] = useState<ContactProps[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setContacts(querySnapshot.docs.map((doc) => doc.data() as ContactProps));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col overflow-x-scroll p-2">
      {contacts.map((contact) => (
        <Contact key={contact.uid} contact={contact} />
      ))}
    </div>
  );
};

export default Contacts;
