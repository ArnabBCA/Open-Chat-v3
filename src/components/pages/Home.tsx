import LeftConainer from '../LeftConainer';
import RightContainer from '../RightContainer';
import Sidebar from '../Sidebar';
import {
  getDatabase,
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  update,
} from 'firebase/database';
import { useEffect } from 'react';
import { useSelector } from '../../hooks/useSelector';
import { useSearchParams } from 'react-router-dom';
import { setCurrentPage } from '../../state';
import { useDispatch } from 'react-redux';
import { getPageSearchParam } from '../utils/getPageSeachParam';

const Home = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const currentPage = useSelector((state) => state.currentPage);
  const [_, setSearchParams] = useSearchParams();

  if (!currentUser) return;
  const db = getDatabase();
  const userConnectionsRef = ref(db, `users/${currentUser.uid}`);
  const connectedRef = ref(db, '.info/connected');

  const handleVisibilityChange = () => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        if (document.visibilityState === 'hidden') {
          update(userConnectionsRef, {
            status: 'away',
          });
        } else {
          update(userConnectionsRef, {
            status: 'online',
            isTyping: false,
          });
        }
        onDisconnect(userConnectionsRef).update({
          status: 'offline',
          lastOnline: serverTimestamp(),
        });
      }
    });
  };

  useEffect(() => {
    handleVisibilityChange();
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    setSearchParams({ page: currentPage });
  }, [currentPage]);

  const page = getPageSearchParam();
  useEffect(() => {
    dispatch(setCurrentPage(page));
  }, [page]);

  return (
    <div className="relative flex h-svh w-full overflow-x-hidden">
      <Sidebar />
      <LeftConainer />
      <RightContainer />
    </div>
  );
};

export default Home;
