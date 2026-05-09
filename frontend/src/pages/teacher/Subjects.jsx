import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
const API_URL = import.meta.env.VITE_API_URL;

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/forum/subjects`,
        { withCredentials: true }
      );
      setSubjects(data.subjects || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name) return toast.error("Subject name required");

    try {
      await axios.post(
        `${API_URL}/forum/subject/create`,
        { name },
        { withCredentials: true }
      );

      toast.success("Subject created");
      setName("");
      fetchSubjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/forum/subject/${id}`,
        { withCredentials: true }
      );

      toast.success("Subject deleted");
      setSubjects((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#dfe6da] px-3 md:px-6 py-6 mt-16">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#4f6f52] via-[#6f8f6a] to-[#9caf88] text-white p-5 md:p-6 rounded-2xl shadow-xl mb-6">
        <h2 className="text-xl md:text-2xl font-bold">
          Manage Subjects 📚
        </h2>
        <p className="text-white/90 text-sm md:text-base">
          Create and manage your teaching subjects
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* CREATE CARD */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-xl border">

          <h2 className="text-lg md:text-xl font-bold text-[#4f6f52] mb-4">
            Create Subject
          </h2>

          <form onSubmit={submitHandler} className="space-y-4">

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subject name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f6f52]"
            />

            <button className="w-full bg-gradient-to-r from-[#4f6f52] to-[#9caf88] text-white py-3 rounded-lg font-semibold active:scale-95 transition">
              Create Subject
            </button>

          </form>
        </div>

        {/* SUBJECT LIST */}
        <div className="bg-white p-5 md:p-6 rounded-2xl shadow-xl border">

          <h2 className="text-lg md:text-xl font-bold text-[#4f6f52] mb-4">
            My Subjects
          </h2>

          <div className="space-y-3 max-h-[350px] md:max-h-[400px] overflow-auto pr-1">

            {subjects.map((sub) => (
              <div
                key={sub._id}
                className="flex items-center justify-between p-3 md:p-4 rounded-xl border bg-gradient-to-r from-[#f7faf7] to-[#eef3ee] hover:shadow-md transition"
              >

                <h3 className="font-semibold text-[#2f4f3a] text-sm md:text-base">
                  {sub.name}
                </h3>

                <MdDelete
                  size={22}
                  className="text-red-600 cursor-pointer hover:scale-110 transition"
                  onClick={() => deleteSubject(sub._id)}
                />

              </div>
            ))}

            {subjects.length === 0 && (
              <p className="text-gray-500 text-sm">
                No subjects found
              </p>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Subjects;