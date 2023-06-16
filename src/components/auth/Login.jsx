import React, { useState } from 'react'
import styles from './Auth.module.scss';
import { Link,useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Modal from '../modal/Modal';
import Error from '../modal/Error';
import EmailNotVerified from './Modal/EmailNotVerified';
import GoogleButton from 'react-google-button';
import Spiner from '../loading/Spiner';
import InvalidUser from './Modal/InvalidUser';

import { auth,db } from '../../firebase';
import { signInWithEmailAndPassword,signOut,GoogleAuthProvider,signInWithPopup,getAdditionalUserInfo } from 'firebase/auth';
import { doc,setDoc,getDoc } from 'firebase/firestore';

const initialValues={
    email:"",
    password:"",
}
const loginInSchema=Yup.object({
    email:Yup.string().email().required("Email cannot be empty"),
    password:Yup.string().required("Password cannot be empty"),
});
const Login = () => {
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(false);
    const [errorMessage,setErrorMessage]=useState('');
    const [emailNotVerified,setEmailNotVerified]=useState(false);
    const [invalidUser,setInvalidUser]=useState(false);
    const {values,errors,touched,handleBlur,handleChange,handleSubmit,resetForm}=useFormik({
        initialValues:initialValues,
        validationSchema:loginInSchema,
        onSubmit:async(values)=>{
            ///console.log(values);
            setLoading(true);
            try{
                await signInWithEmailAndPassword(auth,values.email,values.password).then(authUser=>{
                    if(authUser.user.emailVerified){
                        navigate("/");
                        resetForm();
                        console.log(authUser.user);
                    }
                    else{
                        signOut(auth);
                        setEmailNotVerified(true);
                    }        
                });
                setLoading(false);     
            }catch(error){
                setInvalidUser(true);
                setLoading(false);
            }            
        },
    });
    const googleSignIn= async ()=>{
        const provider=new GoogleAuthProvider();
        try{
            const res=await signInWithPopup(auth,provider);
            const { isNewUser } = getAdditionalUserInfo(res);
            if(isNewUser)
            {
                await setDoc(doc(db,"users",auth.currentUser.uid),{
                    uid:auth.currentUser.uid,
                    displayName:auth.currentUser.displayName,
                    email:auth.currentUser.email,
                    photoURL:auth.currentUser.photoURL,
                });
                await setDoc(doc(db,"userChats",auth.currentUser.uid),{});
                const res= await getDoc(doc(db,"groupChat","GROUPCHATMESSAGES"));
                if(!res.exists()){ 
                    await setDoc(doc(db,"groupChat","GROUPCHATMESSAGES"),{messages:[]});
                }           
            }
            console.log(isNewUser);
            navigate("/");
            console.log(auth.currentUser);
        }catch(error){
            setError(true);
            setErrorMessage(error.message);
        }
    }
  return (
    <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
            <div className={styles.banner}>
                <div className={styles.logo}>
                    <span className={styles.open}>Open</span>
                    <span className={styles.chat}>Chat</span>
                </div>     
                <span>By Arnab Ghosh</span>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={styles.input}>
                    <input type="email" autoComplete='off' name='email' placeholder='Email' value={values.email} onChange={handleChange} onBlur={handleBlur}/>
                    {errors.email && touched.email ?<p className={styles.error}>{errors.email}</p> : null}
                </div>
                <div className={styles.input} >
                    <input type="password" autoComplete='off' name='password' placeholder='Password' value={values.password} onChange={handleChange} onBlur={handleBlur}/>
                    {errors.password && touched.password ?<p className={styles.error}>{errors.password}</p> : null}
                </div>
                <button type='submit'>{loading ? <Spiner/> : "login"}</button>
                <GoogleButton onClick={googleSignIn}/>
            </form>
            <p>Don't have an account? <Link to="/register">Signup</Link></p>    
        </div>
        {emailNotVerified && <Modal><EmailNotVerified verify={setEmailNotVerified} email={values.email}/></Modal>}
        {invalidUser && <Modal><InvalidUser user={setInvalidUser}/></Modal>}
        {error && <Modal><Error error={setError} resetMessage={setErrorMessage} message={errorMessage}/></Modal> }
    </div>
  )
}

export default Login