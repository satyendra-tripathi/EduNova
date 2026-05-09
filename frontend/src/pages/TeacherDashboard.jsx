import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaPlus,
  FaFileAlt,
  FaTrophy,
  FaChartBar,
  FaRobot,
  FaUsers,
  FaQuestionCircle,
  FaCheckCircle,
} from "react-icons/fa";

const TeacherDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-lg transition font-medium
    ${isActive ? "bg-white text-[#4f6f52] shadow" : "hover:bg-[#87a977]"}`;

  return (
    <div className="flex mt-16 min-h-screen bg-[#dfe6da]">

    {/* SIDEBAR */}
<div className="w-64 min-h-screen p-6 text-white shadow-2xl
  bg-gradient-to-b from-[#4f6f52] via-[#6f8f6a] to-[#9caf88]">

  <h2 className="text-2xl font-bold mb-8 tracking-wide">
    Teacher Panel
  </h2>

  <div className="space-y-3">

    <NavLink
      to="/add-question"
      className={linkClass}
    >
      <FaPlus /> Add Question
    </NavLink>

    <NavLink
      to="/questions"
      className={linkClass}
    >
      <FaFileAlt /> All Questions
    </NavLink>

    <NavLink
      to="/teacher/leaderboard"
      className={linkClass}
    >
      <FaTrophy /> Overall Leaderboard
    </NavLink>

    <NavLink
      to="/teacher/leaderboard/subject"
      className={linkClass}
    >
      <FaChartBar /> Subject Leaderboard
    </NavLink>

    <NavLink
      to="/teacher/ai-quiz-generator"
      className={linkClass}
    >
      <FaRobot /> AI Quiz Generator
    </NavLink>

    <NavLink
      to="/ai-section"
      className={linkClass}
    >
      <FaRobot /> AI Chat Section
    </NavLink>
   
<NavLink to="/subjects" className={linkClass}>
  <FaFileAlt /> Subjects
</NavLink>

<NavLink to="/upload-content" className={linkClass}>
  <FaRobot /> Upload Content
</NavLink>
<NavLink to="/subjects-content" className={linkClass}>
  <FaFileAlt /> Subject Content
</NavLink>

  </div>
</div>
      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">

        {/* HERO CARD */}
        <div className="bg-gradient-to-r from-[#4f6f52] to-[#9caf88] text-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold">
            Welcome back, {user.name} Sir👋
          </h1>
          <p className="mt-2 text-white/90">
            Manage your classes, evaluate answers, and track student performance.
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          <div className="bg-white p-6 rounded-2xl shadow border">
            <FaQuestionCircle className="text-[#4f6f52] text-2xl" />
            <h3 className="text-xl font-bold mt-2">Questions</h3>
            <p className="text-gray-500">Manage all posted questions</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border">
            <FaUsers className="text-[#4f6f52] text-2xl" />
            <h3 className="text-xl font-bold mt-2">Students</h3>
            <p className="text-gray-500">Active learners in system</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border">
            <FaCheckCircle className="text-[#4f6f52] text-2xl" />
            <h3 className="text-xl font-bold mt-2">Evaluations</h3>
            <p className="text-gray-500">Pending & completed answers</p>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <h2 className="text-xl font-bold text-[#4f6f52] mt-8 mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <NavLink
            to="/add-question"
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border"
          >
            <FaPlus className="text-[#4f6f52] text-xl" />
            <h3 className="font-bold mt-2">Add Question</h3>
          </NavLink>

          <NavLink
            to="/teacher/ai-quiz-generator"
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border"
          >
            <FaRobot className="text-[#4f6f52] text-xl" />
            <h3 className="font-bold mt-2">AI Quiz Generator</h3>
          </NavLink>

          <NavLink
            to="/questions"
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border"
          >
            <FaFileAlt className="text-[#4f6f52] text-xl" />
            <h3 className="font-bold mt-2">Review Answers</h3>
          </NavLink>

          <NavLink
            to="/teacher/leaderboard"
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border"
          >
            <FaTrophy className="text-[#4f6f52] text-xl" />
            <h3 className="font-bold mt-2">Leaderboard</h3>
          </NavLink>

        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;