import React, { useEffect, useState } from "react";
import { Stack } from "@mui/system";
import { Paper, Box, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import {
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  Avatar,
  InputLabel,
  NativeSelect,
} from "@mui/material";



export default function FilterFriends({ friendList, handleFriendRequest }) {
  console.log("friendList", friendList);
  return (
    <Box sx={{ width: "80%" }}>
      <Stack
        spacing={2}
        sx={{
          width: "100%",
          maxHeight: 500,
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          {friendList.map((User) => (
            <Paper
              key={User.id}
              sx={{
                textAlign: "left",
                // margin: ""
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: "0 20px",
                }}
              >
                <Typography
                  style={{ display: "flex", alignItems: "center", height: 70 }}
                >
                <Button href={`/profile/${User.id}`} style={{textTransform: 'none'}}>
                  <Avatar
                    alt="Profile"
                    src={User.ProfileImage}
                    sx={{ width: 40, height: 40, marginRight: 2 }}
                  />
                  {User.name}
                  </Button>
                </Typography>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "35%",
                  }}
                >
                  <Typography
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: 70,
                    }}
                  >
                    {/* <IconButton
                      color="primary"
                      aria-label="add to shopping cart"
                    >
                      <AddIcon />
                    </IconButton> */}
                    {User.friendshipStatus === "NONE" ? (<Button
                      className="events-info-button"
                      onClick={() => handleFriendRequest(User.id)}
                    >
                      Send Request
                    </Button>) : User.friendshipStatus}
                  </Typography>
                  <Typography
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: 70,
                    }}
                  >
                    {User.status}
                  </Typography>
                </div>
              </div>
            </Paper>
          ))}
        </div>
      </Stack>
    </Box>
  );
}
