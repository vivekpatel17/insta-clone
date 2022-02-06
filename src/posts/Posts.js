import React from 'react';

import './Posts.css';

import { Avatar } from '@material-ui/core';

function posts({username, imageURL, caption}) {
  return (
      <div className="post">
        <div className="post__header">
            <Avatar 
                className="post__headerAvatar"
                alt='Vivek'
            />
            <h3>{username}</h3>
        </div>

        <img 
            className="post__image"
            src={imageURL}
            alt=""
        />
        <h5 className="post__text"><strong>{username}</strong> {caption}</h5>
      </div>
  );
}

export default posts;
