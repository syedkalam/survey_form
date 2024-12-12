"use client";
import { useState } from "react";

export default function AdminPage() {
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
      <h1>Admin Dashboard</h1>
      <div>
        <label>Start Date:</label>
        <input
          type="date"
          value={survey.startDate}
          onChange={(e) => setSurvey({ ...survey, startDate: e.target.value })}
        />
      </div>
      <div>
        <label>End Date:</label>
        <input
          type="date"
          value={survey.endDate}
          onChange={(e) => setSurvey({ ...survey, endDate: e.target.value })}
        />
      </div>
      <button onClick={handleAddQuestion}>Add Question</button>
      <ul>
        {survey.questions.map((q) => (
          <li key={q.id}>
            <span>{q.label}</span> {q.required && <strong>(Required)</strong>}
            <button onClick={() => handleEditQuestion(q)}>Edit</button>
            <button onClick={() => handleDeleteQuestion(q.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleSaveSurvey}>Save Survey</button>

      {modalData && (
        <div className="modal">
          <div className="modal-content">
            <h2>{modalData.id ? "Edit Question" : "Add Question"}</h2>
            <label>
              Label:
              <input
                type="text"
                value={modalData.label}
                onChange={(e) =>
                  setModalData({ ...modalData, label: e.target.value })
                }
              />
            </label>
            <label>
              Type:
              <select
                value={modalData.type}
                onChange={(e) =>
                  setModalData({ ...modalData, type: e.target.value })
                }
              >
                <option value="text">Text Input</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="checkbox">Checkbox</option>
                <option value="date">Date Picker</option>
              </select>
            </label>
            {modalData.type === "multiple-choice" && (
              <label>
                Options (comma-separated):
                <textarea
                  value={modalData.options.join(", ")}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      options: e.target.value.split(", "),
                    })
                  }
                />
              </label>
            )}
            <label>
              <input
                type="checkbox"
                checked={modalData.required}
                onChange={(e) =>
                  setModalData({ ...modalData, required: e.target.checked })
                }
              />
              Required
            </label>
            <button onClick={handleSaveQuestion}>Save</button>
            <button onClick={() => setModalData(null)}>Cancel</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          max-width: 500px;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
