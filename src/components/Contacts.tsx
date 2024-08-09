import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  startAt,
} from 'firebase/firestore';
import { db } from '../firebase';
import { IoIosSearch } from 'react-icons/io';
import Contact from './Contact';
import { useSelector } from '../hooks/useSelector';

export interface ContactProps {
  uid: string;
  displayName: string;
  photoURL: string;
}

const Contacts = () => {
  const currentUser = useSelector((state) => state.currentUser);
  const currentPage = useSelector((state) => state.currentPage);
  const [contacts, setContacts] = useState<ContactProps[]>([]);
  if (!currentUser) return;

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();
    if (currentPage === 'addNewContact') {
      if (searchValue === '') {
        setContacts([]);
        return;
      }
      const q = query(
        collection(db, 'users'),
        orderBy('displayName'),
        startAt(searchValue),
        endAt(searchValue + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setContacts([]);
        return;
      }
      const searchUsers = querySnapshot.docs.map(
        (doc) => ({ uid: doc.id, ...doc.data() }) as ContactProps
      );
      setContacts(searchUsers);
    }
  };

  const getUserDetails = async (contactUids: Array<string>) => {
    const contactPromises = contactUids.map((uid: string) =>
      getDoc(doc(db, 'users', uid))
    );
    try {
      const contactDocs = await Promise.all(contactPromises);
      const contactDetails = contactDocs.map((contactDoc) => ({
        ...contactDoc.data(),
      })) as ContactProps[];
      setContacts(contactDetails);
    } catch (error) {
      console.error('Error fetching contact users details:', error);
      setContacts([]);
    }
  };

  const handleContacts = () => {
    const currentUserDocRef = doc(db, 'users', currentUser.uid);

    if (currentPage === 'chats') {
      const unsubscribeContacts = onSnapshot(
        currentUserDocRef,
        async (docSnapshot) => {
          const data = docSnapshot.data();
          const contactUids = data?.contacts;
          getUserDetails(contactUids);
        }
      );
      return () => unsubscribeContacts();
    }

    if (currentPage === 'notification') {
      const unsubscribeContacts = onSnapshot(
        currentUserDocRef,
        async (docSnapshot) => {
          const data = docSnapshot.data();
          const contactUids = data?.friendReqReceived;
          getUserDetails(contactUids);
        }
      );
      return () => unsubscribeContacts();
    }
  };

  useEffect(() => {
    handleContacts();
  }, [currentPage]);

  return (
    <>
      <div className="relative flex h-12 w-full items-center gap-2 rounded-lg bg-input px-4 shadow-xl duration-300">
        <input
          onChange={handleSearch}
          type="text"
          placeholder="Search by name or #0000"
          className="h-full w-full bg-transparent text-inputText outline-none"
        />
        <IoIosSearch className="text-3xl text-neutral-500" />
      </div>
      <div className="flex h-full w-full flex-col overflow-x-scroll">
        {contacts.map((contact) => (
          <Contact key={contact.uid} contact={contact} />
        ))}
        {contacts.length === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-neutral-500">Not found</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Contacts;
