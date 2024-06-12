import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, get } from 'firebase/database';

const ProfilePic = (props: { photoURL: string; size: number; uid: string }) => {
  const db = getDatabase();
  const [status, setStatus] = useState('offline');
  const statusRef = ref(db, `users/${props.uid}/status`);
  
  useEffect(() => {
    const unsub = onValue(statusRef, (snap) => {
      setStatus(snap.val());
    });
    return () => {
      unsub();
    };
  }, []);

  const getStatusClass = () => {
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
    <div className={`relative h-${props.size} w-${props.size}`}>
      <div
        className={`absolute bottom-0.5 right-0.5 z-10 h-2.5 w-2.5 rounded-full ${getStatusClass()} ring-2 ring-left`}
      ></div>
      <button className="relative flex items-center justify-center overflow-hidden rounded-3xl duration-300 hover:rounded-2xl">
        <img
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          src={props.photoURL}
          alt="Profile Pic"
        />
      </button>
    </div>
  );
};

export default ProfilePic;
