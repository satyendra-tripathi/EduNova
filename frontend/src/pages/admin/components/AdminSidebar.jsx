import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaQuestionCircle,
  FaBook,
  FaClipboardList,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);

  const linkClass =
    "flex items-center gap-3 p-3 rounded-xl transition-all duration-300";

  const activeClass =
    "bg-gradient-to-r from-[#4f6f52] to-[#739072] text-white shadow-md";

  const inactiveClass =
    "text-gray-200 hover:bg-[#87a977] hover:text-white";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#4f6f52] text-white p-2 rounded-lg"
      >
        <FaBars />
      </button>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#4f6f52] to-[#2f3e34] p-5 shadow-2xl z-40 transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4 text-white text-xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold text-white mb-10 text-center tracking-wide">
          Admin Panel
        </h2>

        <nav className="space-y-3">

          <NavLink
            to="/admin-dashboard"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaTachometerAlt />
            Dashboard
          </NavLink>

          <NavLink
            to="/users"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaUsers />
            Users
          </NavLink>

          <NavLink
            to="/admin-questions"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaQuestionCircle />
            Questions
          </NavLink>

          <NavLink
            to="/admin-subjects"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaBook />
            Subjects
          </NavLink>

          <NavLink
            to="/student-answers"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaClipboardList />
            Student Answers
          </NavLink>

          <NavLink
            to="/admin-quizzes"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaQuestionCircle />
            Quizzes
          </NavLink>

        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;