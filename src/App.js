import React, { useState, useEffect } from 'react';
import Posts from './posts/Posts';
import { db } from './Firebase';
// import { collection, getDocs } from 'firebase/firestore';

import './App.css';
import { collection, getDocs } from 'firebase/firestore';

function App() {
  const [posts, setposts] = useState([])
  
  useEffect(() => {
    const colRef = collection(db, 'posts')
    getDocs(colRef)
    .then((snapshot) => {
      setposts(snapshot.docs.map(doc => doc.data()));
    })
  }, []);


  return (
    <div className="app">
        <div className='app__header'>
            <h1>Instagram</h1>
        </div>
        <div className='app__posts'>
          {posts.map(post => 
            <Posts 
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