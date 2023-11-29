'use client'
import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, Button, Grid, Box } from '@mui/material';
import { Pagination, PaginationItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import '../globals.css';

export default function Equipment() {
  const itemsPerPage = 6;
  const [page, setPage] = useState(1);
  const [expandedEquipment, setExpandedEquipment] = useState(null);
  const [equipmentData, setEquipmentData] = useState([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("/api/equipment", {
          method: "GET"
        });
        const data = await response.json();
        console.log("equipment data", data);
        setEquipmentData(data);
      } catch (error) {
        console.error("Failed to fetch equipment:", error);
      }
    };
    fetchEquipment();
  }, []);
  

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
                      <img src={equipment.image_path} alt={equipment.name} className="equipment-image" />
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
                    <img src={equipment.image_path} alt={equipment.name} className="equipment-image" />
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
