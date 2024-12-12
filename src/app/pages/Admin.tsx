"use client";
import { useState } from "react";
import {
  Button,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Box,
  Modal,
} from "@mui/material";

export default function Admin() {
  const [survey, setSurvey] = useState({
    startDate: "",
    endDate: "",
    questions: [],
  });
  const [modalData, setModalData] = useState(null); // For modal data (add/edit question)

  const handleAddQuestion = () => {
    setModalData({
      id: null,
      type: "text",
      label: "",
      options: [],
      required: false,
    });
  };

  const handleEditQuestion = (question) => {
    setModalData({ ...question });
  };

  const handleSaveQuestion = () => {
    if (modalData.id === null) {
      // Adding a new question
      const newQuestion = { ...modalData, id: Date.now() };
      setSurvey({ ...survey, questions: [...survey.questions, newQuestion] });
    } else {
      // Editing an existing question
      const updatedQuestions = survey.questions.map((q) =>
        q.id === modalData.id ? modalData : q
      );
      setSurvey({ ...survey, questions: updatedQuestions });
    }
    setModalData(null); // Close modal
  };

  const handleDeleteQuestion = (id) => {
    const updatedQuestions = survey.questions.filter((q) => q.id !== id);
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleSaveSurvey = async () => {
    try {
      const formData = new FormData();
      formData.append("startDate", survey.startDate);
      formData.append("endDate", survey.endDate);
      formData.append("questions", JSON.stringify(survey.questions)); // Convert questions to JSON string

      const response = await fetch(
        "https://wholphintech.com/survey_form/survey_api.php",
        {
          method: "POST",
          body: formData, // Send FormData instead of JSON
        }
      );

      if (response.ok) {
        const result = await response.json();
        alert("Survey saved successfully!");
        console.log(result);
      } else {
        alert("Failed to save survey.");
      }
    } catch (error) {
      console.error("Error saving survey:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div>
      <Box mb={2}>
        <Typography variant="h6">Start Date:</Typography>
        <TextField
          type="date"
          fullWidth
          value={survey.startDate}
          onChange={(e) => setSurvey({ ...survey, startDate: e.target.value })}
        />
      </Box>
      <Box mb={2}>
        <Typography variant="h6">End Date:</Typography>
        <TextField
          type="date"
          fullWidth
          value={survey.endDate}
          onChange={(e) => setSurvey({ ...survey, endDate: e.target.value })}
        />
      </Box>
      <Button variant="contained" color="primary" onClick={handleAddQuestion}>
        Add Question
      </Button>
      <ul>
        {survey.questions.map((q) => (
          <li key={q.id}>
            <Typography>{q.label}</Typography>
            {q.required && <strong>(Required)</strong>}
            <Button onClick={() => handleEditQuestion(q)}>Edit</Button>
            <Button onClick={() => handleDeleteQuestion(q.id)}>Delete</Button>
          </li>
        ))}
      </ul>
      <Button variant="contained" color="success" onClick={handleSaveSurvey}>
        Save Survey
      </Button>

      {modalData && (
        <Modal open={!!modalData} onClose={() => setModalData(null)}>
          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 1,
              width: 400,
              margin: "auto",
              marginTop: "10%",
            }}
          >
            <Typography variant="h6">
              {modalData.id ? "Edit Question" : "Add Question"}
            </Typography>
            <Box mb={2}>
              <TextField
                label="Label"
                fullWidth
                value={modalData.label}
                onChange={(e) =>
                  setModalData({ ...modalData, label: e.target.value })
                }
              />
            </Box>
            <Box mb={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={modalData.type}
                  onChange={(e) =>
                    setModalData({ ...modalData, type: e.target.value })
                  }
                >
                  <MenuItem value="text">Text Input</MenuItem>
                  <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                  <MenuItem value="checkbox">Checkbox</MenuItem>
                  <MenuItem value="date">Date Picker</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {modalData.type === "multiple-choice" && (
              <Box mb={2}>
                <TextField
                  label="Options (comma-separated)"
                  multiline
                  rows={2}
                  fullWidth
                  value={modalData.options.join(", ")}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      options: e.target.value.split(", "),
                    })
                  }
                />
              </Box>
            )}
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={modalData.required}
                    onChange={(e) =>
                      setModalData({ ...modalData, required: e.target.checked })
                    }
                  />
                }
                label="Required"
              />
            </FormGroup>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveQuestion}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setModalData(null)}
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
}
