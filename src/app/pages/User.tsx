import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";

const User = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Fetch surveys from the API
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(
          "https://wholphintech.com/survey_form/get_open_survey.php"
        );
        const data = await response.json();
        setSurveys(data?.data);
      } catch (error) {
        console.error("Failed to fetch surveys:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const handleBeginClick = (survey) => {
    setSelectedSurvey(survey);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedSurvey(null);
    setPhoneNumber("");
  };

  const handleSubmit = () => {
    if (phoneNumber) {
      console.log(`Survey: ${selectedSurvey?.title}, Phone: ${phoneNumber}`);
      handleDialogClose();
      alert("Phone number submitted!");
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          Available Surveys
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <List>
            {surveys?.map((survey) => (
              <ListItem key={survey.id} divider>
                <ListItemText
                  primary={survey.title}
                  secondary={survey.description}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBeginClick(survey)}
                >
                  Begin
                </Button>
              </ListItem>
            ))}
          </List>
        )}

        {/* Dialog for Phone Number */}
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Enter Your Phone Number</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Phone Number"
              type="tel"
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default User;
