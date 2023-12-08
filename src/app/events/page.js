"use client";

import { useSession, getSession} from 'next-auth/react';
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Card, CardContent, Container, Paper, Typography } from "@mui/material";
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import "../globals.css";

const Events = () => {
  const { data: session, status }  = useSession();
  let userId = session?.user?.id; // current userID
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    id: 0,
    hostId: 0,
    title: "",
    creator: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    interestedCount: 0,
    goingCount: 0,
    maxAttendee: 0,
    EventFilter: [],
    eventAttendee: []
  });
  
  const [errorMessage, setErrorMessage] = useState(""); //error message
  const [editIndex, setEditIndex] = useState(null);

  // track user interactions
  const [userInteractions, setUserInteractions] = useState({});

  function formatISO8601ToDateOnly(isoString) {
    const date = new Date(isoString);

    // Getting components of the date
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Combine the date components
    return `${month} ${day}, ${year}`;
  }

  function formatISO8601ToTimeOnly(isoString) {
    const date = new Date(isoString);

    // Formatting the time in 12-hour format with AM/PM
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Combine the time components
    return `${hours}:${minutes}${ampm}`;
  }

  const addEventData = async () => {

    // const [newEvent, setNewEvent] = useState({
    //     id: 0,
    //     hostId: 0,
    //     title: "",
    //     creator: "",
    //     date: "",
    //     startTime: "",
    //     endTime: "",
    //     location: "",
    //     interestedCount: 0,
    //     goingCount: 0,
    //     maxAttendee: 0,
    //     EventFilter: [],
    //   });
    try {
        // Combine date and time
        const startTime = new Date(newEvent.date + "T" + newEvent.startTime);
        const endTime = new Date(newEvent.date + "T" + newEvent.endTime);
        const ISOStartTime = startTime.toISOString();
        const ISOEndTime = endTime.toISOString();
        const eventData = {
            eventName: newEvent.title,
            location: newEvent.location,
            startTime: ISOStartTime,
            endTime: ISOEndTime,
            maxAttendee: newEvent.maxAttendee,
          }
        
        // Make a fetch request to your server endpoint
        const response = await fetch("/api/events", {
          method: 'POST',
          body: JSON.stringify({
            ...eventData
          }),
        });
  
        if (response.ok) {
          const addedEvent = await response.json();
          const {
            id,
            hostId,
            eventName,
            location,
            startTime,
            endTime,
            maxAttendee,
            EventFilter,
            host: { name },
          } = addedEvent;
          console.log("addedEvent", addEventData)
          setEvents((events) =>
            [...events, {
                id,
                maxAttendee,
                hostId,
                title: eventName,
                creator: name,
                date: formatISO8601ToDateOnly(startTime),
                startTime: formatISO8601ToTimeOnly(startTime),
                endTime: formatISO8601ToTimeOnly(endTime),
                location: location,
                interestedCount: 0,
                goingCount: 0,
                EventFilter,
                eventAttendee: []

            }]
          );
        } else {
          console.error('Failed to add new post');
        }
      } catch (error) {
        console.error('Error adding new Post:', error);
      }
  }

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events", {
          method: "GET",
        });
        const data = await response.json();
        console.log("Events data", data);
        const manyEvents = data.map((event) => {
          const {
            id,
            hostId,
            eventName,
            location,
            startTime,
            endTime,
            maxAttendee,
            EventFilter,
            host: { name },
            EventAttendee
          } = event;
          const eventAttendee = EventAttendee.map((attendee) => attendee.user.name);
          console.log("eventAttendee", eventAttendee);
          return {
            id,
            maxAttendee,
            hostId,
            title: eventName,
            creator: name,
            date: formatISO8601ToDateOnly(startTime),
            startTime: formatISO8601ToTimeOnly(startTime),
            endTime: formatISO8601ToTimeOnly(endTime),
            location: location,
            interestedCount: eventAttendee.length,
            goingCount: 0,
            EventFilter,
            eventAttendee
          };
        });
        setEvents(manyEvents);
      } catch (error) {
        console.error("Failed to fetch [posts]:", error);
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
      !newEvent.maxAttendee
    ) {
      setErrorMessage('Missing required fields'); // alert if any required field is empty
      return; // Don't proceed further
    }

    // combine start time early so I can check if its valid
    const startTime = new Date(newEvent.date + "T" + newEvent.startTime);
    const endTime = new Date(newEvent.date + "T" + newEvent.endTime);
    const now = new Date();

    // Check if the event date is after today's date
    if (startTime <= now) {
      setErrorMessage("Event date must be after today's date");
      return; // Don't proceed further
    }

    const eventStartTime = startTime.getHours();
    const eventEndTime = endTime.getHours();

    if ((eventStartTime >= 6 && eventStartTime < 24) && (eventEndTime > 6 && eventEndTime <= 24)) {
      setErrorMessage("Event time must be after 6 am and before 12 am");
      return; // Don't proceed further
    }

    if(eventStartTime >= eventEndTime) {
      setErrorMessage("The start time must be before the end time")
      return; //Don't proceed further
    }

    if (editIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[editIndex] = newEvent;

      // Combine date and time
      const ISOStartTime = startTime.toISOString();
      const ISOEndTime = endTime.toISOString();

      const response = await fetch("/api/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newEvent.id,
          eventName: newEvent.title,
          location: newEvent.location,
          startTime: ISOStartTime,
          endTime: ISOEndTime,
          maxAttendee: newEvent.maxAttendee,
          filterIds: [6]
        }),
      });

      setEvents(updatedEvents);
      setEditIndex(null);
    } else {
      addEventData(); // call to add it to new events
    }
    setNewEvent({
      title: "",
      creator: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      interestedCount: 0,
      goingCount: 0,
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
          id: eventToRemove.id
      }),
    });
    if (response.ok) {
        console.log("event deleted")
    }
  };

  const handleEditEvent = (index) => {
    const eventToEdit = events[index];
    if (eventToEdit.hostId === userId) {
      setEditIndex(index);
      setNewEvent(eventToEdit);
      setOpen(true);
    } else {
      console.log("You are not authorized to edit this event.");
    }
  };

  // Function to handle "Interested" click
  const handleInterested = async (index) => {
    const updatedEvents = [...events];
    const userInteracted = userInteractions[index]?.interested || false;
    const eventId = updatedEvents[index]['id']
    if (!userInteracted) {
      setUserInteractions({
        ...userInteractions,
        [index]: { ...userInteractions[index], interested: true },
      });
    } else {
      setUserInteractions({
        ...userInteractions,
        [index]: { ...userInteractions[index], interested: false },
      });
    }
    try {
      // Make a fetch request to your server endpoint
      const response = await fetch("/api/eventAttendee", {
        method: 'POST',
        body: JSON.stringify({
          eventId
        }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        if (updatedEvent.type === "create") updatedEvents[index].interestedCount++;
        else updatedEvents[index].interestedCount--;
        setEvents(updatedEvents);
      } else {
        console.error('Failed to update like count');
      }
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };

  // Function to handle "Going" click (similar to "Interested" function)
  const handleGoing = async (index) => {
    const updatedEvents = [...events];
    const userInteracted = userInteractions[index]?.going || false;

    if (!userInteracted) {
      updatedEvents[index].goingCount++;
    } else {
      updatedEvents[index].goingCount--;
    }

    setUserInteractions({
      ...userInteractions,
      [index]: { ...userInteractions[index], going: !userInteracted },
    });

    setEvents(updatedEvents);
  };

  return (
    <Container className="events-container">
      <Paper>
        <Typography variant="h5" className="events-title">
          Events
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          <div> 
            <List>
              {events.map((event, index) => (
                <ListItem key={index}>
                  <Card>
                    <CardContent>
                      <div style={{ margin: "10px 20px", width: 500}}>
                        <Typography variant="h6" className="events-name">
                          {event.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="events-description"
                        >
                          Date: {event.date}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="events-description"
                        >
                          Time: {event.startTime} - {event.endTime}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="events-description"
                        >
                          Location: {event.location}
                        </Typography>
                        <Typography
                          variant="body2"
                          className="events-description"
                        >
                          Max Attendees: {event.maxAttendee}
                        </Typography>
                        <div>
                          <Button
                            className="events-info-button"
                            startIcon={<ThumbUpIcon />}
                            onClick={() => handleInterested(index)}
                          >
                            Interested ({event.interestedCount})
                          </Button>
                          <ListItemButton onClick={() => handleGoing(index)}>
                            <ListItemText primary="Who's Going?" />
                            {userInteractions[index]?.going ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                          <Collapse in={userInteractions[index]?.going} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                              {events[index]['eventAttendee'].length > 0 ? (
                                events[index]['eventAttendee'].map((attendeeName, attendeeIndex) => (
                                  <ListItemText key={attendeeIndex} primary={attendeeName} />
                                ))
                              ) : (
                                <ListItemText key={index} primary="No One :(" />
                              )}
                            </ListItemButton>
                          </List>
                        </Collapse>
                          {/* <Button
                            className="events-info-button"
                            startIcon={<EventIcon />}
                            onClick={() => handleGoing(index)}
                          >
                            Going ({event.goingCount})
                          </Button> */}
                          {event.hostId === userId && (
                            <>
                              <Button
                                className="events-info-button"
                                onClick={() => handleRemoveEvent(index)}
                              >
                                Delete
                              </Button>
                              <Button
                                className="events-info-button"
                                onClick={() => handleEditEvent(index)}
                              >
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
            <div style={{ textAlign: "center" }}>
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
                  label="Max Attendees"
                  name="maxAttendee"
                  value={newEvent.maxAttendee}
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
                <Button
                  className="events-info-button"
                  onClick={handleClose}
                  color="primary"
                >
                  Cancel
                </Button>
                <Button
                  className="events-info-button"
                  onClick={handleAddEvent}
                  color="primary"
                >
                  Add
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </Paper>
    </Container>
  );
};

export default Events;
