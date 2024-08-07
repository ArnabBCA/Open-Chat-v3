import { Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader';
import { useDispatch } from 'react-redux';
import { RootState } from '../../main';
import { setCurrentUser } from '../../state';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAppSelector } from '../../hooks/useSelector';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const currentUser = useAppSelector((state) => state.currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribeFromAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeFromSnapshot = onSnapshot(
          userDocRef,
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              dispatch(
                setCurrentUser(docSnapshot.data() as RootState['currentUser'])
              );
              setIsLoading(false);
            }
          }
        );
        return () => unsubscribeFromSnapshot();
      } else {
        dispatch(setCurrentUser(null));
      }
    });
    return () => unsubscribeFromAuth();
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  if (currentUser) {
    return children as React.ReactElement;
  }
  return <Navigate to="/login" />;
};

export default ProtectedRoute;
