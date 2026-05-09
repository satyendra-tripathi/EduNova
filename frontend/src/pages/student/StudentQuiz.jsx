import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [attemptId, setAttemptId] = useState(null);
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);

  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [title, setTitle] = useState("");

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/adminquiz/student-quizzes",
        { withCredentials: true }
      );
      if (res.data.success) setQuizzes(res.data.quizzes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const startQuizHandler = async () => {
    if (!selectedQuiz?._id) return;

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/adminquiz/start-student-quiz",
        { quizId: selectedQuiz._id },
        { withCredentials: true }
      );

      if (res.data.success) {
        setQuestion(res.data.question);
        setAttemptId(res.data.attemptId);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/adminquiz/submit-question",
        {
          attemptId,
          questionId: question._id,
          selectedOption,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setSelectedOption("");

        if (res.data.finished) {
          setFinished(true);
          setScore(res.data.score);
          setTitle(res.data.title);
        } else {
          setQuestion(res.data.nextQuestion);
        }
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedQuiz && !question && !finished) {
    return (
      <div className="min-h-screen bg-[#dfe6da] p-4 sm:p-6 pt-20 mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#4f6f52] mb-6">
          Available Quizzes
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {quizzes.length === 0 ? (
            <p className="text-gray-600">No quizzes available</p>
          ) : (
            quizzes.map((q) => (
              <div
                key={q._id}
                onClick={() => setSelectedQuiz(q)}
                className="bg-white rounded-2xl p-5 shadow-lg border border-[#9caf88] hover:scale-105 transition cursor-pointer"
              >
                <h3 className="text-lg sm:text-xl font-bold text-[#4f6f52]">
                  {q.title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  {q.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (selectedQuiz && !question && !finished) {
    return (
      <div className="min-h-screen bg-[#dfe6da] flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-[#9caf88] text-center w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4f6f52]">
            {selectedQuiz.title}
          </h2>

          <button
            onClick={startQuizHandler}
            className="mt-6 w-full bg-gradient-to-r from-[#4f6f52] to-[#9caf88] text-white px-6 py-3 rounded-xl"
          >
            Start Quiz
          </button>

          <button
            onClick={() => setSelectedQuiz(null)}
            className="block mt-4 text-sm text-gray-500 underline"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-[#dfe6da] flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-[#9caf88] text-center w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4f6f52]">
            Quiz Completed 🎉
          </h2>

          <p className="text-lg sm:text-xl mt-3">Score: {score}</p>
          <p className="text-gray-600 mt-1">{title}</p>

          <button
            onClick={() => {
              setFinished(false);
              setSelectedQuiz(null);
              setQuestion(null);
              setAttemptId(null);
              fetchQuizzes();
            }}
            className="mt-6 w-full bg-gradient-to-r from-[#4f6f52] to-[#9caf88] text-white px-6 py-3 rounded-xl"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#dfe6da] flex items-center justify-center p-4 pt-20">
      <div className="bg-white w-full max-w-2xl p-5 sm:p-8 rounded-2xl shadow-xl border border-[#9caf88]">

        <h2 className="text-lg sm:text-xl font-bold text-[#4f6f52] mb-6">
          {question?.question}
        </h2>

        <div className="space-y-3">
          {question?.options?.map((opt, i) => (
            <div
              key={i}
              onClick={() => setSelectedOption(opt)}
              className={`p-3 sm:p-4 rounded-xl border cursor-pointer text-sm sm:text-base ${
                selectedOption === opt
                  ? "bg-gradient-to-r from-[#4f6f52] to-[#9caf88] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-[#4f6f52] to-[#9caf88] text-white py-3 rounded-xl"
        >
          {loading ? "Submitting..." : "Next"}
        </button>

      </div>
    </div>
  );
};

export default StudentQuiz;