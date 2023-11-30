'use client'
import React, { useState, useEffect } from 'react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Forum';
import FlagIcon from '@mui/icons-material/Flag';
import '../globals.css'; 

const Forum = () => {
  // const samplePosts = [
  //   {
  //     title: 'Lost My Gains!',
  //     author: 'GymNoob',
  //     tags: ['Fitness', 'Gym'],
  //     likes: 16,
  //     dislikes: 2,
  //     comments: 4,
  //   },
  //   {
  //     title: 'The Great Protein Shake Debate',
  //     author: 'ShakeLover',
  //     tags: ['Protein', 'Humor'],
  //     likes: 32,
  //     dislikes: 1,
  //     comments: 7,
  //   },
  //   {
  //     title: 'How to Avoid Eye Contact at the Gym',
  //     author: 'GymHider',
  //     tags: ['Gym', 'Etiquette'],
  //     likes: 19,
  //     dislikes: 0,
  //     comments: 3,
  //   },
  //   {
  //     title: 'Cardio vs. Lifting',
  //     author: 'FitFreak',
  //     tags: ['Cardio', 'Lifting'],
  //     likes: 45,
  //     dislikes: 4,
  //     comments: 12,
  //   },
  //   {
  //     title: 'Disappearing Gym Socks',
  //     author: 'SockDetective',
  //     tags: ['Funny', 'Gym'],
  //     likes: 22,
  //     dislikes: 3,
  //     comments: 5,
  //   },
  //   {
  //     title: 'Muscles: How Many Are Too Many?',
  //     author: 'MuscleMania',
  //     tags: ['Muscles', 'Humor'],
  //     likes: 38,
  //     dislikes: 2,
  //     comments: 8,
  //   },
  //   {
  //     title: 'Protein Powder: A Love Story',
  //     author: 'ProteinAddict',
  //     tags: ['Protein', 'Love'],
  //     likes: 33,
  //     dislikes: 2,
  //     comments: 7,
  //   },
  // ];

  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [showNewPostPopup, setShowNewPostPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/forums", {
          method: "GET"
        });
        const data = await response.json();
        console.log("Forum data", data);
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch [posts]:", error);
      }
    };
    fetchPosts();
  }, []);

  const handleNewPostClick = () => {
    setShowNewPostPopup(true);
    console.log("clicked");
  };

  const handleClosePopup = () => {
    setShowNewPostPopup(false)
    console.log("closed");
  };

  const handleLikeClick = async (postId) => {
    try {
      // Make a fetch request to your server endpoint
      const response = await fetch("/api/votes/", {
        method: 'POST',
        body: JSON.stringify({
          postId: postId,
          voteType: "UPVOTE"
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          )
        );
      } else {
        console.error('Failed to update like count');
      }
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  const handleDislikeClick = async (postId) => {
    try {
      // Make a fetch request to your server endpoint
      const response = await fetch("/api/votes/", {
        method: 'POST',
        body: JSON.stringify({
          postId: postId,
          voteType: "DOWNVOTE"
        }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          )
        );
      } else {
        console.error('Failed to update like count');
      }
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  const tagOptions = [
    'General',
    'Discussions',
    'Sports',
    'Exercise',
    'ASI',
    'Events',
    // Add more tags as needed
  ];

  const handleTagChange = (tag) => {
    // Toggle the selected state of the tag
    if (selectedTags.includes(tag)) {
      setSelectedTags((prevSelected) => prevSelected.filter((selectedTag) => selectedTag !== tag));
    } else {
      setSelectedTags((prevSelected) => [...prevSelected, tag]);
    }
  };
  
  const handleNewPostSubmit = async () => {
    // Perform validation
    const response = await fetch("/api/forums", {
      method: "POST",
      body: JSON.stringify({
        postTitle: postTitle,
        postDescription: postDescription,
      }),
    });

    if (response.ok) {
      console.log("success added a post");
      posts.push({
        postTitle: postTitle,
        postDescription: postDescription,
      });
    }

    // Close the popup
    handleClosePopup();
  };

  const handleDraftPost = () => {
    // Add the new post to the user database

    // Close the popup
    handleClosePopup();
  };
  return (
    <div className="forum-container">
      {showNewPostPopup && <div className="blur-overlay"></div>}
      <div className="forum-title">
        <h1>Forum</h1>
      </div>
      <div className="forum-body">
        <div className='forum-side-boxes'>
          <button className="new-post-box" onClick={handleNewPostClick}>
            <h2>New Post</h2>
          </button>
          <div className="filters-box">
            <h2>Filters</h2>
            <ul>
              <li>General</li>
              <li>Discussions</li>
              <li>Sports</li>
              <li>Exercise</li>
              <li>ASI</li>
              <li>Events</li>
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
                <h3 className="post-title">{post.postTitle}</h3>
                <div className='post-author-tags'>
                  <p className="post-author">Posted by: {post.authorId}</p>
                  <p className="post-tags">Tags: {post.PostFilters && Array.isArray(post.PostFilters) ? post.PostFilters.join(', ') : ''}</p>

                </div>
              </div>
              <div className="post-actions">
                <button className="like-button"  onClick={() => handleLikeClick(post.id)}>
                  <ThumbUpIcon />
                  <span className="action-count">{post.likes}</span>
                </button>
                <button className="dislike-button"  onClick={() => handleDislikeClick(post.id)}>
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


        {showNewPostPopup && (
        <div className="new-post-popup">
          <div className="popup-content">
            <div className="title-close">
              <h2 style={{ marginBottom: '20px' }}>New Post</h2>
              <button className="close-popup" onClick={handleClosePopup}>
              X
              </button>
            </div>
            <div className="input-field">
              <label>Title</label>
              <input type="text" placeholder="Enter title" onChange={(e) => setPostTitle(e.target.value)} />
            </div>
            <div className="input-field">
              <label>Description</label>
              <textarea placeholder="Enter description" onChange={(e) => setPostDescription(e.target.value)} ></textarea>
            </div>
            <div className="input-field">
                <div className='tag-text'>
                  <label>Tags</label>
                  <h5>(Select 1 to 2)</h5>
                </div>
                <div className="tag-buttons">
                  {tagOptions.map((tag, index) => (
                    <label key={index} className="tag-button">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                      />
                      {tag}
                    </label>
                  ))}
                </div>
             </div>
            <div className="button-container">
              <button className="draft-button" onClick={handleClosePopup}>Save as Draft</button>
              <button className="submit-button" onClick={handleNewPostSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}

      </div>


      


    </div>
  );
};

export default Forum;
