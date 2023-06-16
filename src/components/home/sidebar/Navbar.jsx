import { signOut } from 'firebase/auth';
import React, { useContext } from 'react'
import styles from './Navbar.module.scss';
import { auth } from '../../../firebase';
import { AuthContext } from '../../../context/AuthContext';

const Navbar = () => {
  const {currentUser}=useContext(AuthContext);
  return (
    <div className={styles.navbar}>
        <div className={styles.user}>
            <img  referrerPolicy='no-referrer' src={currentUser.photoURL} alt="avatar" />
            <span>{currentUser.displayName}</span>
        </div>
        <div className={styles.logout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          <button type='button' onClick={()=>signOut(auth)}>Logout</button>
        </div>
    </div>
  )
}

export default Navbar