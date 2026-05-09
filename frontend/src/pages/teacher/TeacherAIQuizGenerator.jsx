import React, { useState } from "react";
import { FaRobot, FaMagic, FaTrash, FaPlus, FaSave, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { generateAIQuiz, createAdminQuiz } from "../../services/quizApi";

const TeacherAIQuizGenerator = () => {
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    difficulty: "medium",
    count: 5,
    questionType: "mcq",
  });

  const [quizInfo, setQuizInfo] = useState({
    title: "",
    duration: 300,
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuizInfoChange = (e) => {
    setQuizInfo({ ...quizInfo, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.topic) {
      return toast.error("Please fill subject and topic");
    }

    setLoading(true);
    try {
      const { data } = await generateAIQuiz(formData);
      if (data.success) {
        setQuestions(data.questions);
        setIsGenerated(true);
        toast.success("AI Generated Questions! 🚀");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "AI Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSaveQuiz = async (publish = false) => {
    if (!quizInfo.title || !formData.subject || questions.length === 0) {
      return toast.error("Quiz title, subject and questions are required");
    }

    try {
      const payload = {
        title: quizInfo.title,
        subject: formData.subject,
        duration: Number(quizInfo.duration),
        questions: questions,
        isActive: publish
      };

      const { data } = await createAdminQuiz(payload);
      if (data.success) {
        toast.success(publish ? "Quiz Published Successfully! 🎊" : "Quiz Saved Successfully! ✅");
        setIsGenerated(false);
        setQuestions([]);
        setQuizInfo({ title: "", duration: 300 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save quiz");
    }
  };

  return (
    <div className="min-h-screen bg-[#dfe6da] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#4f6f52] to-[#9caf88] text-white p-8 rounded-3xl shadow-2xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold flex items-center gap-3">
              <FaRobot className="animate-bounce" /> AI Quiz Generator
            </h1>
            <p className="mt-2 text-white/80 text-lg font-medium">
              Create professional quizzes in seconds using advanced AI.
            </p>
          </div>
          <div className="hidden md:block">
             <FaMagic className="text-6xl opacity-30 rotate-12" />
          </div>
        </div>

        {!isGenerated ? (
          /* GENERATOR FORM */
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-[#4f6f52] mb-6 border-b pb-4">Quiz Parameters</h2>
            <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="e.g., Science, Mathematics"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#4f6f52] rounded-2xl transition duration-200 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Topic</label>
                <input
                  type="text"
                  name="topic"
                  placeholder="e.g., Photosynthesis, Trigonometry"
                  value={formData.topic}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#4f6f52] rounded-2xl transition duration-200 outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#4f6f52] rounded-2xl transition duration-200 outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Number of Questions</label>
                <input
                  type="number"
                  name="count"
                  min="1"
                  max="20"
                  value={formData.count}
                  onChange={handleInputChange}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#4f6f52] rounded-2xl transition duration-200 outline-none"
                />
              </div>

              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#4f6f52] hover:bg-[#3d5742] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all flex justify-center items-center gap-3 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <FaMagic /> Generate Quiz Questions
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* REVIEW & EDIT SECTION */
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* QUIZ INFO HEADER */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Quiz Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter a title for this quiz"
                  value={quizInfo.title}
                  onChange={handleQuizInfoChange}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#4f6f52] rounded-2xl outline-none transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Duration (seconds)</label>
                <input
                  type="number"
                  name="duration"
                  value={quizInfo.duration}
                  onChange={handleQuizInfoChange}
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#4f6f52] rounded-2xl outline-none transition"
                />
              </div>
            </div>

            {/* QUESTIONS LIST */}
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                  <div className="bg-gray-50 px-8 py-4 flex justify-between items-center border-b">
                    <h3 className="font-bold text-[#4f6f52] uppercase tracking-widest text-sm">Question {qIndex + 1}</h3>
                    <button 
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-full"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase">Question Text</label>
                      <textarea
                        value={q.question}
                        onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#4f6f52] rounded-2xl outline-none transition resize-none"
                        rows="2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, optIndex) => (
                        <div key={optIndex} className="space-y-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">Option {optIndex + 1}</label>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                            className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-[#4f6f52] rounded-xl outline-none transition"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Correct Answer</label>
                        <select
                          value={q.correctOption}
                          onChange={(e) => handleQuestionChange(qIndex, "correctOption", e.target.value)}
                          className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#4f6f52] rounded-2xl outline-none transition font-medium text-[#4f6f52]"
                        >
                          {q.options.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-400 uppercase">Explanation</label>
                         <textarea
                          value={q.explanation}
                          onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)}
                          className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-[#4f6f52] rounded-2xl outline-none transition resize-none"
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => setIsGenerated(false)}
                className="flex-1 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition"
              >
                Back to Generator
              </button>
              <button
                onClick={() => handleSaveQuiz(false)}
                className="flex-1 py-4 bg-white border-2 border-[#4f6f52] text-[#4f6f52] hover:bg-[#4f6f52] hover:text-white font-bold rounded-2xl transition flex items-center justify-center gap-2"
              >
                <FaSave /> Save Draft
              </button>
              <button
                onClick={() => handleSaveQuiz(true)}
                className="flex-1 py-4 bg-[#4f6f52] hover:bg-[#3d5742] text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <FaPaperPlane /> Publish Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAIQuizGenerator;
