'use client'

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import EventIcon from '@mui/icons-material/Event';
import { Card, CardContent, Container, Paper, Typography } from "@mui/material";
import '../globals.css';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        creator: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        attendees: 0,
        interestedCount: 0,
        goingCount: 0,
        creatorId: '123' // replace this with actual userID in future
    });

    const [errorMessage, setErrorMessage] = useState(""); //error message

    const userId = '123'; // simulated current userID

    const [editIndex, setEditIndex] = useState(null);

    // track user interactions
    const [userInteractions, setUserInteractions] = useState({});


    const [editEvent, setEditEvent] = useState({
        title: '',
        creator: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        attendees: 0,
        interestedCount: 0,
        goingCount: 0,
        creatorId: ''
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditIndex(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleAddEvent = async() => {
        if (
            !newEvent.title ||
            !newEvent.creator ||
            !newEvent.date ||
            !newEvent.startTime ||
            !newEvent.endTime ||
            !newEvent.location ||
            !newEvent.attendees
        ) {
            setErrorMessage('Missing required fields'); // Show an alert if any required field is empty
            return; // Don't proceed further
        }

        const response = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventName: newEvent.title,
                location: newEvent.location,
                startTime: newEvent.startTime,
                endTime: newEvent.endTime,
                maxAttendee: newEvent.attendees,
                filterIds: [1]
            }),
          });

        console.log(response)

        if (editIndex !== null) {
            const updatedEvents = [...events];
            updatedEvents[editIndex] = newEvent;
            setEvents(updatedEvents);
            setEditIndex(null);
        } else {
            const updatedEvents = [...events, newEvent];
            setEvents(updatedEvents);
        }
        setNewEvent({
            title: '',
            creator: '',
            date: '',
            startTime: '',
            endTime: '',
            location: '',
            attendees: 0,
            interestedCount: 0,
            goingCount: 0,
            creatorId: '123' // Reset to the default user ID after adding the event
        });
        setOpen(false);
    };

    const handleRemoveEvent = (index) => {
        const eventToRemove = events[index];
        if (eventToRemove.creatorId === userId) {
            const updatedEvents = events.filter((event, i) => i !== index);
            setEvents(updatedEvents);
        } else {
            console.log("You are not authorized to delete this event.");
        }

        // const response = await fetch("/api/events", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({
        //         eventName: newEvent.title,
        //         location: newEvent.location,
        //         startTime: newEvent.startTime,
        //         endTime: newEvent.endTime,
        //         maxAttendee: newEvent.attendees,
        //         filterIds: newEvent
        //     }),
        //   });
    };

    const handleEditEvent = async(index) => {
        const eventToEdit = events[index];
        if (eventToEdit.creatorId === userId) {
            setEditIndex(index);
            setNewEvent(eventToEdit);
            setOpen(true);
        } else {
            console.log("You are not authorized to edit this event.");
        }

        const response = await fetch("/api/events", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventName: newEvent.title,
                location: newEvent.location,
                startTime: newEvent.startTime,
                endTime: newEvent.endTime,
                maxAttendee: newEvent.attendees,
                filterIds: [1]
            }),
          });
    };

    // Function to handle "Interested" click
    const handleInterested = (index) => {
        const updatedEvents = [...events];
        const userInteracted = userInteractions[index]?.interested || false;

        if (!userInteracted) {
            updatedEvents[index].interestedCount++;
            setUserInteractions({
                ...userInteractions,
                [index]: { ...userInteractions[index], interested: true }
            });
        } else {
            updatedEvents[index].interestedCount--;
            setUserInteractions({
                ...userInteractions,
                [index]: { ...userInteractions[index], interested: false }
            });
        }

        setEvents(updatedEvents);
    };

    // Function to handle "Going" click (similar to "Interested" function)
    const handleGoing = (index) => {
        const updatedEvents = [...events];
        const userInteracted = userInteractions[index]?.going || false;

        if (!userInteracted) {
            updatedEvents[index].goingCount++;
            setUserInteractions({
                ...userInteractions,
                [index]: { ...userInteractions[index], going: true }
            });
        } else {
            updatedEvents[index].goingCount--;
            setUserInteractions({
                ...userInteractions,
                [index]: { ...userInteractions[index], going: false }
            });
        }

        setEvents(updatedEvents);
    };

    return (
        <Container className="events-container">
            <Paper>
            <Typography variant="h5" className="events-title">Events</Typography>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "stretch" }}>
                    <div>
                        <List>
                            {events.map((event, index) => (
                                <ListItem key={index}>
                                    <Card>
                                        <CardContent>
                                            <div style={{ marginBottom: 10}}>
                                                <Typography variant="h6" className="events-name">{event.title}</Typography>
                                                <Typography variant="body2" className="events-description">
                                                    Date: {event.date}
                                                </Typography>
                                                <Typography variant="body2" className="events-description">
                                                    Time: {event.startTime} - {event.endTime}
                                                </Typography>
                                                <Typography variant="body2" className="events-description">
                                                    Location: {event.location}
                                                </Typography>
                                                <Typography variant="body2" className="events-description">
                                                    Creator: {event.creator}
                                                </Typography>
                                                <Typography variant="body2" className="events-description">
                                                    Maximum Participants: {event.attendees}
                                                </Typography>
                                                <div>
                                                    <Button className="events-info-button" startIcon={<ThumbUpIcon />} onClick={() => handleInterested(index)}>
                                                        Interested ({event.interestedCount})
                                                    </Button>
                                                    <Button className="events-info-button" startIcon={<EventIcon />} onClick={() => handleGoing(index)}>
                                                        Going ({event.goingCount})
                                                    </Button>
                                                    {event.creatorId === userId && (
                                                        <>
                                                            <Button className="events-info-button" onClick={() => handleRemoveEvent(index)}>
                                                                Delete
                                                            </Button>
                                                            <Button className="events-info-button" onClick={() => handleEditEvent(index)}>
                                                                Edit
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </ListItem>
                            ))}
                        </List>
                        <div style={{textAlign: "center"}}>
                            <Button
                                variant="contained"
                                className="events-button"
                                onClick={handleClickOpen}
                            >
                                Add Event
                            </Button>
                        </div>
                        <Dialog open={open} onClose={handleClose}>
                            <DialogTitle className="events-title">Add New Event</DialogTitle>
                            <DialogContent>
                                <TextField
                                    margin="normal"
                                    label="Title"
                                    name="title"
                                    value={newEvent.title}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="normal"
                                    label="Date"
                                    name="date"
                                    type="date"
                                    value={newEvent.date}
                                    onChange={handleInputChange}
                                    fullWidth
                                    placeholder="MM/DD/YYYY"
                                />
                                <TextField
                                    margin="normal"
                                    label="Start Time"
                                    name="startTime"
                                    type="time"
                                    value={newEvent.startTime}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="normal"
                                    label="End Time"
                                    name="endTime"
                                    type="time"
                                    value={newEvent.endTime}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="normal"
                                    label="Location"
                                    name="location"
                                    value={newEvent.location}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="normal"
                                    label="Creator"
                                    name="creator"
                                    value={newEvent.creator}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                <TextField
                                    margin="normal"
                                    label="Maximum Attendees"
                                    name="attendees"
                                    value={newEvent.attendees}
                                    onChange={handleInputChange}
                                    fullWidth
                                />
                                {errorMessage && (
                                    <Typography color="error">
                                        {errorMessage}
                                    </Typography>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button className="events-info-button" onClick={handleClose} color="primary">Cancel</Button>
                                <Button className="events-info-button" onClick={handleAddEvent} color="primary">Add</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </Paper>
        </Container>
    );
};

export default Events;
