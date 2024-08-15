import { useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import { setContacts } from '../state';

const Contacts = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const currentPage = useSelector((state) => state.currentPage);
  const contacts = useSelector((state) => state.contacts);
  if (!currentUser) return null;
  const currentUserDocRef = doc(db, 'users', currentUser.uid);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim();
    if (currentPage === 'addNewContact') {
      if (searchValue === '') {
        dispatch(setContacts([]));
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
        dispatch(setContacts([]));
        return;
      }
      const searchUsers = querySnapshot.docs.map((doc: any) => ({
        ...doc.data(),
      }));
      dispatch(setContacts(searchUsers));
    }
  };

  const getUserDetails = async (contactUids: Array<string>) => {
    if (!contactUids) return null;
    const contactPromises = contactUids.map((uid: string) =>
      getDoc(doc(db, 'users', uid))
    );
    try {
      const contactDocs = await Promise.all(contactPromises);
      const contactDetails = contactDocs.map((contactDoc: any) => ({
        ...contactDoc.data(),
      }));
      dispatch(setContacts(contactDetails));
    } catch (error) {
      console.error('Error fetching contact users details:', error);
      dispatch(setContacts([]));
    }
  };

  const handleContacts = () => {
    const unsubscribe = onSnapshot(currentUserDocRef, async (docSnapshot) => {
      const data = docSnapshot.data();
      if (currentPage === 'chats') {
        getUserDetails(data?.contacts);
      }
      if (currentPage === 'notification') {
        getUserDetails(data?.friendReqReceived);
      }
    });
    return unsubscribe;
  };

  useEffect(() => {
    dispatch(setContacts([]));
    const unsubscribe = handleContacts();
    return () => unsubscribe();
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
      <div className="flex h-full w-full flex-col overflow-y-scroll">
        {contacts.map((contact) => (
          <Contact key={contact.uid} contact={contact} />
        ))}
        {contacts.length === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-neutral-500">
              {currentPage === 'chats'
                ? 'No Contacts'
                : currentPage === 'addNewContact'
                  ? 'User not found'
                  : 'No new notification'}
            </span>
          </div>
        )}
      </div>
    </>
  );
};

export default Contacts;
