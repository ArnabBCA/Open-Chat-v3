import { useFormik } from 'formik';
import { initialValues } from '../../schemas/schemas';
import { registerSchema, loginSchema } from '../../schemas/schemas';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  fetchSignInMethodsForEmail,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoginPage, setIsLoginPage] = useState<boolean>(
    location.pathname === '/login' ? true : false
  );
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: isLoginPage ? loginSchema : registerSchema,
    onSubmit: () => {
      isLoginPage ? handleLogin() : handleEmailPasswordSignIn();
    },
  });

  const handleEmailPasswordSignIn = async () => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        values.email
      );
      console.log(signInMethods);
      if (signInMethods.length > 0) {
        console.log('Email already taken');
        return;
      }
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      if (!auth.currentUser) return;
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        displayName: values.displayName,
        email: auth.currentUser.email,
        photoURL: null,
        code: generateRandomCode(),
        contacts: [],
        friendReqReceived: [],
        friendReqSend: [],
      });
      await sendEmailVerification(auth.currentUser);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      if (auth.currentUser?.emailVerified) {
        resetForm();
        navigate('/');
      } else {
        await signOut(auth);
        console.log('Please verify your email');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const googleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const additionalInfo = getAdditionalUserInfo(result);
      if (!additionalInfo?.isNewUser || !auth.currentUser) {
        navigate('/');
        return;
      }
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
        code: generateRandomCode(),
        contacts: [],
        friendReqReceived: [],
        friendReqSend: [],
      });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  useEffect(() => {
    setIsLoginPage(location.pathname === '/login' ? true : false);
  }, [location.pathname, isLoginPage]);

  return (
    <div className="flex h-svh items-center justify-center bg-accent p-4">
      <div className="flex w-full max-w-md flex-col gap-5 rounded-md bg-left p-4 shadow-2xl">
        <h3 className="text-4xl font-semibold text-inputText">
          {isLoginPage ? 'Login' : 'Register'}
        </h3>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Email"
              className="rounded-md bg-input px-4 py-2 text-inputText outline-none"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              name="email"
            />
            {errors.email && touched.email && (
              <p className="text-sm text-red-500">{String(errors.email)}</p>
            )}
          </div>
          {!isLoginPage && (
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Display Name"
                className="rounded-md bg-input px-4 py-2 text-inputText outline-none"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.displayName}
                name="displayName"
              />
              {errors.displayName && touched.displayName && (
                <p className="text-sm text-red-500">
                  {String(errors.displayName)}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Password"
              className="rounded-md bg-input px-4 py-2 text-inputText outline-none"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              name="password"
            />
            {errors.password && touched.password && (
              <p className="text-sm text-red-500">{String(errors.password)}</p>
            )}
          </div>
          {!isLoginPage && (
            <div className="flex flex-col">
              <input
                type="password"
                placeholder="Confirm Password"
                className="rounded-md bg-input px-4 py-2 text-inputText outline-none"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
                name="confirmPassword"
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-sm text-red-500">
                  {String(errors.confirmPassword)}
                </p>
              )}
            </div>
          )}
          <div className="flex flex-col">
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-white outline-none"
            >
              {isLoginPage ? 'Login' : 'Create Account'}
            </button>
            <span className="p-1 text-center text-neutral-500">or</span>
            <button
              type="button"
              onClick={googleAuth}
              className="rounded-md bg-white px-4 py-2 text-black outline-none"
            >
              Continue with Google
            </button>
          </div>
        </form>
        <p className="text-sm text-neutral-500">
          {isLoginPage
            ? "Don't have an account? "
            : 'Already have an account? '}
          <span className="text-accent">
            {isLoginPage ? (
              <Link to="/register">Register</Link>
            ) : (
              <Link to="/login">Login</Link>
            )}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
