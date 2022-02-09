import React, { useState, useEffect } from 'react';
import Posts from './posts/Posts';
import { db, auth } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
  const [OpenSignUP, setOpenSignUP] = useState(false);
  const [OpenSignIN, setOpenSignIN] = useState(false);
  const [Username, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [User, setUser] = useState({});
  const [LoadingSignUP, setLoadingSignUP] = useState(false);
  const [LoadingSignIN, setLoadingSignIN] = useState(false);

  //  Authentication

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  })

  async function signUp(event) {
    event.preventDefault();
    setLoadingSignUP(true);
    try{
        const user = await createUserWithEmailAndPassword(auth, Email, Password);
        console.log(user)
    } catch (err) {
        console.log(err.message);
    }
    setLoadingSignUP(false);
    setOpenSignUP(false);
  }
  async function signIn(event) {
    event.preventDefault();
    setLoadingSignIN(true);
    try{
        const user = await signInWithEmailAndPassword(auth, Email, Password);
        console.log(user)
    } catch (err) {
        console.log(err.message);
    }
    setLoadingSignIN(false);
    setOpenSignIN(false);
  }
  async function logout() {
    await signOut(auth);
    console.log('Logged Out');
}

  //  getting data from firebase
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

  
  return (
    <div className="app">
        <Modal
          open={OpenSignUP}
          onClose={() => setOpenSignUP(false)}
        >
          <Box sx={style}>
            <form className="app__signup">
              <center>
                <h1>Instagram</h1>
              </center>
              <Input 
                type="text"
                placeholder="User Name"
                value={Username}
                onChange = {(e) => setUsername(e.target.value)}
              />
              <Input 
                type="email"
                placeholder="email"
                value={Email}
                onChange = {(e) => setEmail(e.target.value)}
              />
              <Input 
                type='password'
                placeholder='password'
                value={Password}
                onChange = {(e) => setPassword(e.target.value)}
              />
              <Button disabled={LoadingSignUP} type='submit' onClick={signUp}>Sign UP</Button>
            </form>
          </Box>
        </Modal>
        <Modal
          open={OpenSignIN}
          onClose={() => setOpenSignIN(false)}
        >
          <Box sx={style}>
            <form className="app__signup">
              <center>
                <h1>Instagram</h1>
              </center>
              <Input 
                type="email"
                placeholder="email"
                value={Email}
                onChange = {(e) => setEmail(e.target.value)}
              />
              <Input 
                type='password'
                placeholder='password'
                value={Password}
                onChange = {(e) => setPassword(e.target.value)}
              />
              <Button disabled={LoadingSignIN} type='submit' onClick={signIn}>Sign IN</Button>
            </form>
          </Box>
        </Modal>
        {User ? (
            <Button onClick={logout}> Logout</Button>
          ) : (
            <div>
              <Button onClick={() => setOpenSignUP(true)}>Sign UP</Button>
              <Button onClick={() => setOpenSignIN(true)}>Sign IN</Button>
            </div>
          )}
        {/* <Button onClick={() => setOpen(true)}>Sign UP</Button> */}


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