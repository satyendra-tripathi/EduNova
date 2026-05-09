import React, { useState } from "react";
import { postQuestion } from "../../services/forumApi";
import { toast } from "react-toastify";

const AddQuestion = () => {
  const [form, setForm] = useState({
    question: "",
    subject: "",
    type: "mcq",
    options: ["", "", "", ""],
    correctOption: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postQuestion(form);
      toast.success("Question Added ✅");
      setForm({
        question: "",
        subject: "",
        type: "mcq",
        options: ["", "", "", ""],
        correctOption: ""
      });
    } catch (err) {
      alert("Error adding question ❌");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#dfe6da] px-4 ">

      <form
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl space-y-5 mt-25"
        onSubmit={handleSubmit}
      >

        <h2 className="text-3xl font-bold text-[#4f6f52] text-center mb-4">
          Add New Question
        </h2>

       {/* Subject */}
<div className="flex flex-col">
  <label className="mb-1 font-semibold text-gray-700">Subject</label>
  <select
    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
    value={form.subject}
    onChange={(e) => setForm({ ...form, subject: e.target.value })}
    required
  >
    <option value="">Select Subject</option>
    <option value="Math">Math</option>
    <option value="Science">Science</option>
    <option value="English">English</option>
  </select>
</div>

        {/* Question */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Question</label>
          <textarea
            placeholder="Enter Question"
            className="border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            required
          />
        </div>

        {/* Type */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Type</label>
          <select
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="mcq">MCQ</option>
            <option value="long">Long Answer</option>
          </select>
        </div>

        {/* Options */}
        {form.type === "mcq" &&
          form.options.map((opt, i) => (
            <div key={i} className="flex flex-col">
              <label className="mb-1 font-semibold text-gray-700">
                Option {i + 1}
              </label>
              <input
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
                placeholder={`Option ${i + 1}`}
                value={form.options[i]}
                onChange={(e) => {
                  const ops = [...form.options];
                  ops[i] = e.target.value;
                  setForm({ ...form, options: ops });
                }}
                required
              />
            </div>
          ))}

        {/* Correct Option */}
        {form.type === "mcq" && (
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-gray-700">
              Correct Option
            </label>
            <input
              className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
              placeholder="Enter Correct Option"
              value={form.correctOption}
              onChange={(e) =>
                setForm({ ...form, correctOption: e.target.value })
              }
              required
            />
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#9caf88] hover:bg-[#87a977] text-white font-semibold py-3 rounded-lg transition"
        >
          Submit Question
        </button>

      </form>
    </div>
  );
};

export default AddQuestion;