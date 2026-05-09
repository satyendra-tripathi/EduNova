import React, { useState } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminQuizzes = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState(300);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", ""], correctOption: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔹 Add new question
  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", ""], correctOption: "" }]);
  };

  // 🔹 Remove question
  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  // 🔹 Handle question change
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  // 🔹 Handle option change
  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  // 🔹 Add option
  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  // 🔹 Remove option
  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    setQuestions(updated);
  };

  // 🔹 Submit quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    console.log("Submitting quiz:", { title, subject, duration, questions });

    // Validate quiz info
    if (!title.trim() || !subject.trim() || !duration || questions.length === 0) {
      setMessage("Please fill all required fields");
      setLoading(false);
      return;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim() || !q.correctOption.trim()) {
        setMessage(`Question ${i + 1} is incomplete`);
        setLoading(false);
        return;
      }

      // Filter out empty options (optional)
      const filteredOptions = q.options.filter((opt) => opt.trim() !== "");
      if (filteredOptions.length < 2) {
        setMessage(`Question ${i + 1} should have at least 2 options`);
        setLoading(false);
        return;
      }
      questions[i].options = filteredOptions; // replace with filtered
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/adminquiz/create-quiz",
        { title, subject, duration: Number(duration), questions },
        { withCredentials: true }
      );
      toast.success("Quiz created")
      setMessage("Quiz created successfully!");
      setTitle("");
      setSubject("");
      setDuration(300);
      setQuestions([{ question: "", options: ["", ""], correctOption: "" }]);
    } catch (err) {
      console.log("Axios error:", err.response?.data);
      setMessage(err.response?.data?.message || "Error creating quiz");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 bg-[#f6fff8] min-h-screen mt-15">
      <h1 className="text-3xl font-bold text-[#4f6f52] mb-6">Add New Quiz</h1>

      {message && <p className="mb-4 text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Quiz Info */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-[#4f6f52] rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-[#4f6f52] rounded px-3 py-2 w-full"
          />
          <input
            type="number"
            placeholder="Duration (seconds)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border border-[#4f6f52] rounded px-3 py-2 w-full"
          />
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="border border-[#4f6f52] rounded-xl p-4 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[#4f6f52]">Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Question text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                className="border border-[#4f6f52] rounded px-3 py-2 w-full mb-2"
              />

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder={`Option ${optIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                      className="border border-[#4f6f52] rounded px-3 py-2 w-full"
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, optIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="flex items-center gap-1 text-[#4f6f52] hover:text-[#4f6f52]"
                >
                  <FaPlus /> Add Option
                </button>
              </div>

              <input
                type="text"
                placeholder="Correct Option"
                value={q.correctOption}
                onChange={(e) => handleQuestionChange(qIndex, "correctOption", e.target.value)}
                className="border border-[#4f6f52] rounded px-3 py-2 w-full mt-2"
              />
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-1 bg-neutral-700 hover:bg-amber-950 text-white px-4 py-2 rounded"
        >
          <FaPlus /> Add Question
        </button>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#4f6f52] hover:bg-[#3d5742] text-white px-6 py-2 rounded mt-4"
          >
            {loading ? "Creating..." : "Create Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminQuizzes;