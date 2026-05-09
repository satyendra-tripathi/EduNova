import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;

const UploadContent = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    subject: "",
    title: "",
    type: "pdf",
    file: null,
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/forum/subjects`,
          { withCredentials: true }
        );
        setSubjects(res.data.subjects || []);
      } catch (err) {
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.subject || !form.title || !form.file) {
      return toast.error("All fields are required");
    }

    try {
      const formData = new FormData();
      formData.append("subject", form.subject);
      formData.append("title", form.title);
      formData.append("type", form.type);
      formData.append("file", form.file);

      await axios.post(
        `${API_URL}/forum/content/upload`,
        formData,
        { withCredentials: true }
      );

      toast.success("Content Uploaded Successfully");

      setForm({
        subject: "",
        title: "",
        type: "pdf",
        file: null,
      });

      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#dfe6da] px-4 md:px-8 py-6 mt-16">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#4f6f52] to-[#9caf88] text-white p-5 md:p-6 rounded-2xl shadow-xl mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Upload Content 📚</h1>
        <p className="text-white/90 text-sm md:text-base mt-1">
          Add PDF notes or video lectures
        </p>
      </div>

      {/* FORM CARD */}
      <div className="max-w-2xl mx-auto bg-white p-5 md:p-6 rounded-2xl shadow-xl border">

        {loading ? (
          <p className="text-center">Loading subjects...</p>
        ) : (
          <form onSubmit={submitHandler} className="space-y-4 md:space-y-5">

            {/* SUBJECT */}
            <div>
              <label className="text-sm font-medium">Subject</label>
              <select
                value={form.subject}
                onChange={(e) =>
                  setForm({ ...form, subject: e.target.value })
                }
                className="w-full p-3 border rounded-lg mt-1"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TITLE */}
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                className="w-full p-3 border rounded-lg mt-1"
                placeholder="Enter title"
              />
            </div>

            {/* TYPE */}
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value, file: null })
                }
                className="w-full p-3 border rounded-lg mt-1"
              >
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
              </select>
            </div>

            {/* FILE */}
            <div>
              <input
                ref={fileRef}
                type="file"
                accept={form.type === "pdf" ? "application/pdf" : "video/*"}
                onChange={(e) =>
                  setForm({ ...form, file: e.target.files[0] })
                }
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* BUTTON */}
            <button className="w-full bg-[#4f6f52] text-white py-3 rounded-xl hover:opacity-90 transition">
              Upload Content
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default UploadContent;