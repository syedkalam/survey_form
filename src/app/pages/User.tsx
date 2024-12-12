"use Client";
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
  Checkbox,
  RadioGroup,
  Radio,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const User = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [answers, setAnswers] = useState({});

  // Fetch surveys from the API
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(
          "https://wholphintech.com/survey_form/get_open_survey.php"
        );
        const data = await response.json();
        setSurveys(data.data);
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
    setPhoneDialogOpen(true);
  };

  const handlePhoneDialogClose = () => {
    setPhoneDialogOpen(false);
    setSelectedSurvey(null);
    setPhoneNumber("");
  };

  const handlePhoneSubmit = () => {
    if (phoneNumber) {
      setPhoneDialogOpen(false);
      setQuestionDialogOpen(true);
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  const handleQuestionDialogClose = () => {
    setQuestionDialogOpen(false);
    setSelectedSurvey(null);
    setAnswers({});
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleQuestionSubmit = async () => {
    try {
      const payload = new URLSearchParams();
      payload.append("surveyId", selectedSurvey.id);
      payload.append("phoneNumber", phoneNumber);
      payload.append("answers", JSON.stringify(answers));

      const response = await fetch(
        "https://wholphintech.com/survey_form/save_survey.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: payload.toString(),
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("Survey submitted successfully!");
      } else {
        alert("Failed to submit survey.");
      }
      handleQuestionDialogClose();
    } catch (error) {
      console.error("Failed to submit survey:", error);
      alert("Failed to submit survey.");
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
            {surveys.map((survey) => (
              <ListItem key={survey.id} divider>
                <ListItemText
                  primary={`Survey #${survey.id}`}
                  secondary={`Start: ${survey.start_date}, End: ${survey.end_date}`}
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
        <Dialog open={phoneDialogOpen} onClose={handlePhoneDialogClose}>
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
            <Button onClick={handlePhoneDialogClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handlePhoneSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for Survey Questions */}
        {selectedSurvey && (
          <Dialog open={questionDialogOpen} onClose={handleQuestionDialogClose}>
            <DialogTitle>Survey Questions</DialogTitle>
            <DialogContent>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {JSON.parse(selectedSurvey.questions).map((question) => (
                  <Box key={question.id} py={2}>
                    <Typography>{question.label}</Typography>
                    {question.type === "text" && (
                      <TextField
                        fullWidth
                        margin="dense"
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                      />
                    )}
                    {question.type === "multiple-choice" && (
                      <Box>
                        {question.options[0].split(",").map((option, index) => (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                checked={
                                  answers[question.id]?.includes(option) ||
                                  false
                                }
                                onChange={(e) => {
                                  const value = answers[question.id] || [];
                                  handleAnswerChange(
                                    question.id,
                                    e.target.checked
                                      ? [...value, option]
                                      : value.filter((opt) => opt !== option)
                                  );
                                }}
                              />
                            }
                            label={option}
                          />
                        ))}
                      </Box>
                    )}
                    {question.type === "date" && (
                      <DesktopDatePicker
                        inputFormat="MM/DD/YYYY"
                        value={answers[question.id] || dayjs()}
                        onChange={(date) =>
                          handleAnswerChange(question.id, date)
                        }
                        renderInput={(params) => (
                          <TextField fullWidth margin="dense" {...params} />
                        )}
                      />
                    )}
                    {question.type === "checkbox" && (
                      <RadioGroup
                        value={answers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                      >
                        <FormControlLabel
                          value="Yes"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    )}
                  </Box>
                ))}
              </LocalizationProvider>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleQuestionDialogClose} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleQuestionSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Container>
  );
};

export default User;
