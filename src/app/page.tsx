"use client";
import { useState } from "react";
import { Box, Tab, Tabs, Typography, Grid, Paper } from "@mui/material";
import Admin from "./pages/Admin";
import User from "./pages/User";

export default function Home() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", padding: 2 }}>
      <Tabs value={tabValue} onChange={handleTabChange} centered>
        <Tab label="Admin View" />
        <Tab label="User View" />
      </Tabs>

      <Box sx={{ marginTop: 2 }}>
        {tabValue === 0 && <AdminView />}
        {tabValue === 1 && <UserView />}
      </Box>
    </Box>
  );
}

const AdminView = () => (
  <Paper elevation={3} sx={{ padding: 2 }}>
    <Typography variant="h5" gutterBottom>
      Admin Dashboard
    </Typography>
    <Admin></Admin>
  </Paper>
);

const UserView = () => (
  <Paper elevation={3} sx={{ padding: 2 }}>
    <Typography variant="h5" gutterBottom>
      User Dashboard
    </Typography>
    <User> </User>
  </Paper>
);
