import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

interface ProfilePicProps {
  photoURL: string;
  size?: string | number;
  uid: string;
}

const ProfilePic = ({ photoURL, size = 'full', uid }: ProfilePicProps) => {
  const db = getDatabase();
  const [status, setStatus] = useState<string>('offline');
  const statusRef = ref(db, `users/${uid}/status`);

  useEffect(() => {
    const unsubscribe = onValue(statusRef, (snap) => {
      setStatus(snap.val());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getStatusClass = (): string => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`relative h-${size}`}>
      <div
        className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full ${getStatusClass()} ring-2 ring-left`}
      ></div>
      <button className="h-full flex items-center justify-center overflow-hidden rounded-[50%] duration-300 hover:rounded-2xl">
        <img
          className="h-full object-cover"
          referrerPolicy="no-referrer"
          src={photoURL}
          alt="Profile Pic"
        />
      </button>
    </div>
  );
};

export default ProfilePic;
