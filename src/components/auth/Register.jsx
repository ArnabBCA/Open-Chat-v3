import React, { useState } from 'react'
import Avatar from "../icons/avatar.png"
import styles from './Auth.module.scss';
import { Link } from 'react-router-dom'; 
import { useFormik } from 'formik';
import { signUpSchema } from './schemas';
import PreviewImage from './PreviewImage';
import Spiner from '../loading/Spiner';
import SentEmail from './Modal/SentEmail';
import Error from '../modal/Error';
import Modal from '../modal/Modal';
import DuplicateEmail from './Modal/DuplicateEmail';

import { createUserWithEmailAndPassword ,updateProfile,sendEmailVerification,signOut,fetchSignInMethodsForEmail} from 'firebase/auth';
import { auth,storage,db } from '../../firebase';
import { ref, uploadBytes,getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { doc,setDoc,getDoc } from 'firebase/firestore';

const initialValues={
  name:"",
  email:"",
  password:"",
  confirm_password:"",
  file:"",
}
const Register = () => { 
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(false);
  const [errorMessage,setErrorMessage]=useState('');
  const [sentEmailModal,setSentEmailModal]=useState(false);
  const [imageTouched,setImageTouched]=useState(false);


  const [emailTakenModal,setEmailtakenModal]=useState(false);
  const imageHandle=(e)=>{
    setFieldValue("file",e.target.files[0])
    e.target.value = '';
  }

  const {values,errors,touched,handleBlur,handleChange,handleSubmit,setFieldValue,resetForm}=useFormik({
    initialValues:initialValues,
    validationSchema:signUpSchema,
    onSubmit : async (values)=>{
      setImageTouched(false);
      setLoading(true);
      
      try{
        let signInMethods=await fetchSignInMethodsForEmail(auth,values.email)
        if(signInMethods.length>0){
          setEmailtakenModal(true);
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        const imageRef=ref(storage,`profile/${values.email + v4()}`);
        await uploadBytes(imageRef,values.file);
        const url=await getDownloadURL(imageRef);
        await updateProfile(auth.currentUser, {displayName:values.name,photoURL:url,});
        await setDoc(doc(db,"users",auth.currentUser.uid),{
          uid:auth.currentUser.uid,
          displayName:values.name,
          email:values.email,
          photoURL:url,
        });
        await setDoc(doc(db,"userChats",auth.currentUser.uid),{});
        const res= await getDoc(doc(db,"groupChat","GROUPCHATMESSAGES"));
        if(!res.exists()){ 
          await setDoc(doc(db,"groupChat","GROUPCHATMESSAGES"),{messages:[]});
        }  
        console.log(auth.currentUser);
        await sendEmailVerification(auth.currentUser)
        await signOut(auth);
        setLoading(false);
        setSentEmailModal(true);  
        //console.log(auth.currentUser);
      }catch(error){
        setError(true);
        setErrorMessage(error.message);
        setLoading(false);
      };
    },
  });
  return (
    <div className={styles.formContainer}>
      <div className={styles.formWrapper}>
        <div className={styles.banner}>
          <div className={styles.logo}>
            <span className={styles.open}>Open</span>
            <span className={styles.chat}>Chat</span>
          </div>     
          <span className={styles.title}>By Arnab Ghosh</span>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.input}>
            <input type="name" autoComplete='off' name='name' placeholder='Name' value={values.name} onChange={handleChange} onBlur={handleBlur}/>
            {errors.name && touched.name ? <p className={styles.error}>{errors.name}</p> : null}
          </div>
          <div className={styles.input}>
            <input type="email" autoComplete='off' name='email' placeholder='Email' value={values.email} onChange={handleChange} onBlur={handleBlur}/>
            { errors.email && touched.email  ? <p className={styles.error}>{errors.email}</p> : null}
          </div>
          <div className={styles.input}>
            <input type="password" autoComplete='off' name='password' placeholder='Password' value={values.password} onChange={handleChange} onBlur={handleBlur}/>
            {errors.password && touched.password ?<p className={styles.error}>{errors.password}</p> : null}
          </div>
          <div className={styles.input}>
            <input type="password" autoComplete='off' name='confirm_password' placeholder='Confirm Password' value={values.confirm_password} onChange={handleChange} onBlur={handleBlur}/>
            {errors.confirm_password && touched.confirm_password ? <p className={styles.error}>{errors.confirm_password}</p> : null}
          </div>
          <div className={styles.input}>
            <input style={{display:"none"}} type="file" accept='image/*' name='file' id='file' onChange={imageHandle}/>
            <label htmlFor='file'>
              {values.file && !errors.file ? <PreviewImage file={values.file}/> : <img src={Avatar} alt="avatar" />}
              <span>Add an Avatar</span>
            </label>
            {errors.file && (imageTouched || touched.file) ? <p className={styles.error}>{errors.file}</p> : null}
          </div>
          <button type='submit'>{loading ? <Spiner/> : "Create Account"}</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>     
      </div>
      { sentEmailModal && <Modal><SentEmail reset={resetForm} resetModal={setSentEmailModal} email={values.email}/></Modal>}
      { emailTakenModal && <Modal><DuplicateEmail resetTaken={setEmailtakenModal}/></Modal>}
      { error && <Modal><Error error={setError} resetMessage={setErrorMessage} message={errorMessage}/></Modal>}
    </div>
  )
}

export default Register