import React, { useEffect, useState } from "react";
import { getAllQuestions, postAnswer } from "../../services/forumApi";
import { toast } from "react-toastify";

const ViewQuestions = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    getAllQuestions().then((res) =>
      setQuestions(res.data.questions)
    );
  }, []);

  const submitAnswer = async (id, answer) => {
    try {
      await postAnswer(id, { answer });
      toast.success("Answer Submitted");
    } catch (err) {
      toast.error("Error submitting answer");
    }
  };

  return (
    <div className="min-h-screen bg-[#dfe6da] p-4 md:p-6 pt-20">

      <h2 className="text-xl md:text-2xl font-bold mb-6 text-[#4f6f52]">
        Questions
      </h2>

      <div className="space-y-4">

        {questions.map((q) => (
          <div
            key={q._id}
            className="bg-white border border-[#9caf88] rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition"
          >

            <h3 className="font-semibold text-base md:text-lg">
              {q.question}
            </h3>

            <p className="text-xs md:text-sm text-gray-500 mt-1">
              {q.subject}
            </p>

            {/* MCQ */}
            {q.type === "mcq" ? (
              <div className="mt-4 space-y-2">

                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => submitAnswer(q._id, opt)}
                    className="w-full text-left border rounded-lg p-2 md:p-3 hover:bg-[#9caf88] hover:text-white transition text-sm md:text-base"
                  >
                    {opt}
                  </button>
                ))}

              </div>
            ) : (
              <textarea
                className="w-full mt-4 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#9caf88] text-sm md:text-base"
                placeholder="Write Answer..."
                onBlur={(e) => submitAnswer(q._id, e.target.value)}
              />
            )}

          </div>
        ))}

      </div>
    </div>
  );
};

export default ViewQuestions;