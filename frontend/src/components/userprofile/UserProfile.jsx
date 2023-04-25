import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import Post from "../timeline/feed/post/Post";
import { Container } from "react-bootstrap";
import { AppContext } from "../../App";
import './UserProfile.css'
import NewTweet from "../timeline/feed/tweet/NewTweet";
import { DoneOutline } from "@mui/icons-material";
// UserProfile component is used for showing profile of users
function UserProfile() {
    const pathParameters = useParams();
    const currentUsername = pathParameters.username;
    const[postsList, setPostsList] = useState([]);
    const[currentUserDetails, setCurrentUserDetails] = useState([]);
    const {postDB, setPostDB, activeUsername } = useContext(AppContext)
    const [optionalDesc, setOptionalDesc] = useState('')
    useEffect(() => {
        async function getUserDetails() {
            const userResponse = await axios.get('/api/users/'+currentUsername);
            setCurrentUserDetails(userResponse.data)
            console.log(userResponse.data)
            setOptionalDesc(userResponse.data.bio)
        }
        async function getPostDetails() {
            const postsResponse = await axios.get('/api/posts/profile/'+currentUsername);
            const currentUserPosts = postsResponse.data;
            const sortedPosts = currentUserPosts.sort((a, b) => {
                const timestampA = Date.parse(a.timestamp);
                const timestampB = Date.parse(b.timestamp);
                return timestampB - timestampA; //desc order
              })
            setPostsList(sortedPosts)
        }
        getPostDetails();
        getUserDetails();
       
    },[postDB, currentUsername]);

    const handleDeletePost = async (idToDelete) => {
        const deletePostResponse = await axios.post('/api/posts/delete/'+idToDelete);
        if(deletePostResponse.status === 200) {
            const updatedPosts = postDB.posts.filter(post => post._id !== idToDelete);
            const updatedCurrentPosts = postsList.filter(post => post._id !== idToDelete);
            setPostDB({posts: updatedPosts});
            setPostsList(updatedCurrentPosts);
        }
    }

    const saveBio = async () => {
        const bioUpdateResponse = await axios.post('/api/users/edit/'+currentUsername, {bio: optionalDesc});
    }

    return (
        <div className="user-profile">
                <Container className="user-profile-container">
                    <div className="user-profile-inner-container">
                    {activeUsername === currentUsername && <NewTweet/>}
                        <div className="user-profile-header">
                            <h1 className="username-header-text">{currentUsername}</h1>
                            {activeUsername === currentUsername &&
                            <div className="optional-desc-container">
                                <form className="bio-desc-form">
                                    <div className="bio-desc-form-field">   
                                        <div className="bio-desc-form-input">
                                            <label className="bio-label" htmlFor="optionalDescInput">Optional Description</label>
                                            <input 
                                            type="text" 
                                            placeholder="Write about yourself ..." 
                                            name="optionalDescInput"
                                            value={optionalDesc}
                                            onChange={(e) => setOptionalDesc(e.target.value)}/>
                                        </div>
                                        
                                        <div className="bio-desc-form-btn">
                                            <DoneOutline className="save-changes-icon bio-desc-icon-btn" onClick={saveBio}/> 
                                        </div>
                                    </div>
                                </form>
                            </div>
                            }
                            <span className="join-date-text">Joined on: {currentUserDetails.timestamp}</span>
                        </div>
                        {
                                postsList.length == 0 && <div className="no-post-text">No posts to show</div>
                            }
                        <div className="my-posts-container">
                            { 
                            postsList.map((post) => {   
                                return <Post key={post._id} id={post._id} username={post.username} content={post.content} timestamp={post.timestamp} onDeletePost={handleDeletePost}/>
                            })}
                        </div>
                    </div>
                </Container>
        </div>    
    );
}

export default UserProfile;