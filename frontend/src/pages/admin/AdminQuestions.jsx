import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";

const AdminQuestions = () => {
  const API_BASE = "http://localhost:4000/api/v1/admin";

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_BASE}/questions?keyword=${keyword}&page=${page}`,
        { withCredentials: true }
      );

      setQuestions(data.questions);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchQuestions();
    }, 500);

    return () => clearTimeout(delay);
  }, [page, keyword]);

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/questions/${deleteId}`, {
        withCredentials: true,
      });
      setDeleteId(null);
      fetchQuestions();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmEdit = async () => {
    try {
      await axios.put(
        `${API_BASE}/questions/${editData._id}`,
        { question: newQuestion },
        { withCredentials: true }
      );
      setEditData(null);
      setNewQuestion("");
      fetchQuestions();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-4 sm:p-6 bg-[#f6fff8] min-h-screen mt-15">

      {/* TITLE */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#4f6f52] mb-6">
        Admin Questions
      </h1>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search question..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border border-[#4f6f52] px-3 py-2 rounded w-full sm:w-1/3"
        />
      </div>

      {/* TABLE WRAPPER (IMPORTANT FOR MOBILE SCROLL) */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">

        <table className="w-full min-w-[600px] border border-[#4f6f52]">

          <thead>
            <tr className="bg-gradient-to-r from-[#4f6f52] to-[#739072] text-white">
              <th className="p-3 border text-left">Question</th>
              <th className="p-3 border text-center">Created By</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((q) => (
              <tr key={q._id} className="hover:bg-[#e8f5e9]">

                <td className="p-3 border text-sm sm:text-base">
                  {q.question}
                </td>

                <td className="p-3 border text-center text-sm sm:text-base">
                  {q.user?.name || q.user?.[0]?.name || "N/A"}
                </td>

                {/* ACTIONS STACK ON MOBILE */}
                <td className="p-3 border">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">

                    <button
                      onClick={() => {
                        setEditData(q);
                        setNewQuestion(q.question);
                      }}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => setDeleteId(q._id)}
                      className="text-red-600"
                    >
                      <FaTrash />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg w-full max-w-sm">

            <p className="mb-4 text-sm sm:text-base">
              Are you sure you want to delete?
            </p>

            <div className="flex gap-3 justify-end">

              <button
                onClick={() => setDeleteId(null)}
                className="px-3 py-2 border rounded text-sm"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-3 py-2 bg-red-600 text-white rounded text-sm"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

      {/* EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-lg w-full max-w-md">

            <h2 className="mb-3 font-semibold">Edit Question</h2>

            <input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="border w-full p-2 mb-4 rounded"
            />

            <div className="flex gap-3 justify-end">

              <button
                onClick={() => setEditData(null)}
                className="px-3 py-2 border rounded text-sm"
              >
                Cancel
              </button>

              <button
                onClick={confirmEdit}
                className="px-3 py-2 bg-green-600 text-white rounded text-sm"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminQuestions;