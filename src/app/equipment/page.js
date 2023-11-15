'use client'
import React, { useState } from 'react';
import { Container, Paper, Typography, Button, Grid, Box } from '@mui/material';
import { Pagination, PaginationItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../globals.css';

export default function Equipment() {
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  const [expandedEquipment, setExpandedEquipment] = useState(null);

  const equipmentData = [
    {
      id: 1,
      name: 'Treadmill',
      description: 'A cardio machine for running or walking indoors.',
      image: 'treadmill.jpg',
    },
    {
      id: 2,
      name: 'Elliptical Trainer',
      description: 'Low-impact machine for full-body workouts.',
      image: 'elliptical.jpg',
    },
    {
      id: 3,
      name: 'Stationary Bike',
      description: 'Great for cardiovascular workouts and leg strength.',
      image: 'stationary-bike.jpg',
    },
    {
      id: 4,
      name: 'Leg Press Machine',
      description: 'Strengthens leg muscles and glutes.',
      image: 'leg-press.jpg',
    },
    {
      id: 5,
      name: 'Chest Press Machine',
      description: 'Targets chest and triceps muscles.',
      image: 'chest-press.jpg',
    },
    {
      id: 6,
      name: 'Lat Pulldown Machine',
      description: 'Works the upper back and biceps.',
      image: 'lat-pulldown.jpg',
    },
  ];
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedEquipment = equipmentData.slice(startIndex, endIndex);

  const handleExpand = (equipment) => {
    setExpandedEquipment(equipment);
  };

  const handleShrink = () => {
    setExpandedEquipment(null);
  };

  
  return (
    <Container className="equipment-container">
      <Typography variant="h3" className="equipment-title">
      Equipment
      </Typography>
      <Paper>
        <Box className="grid-container">
          <Grid container spacing={2}>
            {displayedEquipment.map((equipment) => (
              <Grid item xs={12} sm={6} md={4} key={equipment.id}>
                {expandedEquipment && expandedEquipment.id === equipment.id ? (
                  <div className="equipment-expanded">
                    <Paper className="equipment-box" elevation={3}>
                      <img src={equipment.image} alt={equipment.name} className="equipment-image" />
                      <Typography variant="h6" className="equipment-name">
                        {equipment.name}
                      </Typography>
                      <Typography variant="body2" className="equipment-description">
                        {equipment.description}
                      </Typography>
                    </Paper>
                    <Button variant="outlined" className="equipment-button" onClick={handleShrink}>
                      Back
                    </Button>
                  </div>
                ) : (
                  <Paper
                    className="equipment-box"
                    elevation={3}
                    onClick={() => handleExpand(equipment)}
                  >
                    <img src={equipment.image} alt={equipment.name} className="equipment-image" />
                    <Typography variant="h6" className="equipment-name">
                      {equipment.name}
                    </Typography>
                    <Typography variant="body2" className="equipment-description">
                      {equipment.description}
                    </Typography>
                    
                  </Paper>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
        <div className="pagination-container">
          <Pagination
            count={Math.ceil(equipmentData.length / itemsPerPage)}
            page={page}
            onChange={handleChangePage}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </div>
      </Paper>
    </Container>
  );
}
