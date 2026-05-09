import React from "react";
import { useSelector } from "react-redux";
import {
  FaUsers,
  FaQuestionCircle,
  FaBook,
  FaChartLine,
  FaTrophy,
  FaCogs,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const cards = [
    {
      title: "Manage Users",
      icon: <FaUsers />,
      desc: "View, update roles and manage all platform users.",
    },
    {
      title: "Manage Questions",
      icon: <FaQuestionCircle />,
      desc: "Create, update and organize quiz questions easily.",
    },
    {
      title: "Manage Subjects",
      icon: <FaBook />,
      desc: "Structure subjects for better learning flow.",
    },
    // {
    //   title: "Analytics",
    //   icon: <FaChartLine />,
    //   desc: "Track growth, performance and engagement.",
    // },
    {
      title: "System Control",
      icon: <FaCogs />,
      desc: "Full access to manage system settings.",
    },
  ];

  return (
    <div className="p-8 bg-[#f6fff8] min-h-screen mt-15">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#4f6f52] to-[#739072] text-white p-8 rounded-3xl shadow-xl mb-10">
        <h1 className="text-4xl font-extrabold">
          Welcome, {user?.name || "Admin"}
        </h1>
        <p className="mt-2 text-lg opacity-90">
          Manage your platform efficiently with full control.
        </p>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-6 text-[#2f3e34]">
        Admin Controls
      </h2>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {cards.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-[#e0ece4]"
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-4 mb-4">
              
              {/* Icon Circle */}
              <div className="p-3 bg-[#e6f0ea] rounded-full text-[#4f6f52] text-xl">
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold text-[#2f3e34]">
                {item.title}
              </h3>
            </div>

            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-12 bg-white p-6 rounded-3xl shadow-md border border-[#e0ece4]">
        <h2 className="text-xl font-semibold mb-2 text-[#2f3e34]">
          Quick Tip
        </h2>
        <p className="text-gray-600">
          Use the sidebar to navigate between different admin sections quickly.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;