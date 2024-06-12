import { useSelector } from 'react-redux';
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

const Home = () => {
  const currentUser = useSelector((state: RootState) => state.currentUser);
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

  return (
    <div className="relative flex h-svh w-full overflow-x-hidden">
      <Sidebar />
      <LeftConainer />
      <RightContainer />
    </div>
  );
};

export default Home;
