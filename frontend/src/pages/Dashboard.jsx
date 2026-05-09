// Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/v1/dashboard", {
          withCredentials: true, // ✅ send cookie
        });

        // Backend should send { name, role } based on token
        setUserData(res.data.user);
        setLoading(false);
      } catch (err) {
        console.log(err);
        // Unauthorized → redirect to login
        navigate("/login");
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  const { name, role } = userData;

  const renderContent = () => {
    switch (role) {
      case "student":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-blue-600 mb-4">
              🎓 Welcome Student, {name}!
            </h2>
            <p className="text-lg text-gray-700">
              Access your courses, daily progress, and leaderboards here.
            </p>
          </div>
        );
      case "teacher":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-green-600 mb-4">
              👩‍🏫 Welcome Teacher, {name}!
            </h2>
            <p className="text-lg text-gray-700">
              Manage your classes, students, and assignments here.
            </p>
          </div>
        );
      case "admin":
        return (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-red-600 mb-4">
              🛠️ Welcome Admin, {name}!
            </h2>
            <p className="text-lg text-gray-700">
              Manage platform settings, users, and analytics here.
            </p>
          </div>
        );
      default:
        return <p className="text-gray-700">Unknown role</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-blue-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
