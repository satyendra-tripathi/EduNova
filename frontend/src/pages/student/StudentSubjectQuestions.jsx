import React, { useEffect, useState } from "react";
import { getAllQuestions, postAnswer } from "../../services/forumApi";
import { toast } from "react-toastify";

const StudentSubjectQuestions = ({ studentId }) => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await getAllQuestions();
      const allQuestions = res.data.questions;

      setQuestions(allQuestions);

      const uniqueSubjects = [...new Set(allQuestions.map((q) => q.subject))];
      setSubjects(uniqueSubjects);

      const submitted = allQuestions
        .filter((q) =>
          q.answers?.some(
            (a) =>
              (a.user?._id || a.user)?.toString() === studentId?.toString()
          )
        )
        .map((q) => q._id);

      setSubmittedQuestions(submitted);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (questionId) => {
    if (!answers[questionId]) {
      alert("Please select or write an answer ❌");
      return;
    }

    try {
      await postAnswer(questionId, { answer: answers[questionId] });

      toast.success("Answer Submitted");

      setSubmittedQuestions((prev) => [...prev, questionId]);

      setAnswers((prev) => {
        const newAns = { ...prev };
        delete newAns[questionId];
        return newAns;
      });
    } catch (err) {
      console.log(err);
      alert("Error submitting answer");
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.subject === selectedSubject &&
      !submittedQuestions.some((id) => id.toString() === q._id.toString()) &&
      new Date(q.createdAt).toDateString() === new Date().toDateString()
  );

  return (
    <div className="flex h-screen bg-[#dfe6da] pt-16 relative">

      {/* MOBILE BUTTON */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#758467] text-white px-3 py-2 rounded-lg"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-72 md:w-64
          bg-[#758467] text-white p-6 shadow-xl
          transition-transform duration-300 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <h2 className="font-bold text-2xl mb-6 border-b border-white/30 pb-2 mt-12 md:mt-0">
          Subjects
        </h2>

        <div className="space-y-3">
          {subjects.map((subj, i) => (
            <button
              key={i}
              className={`block w-full text-left p-3 rounded-lg transition ${
                selectedSubject === subj
                  ? "bg-[#9caf88] text-white"
                  : "hover:bg-[#9caf88]/70"
              }`}
              onClick={() => {
                setSelectedSubject(subj);
                setSidebarOpen(false);
              }}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full">

        <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#758467] border-b border-[#9caf88]/40 pb-2">
          {selectedSubject
            ? `Questions: ${selectedSubject}`
            : "Select a Subject"}
        </h2>

        {selectedSubject && filteredQuestions.length === 0 && (
          <p className="text-gray-600 mt-10 text-center text-lg">
            No new questions for today or all submitted ✅
          </p>
        )}

        {filteredQuestions.map((q) => (
          <div
            key={q._id}
            className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 hover:shadow-xl transition"
          >
            <p className="font-semibold text-lg mb-2">
              Question: {q.question}
            </p>

            <p className="text-gray-500 mb-4">
              Type: {q.type.toUpperCase()}
            </p>

            {q.type === "mcq" ? (
              <div className="space-y-3">

                {q.options.map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-sm md:text-base">
                    <input
                      type="radio"
                      name={q._id}
                      value={opt}
                      checked={answers[q._id] === opt}
                      onChange={(e) =>
                        handleAnswerChange(q._id, e.target.value)
                      }
                    />
                    <span>{opt}</span>
                  </label>
                ))}

                <button
                  onClick={() => handleSubmit(q._id)}
                  className="w-full md:w-auto bg-[#758467] hover:bg-[#9caf88] text-white px-5 py-2 rounded-lg transition"
                >
                  Submit Answer
                </button>

              </div>
            ) : (
              <div className="mt-2">

                <textarea
                  placeholder="Write your answer..."
                  className="w-full border border-[#9caf88]/40 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
                  value={answers[q._id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(q._id, e.target.value)
                  }
                />

                <button
                  onClick={() => handleSubmit(q._id)}
                  className="mt-3 w-full md:w-auto bg-[#758467] hover:bg-[#9caf88] text-white px-5 py-2 rounded-lg transition"
                >
                  Submit Answer
                </button>

              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
};

export default StudentSubjectQuestions;