'use client'
import React, { useState } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Forum';
import FlagIcon from '@mui/icons-material/Flag';
import '../globals.css'; 

const Forum = () => {

  // Function to handle the new post button click
  const handleNewPostClick = () => {
    const newPostButton = document.querySelector('.new-post-box');
    newPostButton.classList.add('clicked');

    // Remove the 'clicked' class after the animation finishes
    setTimeout(() => {
      newPostButton.classList.remove('clicked');
    }, 1000); // Adjust the duration to match your animation duration
  };

  const samplePosts = [
    {
      title: 'Lost My Gains!',
      author: 'GymNoob',
      tags: ['Fitness', 'Gym'],
      likes: 16,
      dislikes: 2,
      comments: 4,
    },
    {
      title: 'The Great Protein Shake Debate',
      author: 'ShakeLover',
      tags: ['Protein', 'Humor'],
      likes: 32,
      dislikes: 1,
      comments: 7,
    },
    {
      title: 'How to Avoid Eye Contact at the Gym',
      author: 'GymHider',
      tags: ['Gym', 'Etiquette'],
      likes: 19,
      dislikes: 0,
      comments: 3,
    },
    {
      title: 'Cardio vs. Lifting',
      author: 'FitFreak',
      tags: ['Cardio', 'Lifting'],
      likes: 45,
      dislikes: 4,
      comments: 12,
    },
    {
      title: 'Disappearing Gym Socks',
      author: 'SockDetective',
      tags: ['Funny', 'Gym'],
      likes: 22,
      dislikes: 3,
      comments: 5,
    },
    {
      title: 'Muscles: How Many Are Too Many?',
      author: 'MuscleMania',
      tags: ['Muscles', 'Humor'],
      likes: 38,
      dislikes: 2,
      comments: 8,
    },
    {
      title: 'Protein Powder: A Love Story',
      author: 'ProteinAddict',
      tags: ['Protein', 'Love'],
      likes: 33,
      dislikes: 2,
      comments: 7,
    },
  ];
  
  
  const [posts, setPosts] = useState(samplePosts);
  return (
    <div className="forum-container">
      <div className="forum-title">
        <h1>Forum</h1>
      </div>
      <div className="forum-body">
        <div className='forum-side-boxes'>
          <button className="new-post-box">
            <h2>New Post</h2>
          </button>
          <div className="filters-box">
            <h2>Filters</h2>
            <ul>
              <li>General</li>
              <li>Discussions</li>
              <li>Sports</li>
              <li>Activities</li>
            </ul>
          </div>
          <div className="my-options-box">
            <h2>My Options</h2>
              <div className="option-buttons">
                <button className="my-posts-button">My Posts</button>
                <button className="my-saved-button">My Saved</button>
                <button className="my-drafts-button">My Drafts</button>
              </div>
          </div>
        </div>
        <div className="forum-post-container">
          {posts.map((post, index) => (
            <div className="forum-post" key={index}>
              <div className="post-details">
                <h3 className="post-title">{post.title}</h3>
                <div className='post-author-tags'>
                  <p className="post-author">Posted by: {post.author}</p>
                  <p className="post-tags">Tags: {post.tags.join(', ')}</p>

                </div>
              </div>
              <div className="post-actions">
                <button className="like-button">
                  <ThumbUpIcon />
                  <span className="action-count">{post.likes}</span>
                </button>
                <button className="dislike-button">
                  <ThumbDownIcon />
                  <span className="action-count">{post.dislikes}</span>
                </button>
                <button className="comment-button">
                  <CommentIcon />
                  <span className="action-count">{post.comments}</span>
                </button>
                <button className="flag-button">
                  <FlagIcon style={{ color: 'red' }}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Forum;
