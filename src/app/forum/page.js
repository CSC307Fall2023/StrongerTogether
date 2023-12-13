'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Forum';
import FlagIcon from '@mui/icons-material/Flag';
import '../globals.css'; 

const Forum = () => {
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [showNewPostPopup, setShowNewPostPopup] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTagsIds, setSelectedTagsIds] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedFiltersIds, setSelectedFiltersIds] = useState([]); // Filtering posts by tags
  const [posts, setPosts] = useState([]);
  const [userInteraction, setUserInteraction] = useState(false);

  const { data : session, status} = useSession();
  let userId = session?.user?.id;
  console.log("current session user id", userId);
  

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
  }, [userInteraction]);

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
        updatedPost.postTitle = posts.find((post) => post.id === postId).postTitle;
        updatedPost.authorId = posts.find((post) => post.id === postId).authorId;
        updatedPost.total_vote = posts.find((post) => post.id === postId).total_vote;
        console.log("Updated Post =", updatedPost);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          )
        );
        setUserInteraction(!userInteraction);
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
        updatedPost.postTitle = posts.find((post) => post.id === postId).postTitle;
        updatedPost.authorId = posts.find((post) => post.id === postId).authorId;
        updatedPost.total_vote = posts.find((post) => post.id === postId).total_vote;
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          )
        );
        setUserInteraction(!userInteraction);
      } else {
        console.error('Failed to update like count');
      }
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  const tagOptions = {
    "General": 1,
    "Discussions": 2,
    "Sports": 3,
    "Exercise": 4,
    "ASI": 5,
    "Events": 6,
  };

  const handleTagChange = (tag) => {
    let newSelectedTags;
    // Toggle the selected state of the tag
    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter((selectedTag) => selectedTag !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }
    setSelectedTags(newSelectedTags); 

    const selectedTagsIds = newSelectedTags.map((tag) => tagOptions[tag]);
    setSelectedTagsIds(selectedTagsIds);
  
    console.log("Selected tags", newSelectedTags);
    console.log("Selected tags ids", selectedTagsIds);
    };

    const isPostInSelectedFilters = (post) => {
      if (selectedFiltersIds.length === 0) {
        return true;
      }
      if (!post.filters || post.filters.length === 0) {
        return false;
      }

      for (let filter of post.filters) {
        if (selectedFiltersIds.includes(filter.FilterId)) {
          return true;
        }
      }
      return false;
    };

  const handleFilterChange = (filter) => {
    let newSelectedFilters;
    if (selectedFilters.includes(filter)) {
      newSelectedFilters = selectedFilters.filter(f => f !== filter);
    } else {
      newSelectedFilters = [...selectedFilters, filter];
    }
  
    const newSelectedFiltersIds = newSelectedFilters.map(f => tagOptions[f]);
    setSelectedFilters(newSelectedFilters);
    setSelectedFiltersIds(newSelectedFiltersIds);
  
    console.log("Selected filters", newSelectedFilters);
    console.log("Selected filters ids", newSelectedFiltersIds);
  }; 
  
  const handleNewPostSubmit = async () => {
    console.log("Selected tags ids", selectedTagsIds);
    const response = await fetch("/api/forums", {
      method: "POST",
      body: JSON.stringify({
        postTitle: postTitle,
        postDescription: postDescription,
        authorId: userId,
        filterIds: selectedTagsIds,
      }),
    });

    if (response.ok) {
      console.log("success added a post");
      posts.push({
        postTitle: postTitle,
        postDescription: postDescription,
        authorId: userId,
        PostFilters: selectedTagsIds,
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
            {Object.keys(tagOptions).map((tag, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFilters.includes(tag)}
                    onChange={() => handleFilterChange(tag)}
                  />
                  {tag}
                </label>
              </div>
            ))}
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
          {posts.filter(isPostInSelectedFilters).map((post, index) => (
            <div className="forum-post" key={index}>
              <div className="post-details">
                <h3 className="post-title">{post.postTitle}</h3>
                <div className='post-author-tags'>
                  <p className="post-author">Posted by: {post.name}</p>
                  {/* <p className="post-tags">Tags: {post.PostFilters && Array.isArray(post.PostFilters) ? post.PostFilters.join(', ') : ''}</p> */}
                  <p className="post-votes">Votes: {post.total_vote}</p>

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
                  {Object.keys(tagOptions).map((tag, index) => (
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
              {/* <button className="draft-button" onClick={handleClosePopup}>Save as Draft</button> */}
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
