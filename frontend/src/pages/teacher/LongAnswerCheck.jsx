import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { markLongAnswer, getMyQuestions, evaluateLongAnswerAI } from "../../services/forumApi";
import { toast } from "react-toastify";
import { Bot, CheckCircle, AlertCircle, Award, Brain, Search, BookOpen, Star, RefreshCw } from "lucide-react";

const LongAnswerCheck = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [marks, setMarks] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [aiLoadingId, setAiLoadingId] = useState(null);
  const [aiResults, setAiResults] = useState({});

  useEffect(() => {
    fetchMyQuestions();
  }, []);

  const fetchMyQuestions = async () => {
    try {
      const res = await getMyQuestions();
      setQuestions(res.data.questions);
    } catch (err) {
      toast.error("Failed to fetch questions");
    }
  };

  const handleMark = async (questionId, answerId) => {
    try {
      setLoadingId(answerId);
      await markLongAnswer(questionId, answerId, {
        marks: Number(marks[answerId]) || 0,
      });
      toast.success("Marks saved successfully");
      await fetchMyQuestions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving marks");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAiEvaluate = async (questionId, answerId) => {
    try {
      setAiLoadingId(answerId);
      const res = await evaluateLongAnswerAI(questionId, answerId);
      if (res.data.success) {
        setAiResults({ ...aiResults, [answerId]: res.data.aiEvaluation });
        toast.success("AI Evaluation completed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "AI Evaluation failed");
    } finally {
      setAiLoadingId(null);
    }
  };

  const useAiMarks = (answerId, score) => {
    setMarks({ ...marks, [answerId]: score });
    toast.info("AI Marks applied to input");
  };

  const subjects = [...new Set(questions.map((q) => q.subject))];

  const filteredQuestions = questions.filter(
    (q) =>
      q.type === "long" &&
      (id ? q._id === id : true) &&
      (selectedSubject ? q.subject === selectedSubject : true)
  );

  return (
    <div className="min-h-screen bg-[#f3f7f0] px-4 md:px-8 py-10 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-[#e2e8df] mb-8 flex flex-col md:flex-row gap-6 items-center justify-between transform transition-all hover:shadow-2xl">
          <div>
            <h2 className="text-3xl font-extrabold text-[#2d3e2f] flex items-center gap-3">
              <BookOpen className="text-[#4f6f52]" size={32} />
              AI Long Answer Evaluation
            </h2>
            <p className="text-gray-500 mt-1">Review and grade student submissions with AI assistance</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full md:w-64 appearance-none bg-[#f9fbf7] border border-[#cfd8cc] p-3 px-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9caf88] font-medium text-[#4f6f52]"
              >
                <option value="">All Subjects</option>
                {subjects.map((sub, i) => (
                  <option key={i} value={sub}>{sub}</option>
                ))}
              </select>
              <Search className="absolute left-3 top-3.5 text-[#9caf88]" size={20} />
            </div>

            <button
              onClick={() => setSelectedSubject("")}
              className="bg-white text-[#4f6f52] border-2 border-[#4f6f52] px-6 py-2.5 rounded-xl font-bold hover:bg-[#4f6f52] hover:text-white transition-all duration-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* QUESTIONS LIST */}
        <div className="space-y-8">
          {filteredQuestions.length === 0 ? (
            <div className="bg-white p-20 rounded-3xl shadow-sm text-center border border-dashed border-gray-300">
              <Award size={64} className="mx-auto text-gray-200 mb-4" />
              <p className="text-xl text-gray-400 font-medium italic">No long answer questions found for your account</p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q._id} className="bg-white rounded-3xl shadow-lg border border-[#e5e7e1] overflow-hidden">
                <div className="bg-[#f9fbf7] p-5 border-b border-[#e5e7e1] flex justify-between items-center">
                  <span className="bg-[#4f6f52] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {q.subject}
                  </span>
                  <span className="text-gray-400 text-xs font-medium">Created on {new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-800 leading-relaxed mb-6">
                    {q.question}
                  </h3>

                  <div className="space-y-6 mt-8">
                    <h4 className="text-sm font-bold text-[#4f6f52] uppercase tracking-wider flex items-center gap-2">
                      <Award size={16} /> Pending Submissions
                    </h4>

                    {q.answers.filter((a) => a.isEvaluated !== true).length === 0 ? (
                      <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-center gap-4">
                        <CheckCircle className="text-green-500" size={24} />
                        <p className="text-green-700 font-semibold">Great job! All answers for this question have been evaluated.</p>
                      </div>
                    ) : (
                      q.answers.filter((a) => a.isEvaluated !== true).map((ans) => (
                        <div key={ans._id} className="border border-[#e2e8df] rounded-2xl bg-white transition-all hover:border-[#9caf88] hover:shadow-md">
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#eef3eb] rounded-full flex items-center justify-center text-[#4f6f52] font-bold">
                                  {ans.user?.name?.charAt(0) || "S"}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-800">{ans.user?.name}</p>
                                  <p className="text-xs text-gray-400">Student</p>
                                </div>
                              </div>
                              <span className="text-xs text-gray-400">{new Date(ans.createdAt).toLocaleTimeString()}</span>
                            </div>

                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-gray-700 leading-relaxed mb-6 italic">
                              "{ans.answer}"
                            </div>

                            {/* AI RESULTS CARD */}
                            {(aiResults[ans._id] || ans.aiEvaluation?.evaluatedByAI) && (
                              <div className="mb-6 bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] p-6 rounded-2xl border border-blue-200 shadow-inner">
                                <div className="flex items-center justify-between mb-6">
                                  <h5 className="flex items-center gap-2 font-black text-blue-800 text-sm uppercase tracking-tighter">
                                    <Bot size={20} className="text-blue-600" /> AI Feedback Analysis
                                  </h5>
                                  <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full shadow-lg">
                                    <Award size={16} />
                                    <span className="font-black text-lg">{(aiResults[ans._id] || ans.aiEvaluation).score} / {(aiResults[ans._id] || ans.aiEvaluation).maxMarks}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Feedback</p>
                                      <p className="text-blue-900 text-sm font-medium">{(aiResults[ans._id] || ans.aiEvaluation).feedback}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Common Mistakes</p>
                                      <ul className="list-disc list-inside text-red-800 text-sm space-y-1">
                                        {(aiResults[ans._id] || ans.aiEvaluation).mistakes?.map((m, i) => (
                                          <li key={i}>{m}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div className="bg-white/50 p-4 rounded-xl border border-white">
                                      <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                                        <Star size={12} /> Suggested Improvement
                                      </p>
                                      <p className="text-gray-700 text-sm italic leading-relaxed">"{(aiResults[ans._id] || ans.aiEvaluation).improvedAnswer}"</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                      <div className="bg-white/40 p-2 rounded-lg text-center">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Difficulty</p>
                                        <p className="text-sm font-bold text-gray-700">{(aiResults[ans._id] || ans.aiEvaluation).difficulty}</p>
                                      </div>
                                      <div className="bg-white/40 p-2 rounded-lg text-center">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Concept Accuracy</p>
                                        <p className="text-sm font-bold text-gray-700">{(aiResults[ans._id] || ans.aiEvaluation).conceptAccuracy}%</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-blue-100 flex justify-between items-center">
                                   <div className="flex items-center gap-4">
                                      <div className="flex flex-col">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Grammar Score</span>
                                        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                                          <div className="h-full bg-blue-500" style={{width: `${(aiResults[ans._id] || ans.aiEvaluation).grammarScore}%`}}></div>
                                        </div>
                                      </div>
                                      {(aiResults[ans._id] || ans.aiEvaluation).plagiarismWarning !== "Low" && (
                                        <div className="flex items-center gap-1 text-orange-600 font-bold text-xs animate-pulse">
                                          <AlertCircle size={14} /> Plagiarism: {(aiResults[ans._id] || ans.aiEvaluation).plagiarismWarning}
                                        </div>
                                      )}
                                   </div>
                                   <button 
                                      onClick={() => useAiMarks(ans._id, (aiResults[ans._id] || ans.aiEvaluation).score)}
                                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                                    >
                                      <Award size={14} /> Apply AI Marks
                                    </button>
                                </div>
                              </div>
                            )}

                            <div className="flex flex-col md:flex-row items-center gap-4">
                              <div className="flex items-center gap-3 w-full md:w-auto">
                                <input
                                  type="number"
                                  placeholder="Marks"
                                  value={marks[ans._id] || ""}
                                  onChange={(e) => setMarks({ ...marks, [ans._id]: e.target.value })}
                                  className="w-full md:w-28 px-4 py-3 bg-[#f9fbf7] border border-[#cfd8cc] rounded-xl focus:ring-2 focus:ring-[#9caf88] focus:outline-none font-bold text-center"
                                />
                                <span className="text-gray-400 font-bold">/ {q.totalMarks || 5}</span>
                              </div>

                              <div className="flex gap-2 w-full md:w-auto">
                                <button
                                  onClick={() => handleAiEvaluate(q._id, ans._id)}
                                  disabled={aiLoadingId === ans._id}
                                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                  {aiLoadingId === ans._id ? <RefreshCw className="animate-spin" size={20} /> : <Brain size={20} />}
                                  {aiLoadingId === ans._id ? "AI Analyzing..." : "AI Evaluate"}
                                </button>

                                <button
                                  onClick={() => handleMark(q._id, ans._id)}
                                  disabled={loadingId === ans._id}
                                  className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#4f6f52] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#3f5a42] transition-all disabled:opacity-50"
                                >
                                  {loadingId === ans._id ? <RefreshCw className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                  {loadingId === ans._id ? "Saving..." : "Finalize Grade"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LongAnswerCheck;