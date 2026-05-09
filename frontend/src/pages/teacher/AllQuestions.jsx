import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyQuestions, deleteQuestion, updateQuestion } from "../../services/forumApi";

const AllQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await getMyQuestions();
      setQuestions(res.data.questions);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteQuestion(id);
      fetchQuestions();
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (q) => {
    setEditingId(q._id);
    setEditedQuestion(q.question);
  };

  const handleUpdate = async (id) => {
    try {
      await updateQuestion(id, { question: editedQuestion });
      setEditingId(null);
      fetchQuestions();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#dfe6da] px-3 md:px-6 pt-20 pb-10">

      {/* TITLE / FILTER AREA SAFE SPACE */}
      <div className="sticky top-0 z-10 bg-[#dfe6da] pb-3">
        <h2 className="text-2xl md:text-3xl font-bold text-[#4f6f52] text-center">
          All Questions
        </h2>
      </div>

      {questions.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No questions found.</p>
      ) : (
        <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto mt-4">

          {questions.map((q) => (
            <div key={q._id} className="bg-white p-4 md:p-6 rounded-xl shadow-md">

              <p className="font-semibold text-[#4f6f52] text-sm md:text-base">
                Subject: {q.subject}
              </p>

              {editingId === q._id ? (
                <input
                  value={editedQuestion}
                  onChange={(e) => setEditedQuestion(e.target.value)}
                  className="w-full border p-2 mt-2 rounded"
                />
              ) : (
                <p className="mt-2 text-gray-800 text-sm md:text-base break-words">
                  <span className="font-semibold">Question:</span> {q.question}
                </p>
              )}

              <p className="mt-1 text-gray-700 text-sm">
                <span className="font-semibold">Type:</span> {q.type.toUpperCase()}
              </p>

              <p className="mt-2 text-xs md:text-sm text-gray-500">
                Added By: {q.user?.name || "Unknown"}
              </p>

              {/* BUTTONS */}
              <div className="mt-4 flex flex-wrap gap-2">

                {q.type === "long" && (
                  <button
                    onClick={() => navigate(`/check-answer/${q._id}`)}
                    className="bg-[#07332c] text-white px-3 py-2 rounded-lg text-sm"
                  >
                    Check Answers
                  </button>
                )}

                {editingId === q._id ? (
                  <button
                    onClick={() => handleUpdate(q._id)}
                    className="bg-[#bca879] text-black px-3 py-2 rounded-lg text-sm"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(q)}
                    className="bg-[#07332c] text-white px-3 py-2 rounded-lg text-sm"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleDelete(q._id)}
                  className="bg-[#bb0000] text-white px-3 py-2 rounded-lg text-sm"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default AllQuestions;