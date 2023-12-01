'use client'
import { useSession, getSession} from 'next-auth/react';
import React, { useState, useEffect } from 'react';
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
    const { data: session, status }  = useSession();
    let userId = session?.user?.id;
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        attendees: 0,
        interestedCount: 0,
        goingCount: 0,
        eventId: 0,
        hostId: -1 // replace this with actual userID in future
    });

    const [errorMessage, setErrorMessage] = useState(""); //error message
    const [editIndex, setEditIndex] = useState(null);

    // track user interactions
    const [userInteractions, setUserInteractions] = useState({});


    const [editEvent, setEditEvent] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        attendees: 0,
        interestedCount: 0,
        goingCount: 0,
        hostId: -1
    });

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const response = await fetch("/api/events", {
              method: "GET"
            });
            const data = await response.json();
            setEvents(data);
          } catch (error) {
            console.error("Failed to fetch events", error);
          }
        };
        fetchEvents();
      }, []);


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
            !newEvent.date ||
            !newEvent.startTime ||
            !newEvent.endTime ||
            !newEvent.location ||
            !newEvent.attendees
        ) {
            setErrorMessage('Missing required fields'); // Show an alert if any required field is empty
            return; // Don't proceed further
        }
        console.log(newEvent.startTime);
        let formattedStartTime = newEvent.date + "T" + newEvent.startTime + ":00" + 'Z';
        let formattedEndTime = newEvent.date + "T" + newEvent.endTime + ":00" + 'Z';
        const response = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventName: newEvent.title,
                location: newEvent.location,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                maxAttendee: newEvent.attendees,
            }),
          });

        if (response.ok) {
            response.json().then((responseData) => {
                const { id } = responseData;
                newEvent.hostId = userId;
                setNewEvent((event) => ({...event, eventId: id, hostId: userId}))
                const updatedEvents = [...events, newEvent];
                setEvents(updatedEvents);
            })
        }

        console.log(response)

        // if (editIndex !== null) {
        //     const updatedEvents = [...events];
        //     updatedEvents[editIndex] = newEvent;
        //     setEvents(updatedEvents);
        //     setEditIndex(null);
        // } else {
        //     const updatedEvents = [...events, newEvent];
        //     setEvents(updatedEvents);
        // }
        setNewEvent({
            title: '',
            date: '',
            startTime: '',
            endTime: '',
            location: '',
            attendees: 0,
            interestedCount: 0,
            goingCount: 0,
            eventId: 0,
            hostId: userId // Reset to the default user ID after adding the event
        });
        setOpen(false);
    };

    const handleRemoveEvent = async(index) => {
        const eventToRemove = events[index];
        if (eventToRemove.hostId === userId) {
            const updatedEvents = events.filter((event, i) => i !== index);
            setEvents(updatedEvents);
        } else {
            console.log("You are not authorized to delete this event.");
        }

        console.log(eventToRemove);

        const response = await fetch("/api/events", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: eventToRemove.eventId
            }),
          });
        if (response.ok) {
            console.log("event deleted")
        }
    };

    const handleEditEvent = async(index) => {
        const eventToEdit = events[index];
        if (eventToEdit.hostId === userId) {
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
                                                    Maximum Participants: {event.attendees}
                                                </Typography>
                                                <div>
                                                    <Button className="events-info-button" startIcon={<ThumbUpIcon />} onClick={() => handleInterested(index)}>
                                                        Interested ({event.interestedCount})
                                                    </Button>
                                                    <Button className="events-info-button" startIcon={<EventIcon />} onClick={() => handleGoing(index)}>
                                                        Going ({event.goingCount})
                                                    </Button>
                                                    {event.hostId === userId && (
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
