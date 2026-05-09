import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;

const CreateSubject = () => {
  const [name, setName] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/forum/subject/create`,
        { name },
        { withCredentials: true }
      );

      toast.success("Subject created");
      setName("");
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#dfe6da] flex items-center justify-center px-4 mt-16">

      <div className="w-full max-w-md bg-white p-6 md:p-8 rounded-2xl shadow-lg">

        <h2 className="text-xl md:text-2xl font-bold text-[#4f6f52] mb-6 text-center">
          Create Subject
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Subject Name"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f6f52]"
          />

          <button
            className="w-full bg-[#4f6f52] hover:bg-[#3e5a42] text-white px-4 py-3 rounded-lg transition font-medium"
          >
            Create Subject
          </button>

        </form>

      </div>
    </div>
  );
};

export default CreateSubject;