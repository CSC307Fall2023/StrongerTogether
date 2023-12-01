'use client'

import { useState } from 'react';
import './profile.css';
//import '../globals.css';


import { Card, CardContent, Button, TextField, FormControl, Avatar, InputLabel, NativeSelect } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';





export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isPrivate, setPrivate] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState();
  const [experience, setExperience] = useState('No experience set');
  const [errorMessage, setErrorMessage] = useState("");
  // TODO: add useState for interested in, upcoming events, forum activities
  const { data : session, status} = useSession();

  useEffect(() => {
    let userId = session?.user?.id;
    async function getId(){
      const response = await fetch("/api/users", {
        method: "GET"
      })
      return response;
    }
    getId().then(
      (response) => response.json()
    ).then((user) => {
      const {id, name, email, status, ProfileImage, shortBio} = user;
      console.log(ProfileImage)
      setName(name);
      setPrivate((check) => status === 'PRIVATE' ? true : false);
      setPhoto(ProfileImage)
      setBio(shortBio)
    });
    

  }, []);

  const customButtonStyle = {
    backgroundColor: '#003831',
    color: 'white',
  };

  const handleSaveProfile = async () => { 
      const response = await fetch("/api/users", {
          method: "PUT",
          body: JSON.stringify({
            name,
            shortBio: bio,
            status: isPrivate ? "PRIVATE" : "PUBLIC",
            ProfileImage: "Something",
          }),
        });
        console.log(response)
      };
  

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleBioChange = async (e) => {
    setBio(e.target.value)
  };
  
  
  

  const handlePhotoChange = (e) => {
    const selectedPhoto = e.target.files[0];
    setPhoto(URL.createObjectURL(selectedPhoto));
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const toggleStatus = () => {
    setPrivate(!isPrivate)
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value)
  };

  return (
    <div className='background'>
    <div className="profile-container">
      <div className="profile-form">
        <div className="profile-photo">
          <center>
            <Avatar
              alt="Profile"
              src={photo}
              sx={{ width: 150, height: 150 }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
              id="photo-upload"
            />
            {isEditing &&
              <label htmlFor="photo-upload">
                <Button
                  className="spacing"
                  variant="contained"
                  color='primary'
                  component="span"
                  size='small'
                  style={customButtonStyle}
                  startIcon={<PhotoCamera />}
                >
                  Upload Photo
                </Button>
              </label>
            }
            <Button
              className="spacing"
              variant="text"
              onClick={() => {
                toggleEditing()
                console.log("editing", isEditing)
                isEditing ? handleSaveProfile() : null
              }
              }
              size='small'
            >
              {isEditing ? 'Save' : 'Edit'}
            </Button>
          </center>
        </div>
        <div className="profile-info">
          <div className={`profile-name ${isEditing ? 'editing' : ''}`}>
            {isEditing ? (
              <TextField
                className="font"
                label="Your Name"
                size='normal'
                value={name}
                onChange={handleNameChange}
                margin='normal'
              />
            ) : (
              <div className="font">
                <b>{name}</b>
              </div>
            )}
          </div>
          <div className={`profile-bio ${isEditing ? 'editing' : ''}`}>
            {isEditing ? (
              <TextField
                placeholder="Short Bio"
                minRows={4}
                value={bio}
                onChange={handleBioChange}
                margin='normal'
              />
            ) : (
              bio
            )}
          </div>
          <div className="profile-status">
            <Button
              className="spacing"
              variant="contained"
              onClick={toggleStatus}
              size='small'
              style={customButtonStyle}
            >
              {isPrivate ? 'Private' : 'Public'}
            </Button>
          </div>
        </div>
        <div className='middle'>
          <div className='gym-frequency'>
            <b><p>Gym frequency:</p></b>
            {isEditing ? (
              <FormControl
                variant="filled">
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                </InputLabel>
                <div className="select-wrapper">
                  <NativeSelect
                    defaultValue={''}
                    //onChange={handleExperienceChange}
                    inputProps={{
                      name: 'Frequency',
                      id: 'uncontrolled-native',
                    }}
                  >
                    <option className='option-frequency'>1 time a week</option>
                    <option className='option-frequency'>2-3 times a week</option>
                    <option className='option-frequency'>4-5 times a week</option>
                    <option className='option-frequency'>EVERY DAY</option>
                  </NativeSelect>
                </div>

              </FormControl>
            ) : (
              experience
            )}
          </div>
          <div className="bottom-cards-container">
            <Card>
              <CardContent>
                <div className='interested-in'>
                  <center><b><p>Interested in</p></b></center>

                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className='upcoming-event'>
                  <center><b><p>Upcoming Events</p></b></center>
                  <div className="eventContent">
                    <div className="title">Basketball</div>
                    <div className="body">Location: Rec-Center courts</div>
                    <div className="body">Date: 11/9/2023</div>
                    <div className="body">Time: 3pm </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className='forum-activity'>
                  <center><b><p>Forum Activity</p></b></center>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
