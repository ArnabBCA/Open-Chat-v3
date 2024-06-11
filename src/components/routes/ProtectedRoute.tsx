import { Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import Loader from '../Loader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import { setCurrentUser } from '../../state';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.currentUser);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setCurrentUser(user));
      setIsLoading(false);
    });
    return () => {
      unsubscribe();
    };
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
