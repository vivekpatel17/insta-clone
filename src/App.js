import React, { useState, useEffect } from 'react';
// import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Posts from './posts/Posts';
import { db, auth, firebaseApp } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { createUser, createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { Input } from '@mui/material';

import './App.css';

function App() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [posts, setposts] = useState([]);
  const [open, setopen] = useState(false);
  const [username, setusername] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [user, setuser] = useState(null);

  useEffect(() => {
    const unsubscribe =  auth.onAuthStateChanged((authuser) => {
      if(authuser ){
        //  User has logged in.
        console.log(authuser);
        setuser(authuser);

        if(authuser.displayName) {
          //  Don't update username.

        } else {
          //  If just created Someone.
          return authuser.updateProfile({
            displayName: username,
          })
        }
      } else {
        //  User has logged out.
        setuser(null);
      }
    })

    return () => {
      //  Perform some Cleanup.
      unsubscribe();
    }
  }, [user, username])
  
  useEffect(() => {
    const colRef = collection(db, 'posts')
    getDocs(colRef)
    .then((snapshot) => {
      setposts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    getAuth(firebaseApp).createUserWithEmailAndPassword(email, password)
    // .createUserWithEmailAndPassword(email, password);
    // .catch((err) => alert(err.message));
    // .createUser({
    //   username: username,
    //   email: email,
    //   password: password,
    // })
    // .then((userRecord) => {
    // //  See the UserRecord reference doc for the contents of userRecord.
    // console.log('Successfully created new user:', userRecord.uid);
    // })
    // .catch((error) => {
    //   console.log('Error creating new user:', error);
    // })
  }
  
  return (
    <div className="app">
        <Modal
          open={open}
          onClose={() => setopen(false)}
        >
          <Box sx={style}>
            <form className="app__signup">
              <center>
                <h1>Instagram</h1>
              </center>
              <Input 
                type="text"
                placeholder="User Name"
                value={username}
                onChange = {(e) => setusername(e.target.value)}
              />
              <Input 
                type="email"
                placeholder="email"
                value={email}
                onChange = {(e) => setemail(e.target.value)}
              />
              <Input 
                type='password'
                placeholder='password'
                value={password}
                onChange = {(e) => setpassword(e.target.value)}
              />
              <Button type='submit' onClick={signUp}>Sign UP</Button>
            </form>

          </Box>
        </Modal>
        <Button onClick={() => setopen(true)}>Sign UP</Button>


        <div className='app__header'>
            <h1>Instagram</h1>
        </div>
        <div className='app__posts'>
          {posts.map(({id, post}) => 
            <Posts 
              key={id}
              username = {post.username}
              imageURL = {post.imageURL}
              caption = {post.caption}
            />
          )}
        </div>

    </div>
  );
}

export default App;