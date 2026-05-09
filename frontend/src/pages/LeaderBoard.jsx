import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

const LeaderBoard = () => {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10); // 🔥 pagination control
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopStudents = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/leaderboard/top`,
          { withCredentials: true }
        );

        setData(res.data.topStudents || []);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchTopStudents();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#dfe6da] flex justify-center px-3 sm:px-6 py-6 sm:pt-20">

      <div className="w-full max-w-3xl">

        {/* TITLE */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#4f6f52] mb-6 sm:mb-8">
          🏆 Student Leaderboard
        </h2>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 sm:mb-6 px-4 py-2 text-sm sm:text-base bg-[#9caf88] text-white rounded-xl hover:bg-[#4f6f52] transition"
        >
          ← Back
        </button>

        {/* CARD (SCROLLABLE) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[500px] overflow-y-auto">

          {data.length === 0 && (
            <p className="text-center text-gray-500 text-sm sm:text-base">
              No data available
            </p>
          )}

          {data.slice(0, limit).map((item, index) => {
            const isTopper = index === 0;

            return (
              <div
                key={item._id}
                className={`flex items-center justify-between p-3 sm:p-4 rounded-xl transition-all
                ${
                  isTopper
                    ? "bg-[#e8f0e6] border border-[#4f6f52]"
                    : "bg-[#f7faf6] hover:bg-[#edf3eb]"
                }`}
              >

                {/* LEFT */}
                <div className="flex items-center gap-3 sm:gap-4">

                  {/* RANK */}
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white font-semibold text-sm sm:text-base
                    ${isTopper ? "bg-[#4f6f52]" : "bg-[#9caf88]"}`}
                  >
                    {index + 1}
                  </div>

                  {/* NAME */}
                  <div className="max-w-[140px] sm:max-w-none">
                    <p className="font-semibold text-sm sm:text-lg text-[#4f6f52] truncate">
                      {item?.student?.name || "Unknown"}
                    </p>

                    {isTopper && (
                      <span className="text-[10px] sm:text-xs bg-[#4f6f52] text-white px-2 py-1 rounded-full">
                        Topper
                      </span>
                    )}
                  </div>

                </div>

                {/* POINTS */}
                <div className="text-base sm:text-lg font-bold text-[#4f6f52] whitespace-nowrap">
                  {item?.totalPoints || 0}
                  <span className="text-xs sm:text-sm ml-1 text-gray-500">
                    pts
                  </span>
                </div>

              </div>
            );
          })}

          {/* LOAD MORE BUTTON */}
          {limit < data.length && (
            <button
              onClick={() => setLimit(limit + 10)}
              className="w-full mt-4 bg-[#4f6f52] text-white py-2 rounded-lg hover:bg-[#3f5a42] transition"
            >
              Load More
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;