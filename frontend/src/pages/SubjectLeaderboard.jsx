import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubjectLeaderboard = () => {
  const [ranking, setRanking] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/leaderboard/subject/ranking", {
        withCredentials: true,
      })
      .then((res) => {
        setRanking(res.data.subjectRanking || {});
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          navigate("/login");
        }
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#dfe6da] pt-20 px-6">

      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h2 className="text-4xl font-bold text-center text-[#758467] mb-10">
          📘 Subject Leaderboard
        </h2>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-6 py-2 bg-[#758467] text-white rounded-xl shadow hover:bg-[#9caf88] transition"
        >
          ← Back
        </button>

        {Object.keys(ranking).length === 0 && (
          <p className="text-center text-gray-600 text-lg">
            No leaderboard data available
          </p>
        )}

        <div className="space-y-8">

          {Object.keys(ranking).map((subject) => (

            <div
              key={subject}
              className="bg-white rounded-3xl shadow-lg p-7"
            >

              {/* Subject Title */}
              <h3 className="text-2xl font-bold text-[#758467] mb-6 border-b pb-2">
                {subject}
              </h3>

              <div className="space-y-3">

                {ranking[subject].map((item, i) => {

                  let rankColor =
                    i === 0
                      ? "bg-yellow-500"
                      : i === 1
                      ? "bg-gray-400"
                      : i === 2
                      ? "bg-orange-400"
                      : "bg-[#758467]";

                  return (
                    <div
                      key={item.studentId}
                      onClick={() =>
                        navigate(`/student/${item.studentId}/performance`)
                      }
                      className="flex items-center justify-between p-4 rounded-xl cursor-pointer
                      bg-[#f7faf6] hover:bg-[#edf3eb] transition-all duration-300 hover:scale-[1.02]"
                    >

                      {/* Left */}
                      <div className="flex items-center gap-4">

                        {/* Rank */}
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold text-white ${rankColor}`}
                        >
                          {i + 1}
                        </div>

                        {/* Name */}
                        <div>
                          <p className="text-lg font-semibold text-[#758467]">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Rank #{i + 1}
                          </p>
                        </div>

                      </div>

                      {/* Score */}
                      <div className="text-lg font-bold text-[#758467]">
                        {item.totalScore}
                        <span className="text-sm text-gray-500 ml-1">
                          pts
                        </span>
                      </div>

                    </div>
                  );
                })}

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default SubjectLeaderboard;