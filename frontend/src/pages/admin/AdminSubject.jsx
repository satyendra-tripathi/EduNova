import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const AdminSubject = () => {
  const API_BASE = `${API_URL}/admin`;

  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/subjects`, {
        withCredentials: true,
      });
      setSubjects(data.subjects);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    try {
      await axios.post(
        `${API_BASE}/subjects`,
        { name },
        { withCredentials: true }
      );

      setName("");
      fetchSubjects();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/subjects/${deleteId}`, {
        withCredentials: true,
      });
      setDeleteId(null);
      fetchSubjects();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading)
    return <p className="p-6 text-[#4f6f52]">Loading subjects...</p>;

  return (
    <div className="p-6 bg-[#f6fff8] min-h-screen mt-15">
      <h1 className="text-3xl font-bold text-[#4f6f52] mb-6">
        Manage Subjects
      </h1>

      <form onSubmit={handleAdd} className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter subject name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-[#4f6f52] px-3 py-2 rounded w-1/3"
        />

        <button
          type="submit"
          className="bg-[#4f6f52] text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      <div className="overflow-x-auto border border-[#4f6f52] rounded-xl shadow-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-[#4f6f52] to-[#739072] text-white">
              <th className="p-3 text-left">Subject Name</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {subjects.length > 0 ? (
              subjects.map((sub, index) => (
                <tr
                  key={sub._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-[#f1f8f4]"
                  } hover:bg-[#e8f5e9]`}
                >
                  <td className="p-3">{sub.name}</td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => setDeleteId(sub._id)}
                      className="bg-red-100 p-2 rounded-full"
                    >
                      <FaTrash className="text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center p-4 text-gray-500">
                  No subjects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="mb-4">Delete this subject?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubject;