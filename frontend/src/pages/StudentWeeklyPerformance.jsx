import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const StudentWeeklyPerformance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [weekData, setWeekData] = useState([]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/leaderboard/student/${id}/weekly-subjects`,
          { withCredentials: true }
        );

        const statsObj = res.data.weeklySubjectStats || {};

        const statsArray = Object.entries(statsObj).map(([subject, data]) => ({
          subject,
          totalScore: data.totalScore || 0,
          totalCorrect: data.totalCorrect || 0,
          totalWrong: data.totalWrong || 0,
          rank: data.rank || "-",
        }));

        setWeekData(statsArray);
      } catch (err) {
        console.log(err);

        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchWeeklyData();
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-[#dfe6da] pt-16 px-3 md:px-6">

      <div className="max-w-6xl mx-auto bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-xl">

        {/* TITLE */}
        <h3 className="text-xl md:text-3xl font-bold mb-8 text-center text-[#758467]">
          📅 Weekly Subject Performance
        </h3>

        {weekData.length === 0 ? (
          <p className="text-gray-500 text-center">
            No weekly data available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

            {weekData.map((item, index) => (
              <div
                key={index}
                className="p-4 md:p-6 bg-[#f7faf6] rounded-2xl shadow border border-[#9caf88]/30"
              >

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4 gap-2">

                  <h4 className="text-base md:text-lg font-bold text-[#758467] truncate">
                    {item.subject}
                  </h4>

                  <span className="px-2 md:px-3 py-1 bg-[#758467] text-white rounded-full text-xs md:text-sm whitespace-nowrap">
                    Rank: {item.rank}
                  </span>

                </div>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">

                  <div className="bg-white p-2 md:p-4 rounded-lg shadow border">
                    <p className="text-lg md:text-xl font-bold text-[#758467]">
                      {item.totalScore}
                    </p>
                    <p className="text-gray-500 text-xs md:text-sm">Score</p>
                  </div>

                  <div className="bg-white p-2 md:p-4 rounded-lg shadow border">
                    <p className="text-lg md:text-xl font-bold text-green-600">
                      {item.totalCorrect}
                    </p>
                    <p className="text-gray-500 text-xs md:text-sm">Correct</p>
                  </div>

                  <div className="bg-white p-2 md:p-4 rounded-lg shadow border">
                    <p className="text-lg md:text-xl font-bold text-red-500">
                      {item.totalWrong}
                    </p>
                    <p className="text-gray-500 text-xs md:text-sm">Wrong</p>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default StudentWeeklyPerformance;