import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const StudentSubjectStats = () => {
  const { user } = useSelector((state) => state.auth);
  const studentId = user?._id;

  const navigate = useNavigate();

  const [subjectStats, setSubjectStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/leaderboard/subject/ranking",
          { withCredentials: true }
        );

        const statsObj = res.data.subjectRanking || {};

        const formatted = Object.entries(statsObj).map(
          ([subject, records]) => {

            const sorted = [...records].sort(
              (a, b) => b.totalScore - a.totalScore
            );

            const updatedRecords = sorted.map((rec, index) => ({
              ...rec,
              rank: index + 1,
            }));

            return { subject, records: updatedRecords };
          }
        );

        setSubjectStats(formatted);
      } catch (error) {
        console.log(error);

        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#dfe6da] pt-20 px-6">

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-xl">

        <h3 className="text-3xl font-bold mb-10 text-center text-[#758467]">
          🏆 Subject-wise Rankings
        </h3>

        {subjectStats.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">
            No subject data available.
          </p>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">

            {subjectStats.map((item, idx) => {

              const studentRecord = item.records.find(
                (r) => r.student === studentId
              );

              return (
                <div
                  key={idx}
                  className="min-w-[300px] bg-[#f7faf6] p-6 rounded-2xl shadow-md border border-[#9caf88]/30"
                >

                  <div className="flex justify-between items-center mb-5">

                    <h4 className="text-lg font-bold text-[#758467]">
                      {item.subject}
                    </h4>

                    {studentRecord && (
                      <span className="px-3 py-1 bg-[#758467] text-white rounded-full text-sm">
                        Your Rank: {studentRecord.rank}
                      </span>
                    )}

                  </div>

                  <div className="space-y-3">

                    {item.records.map((rec, i) => {

                      const isCurrentStudent =
                        rec.student === studentId;

                      return (
                        <div
                          key={i}
                          className={`flex justify-between p-3 rounded-lg border transition
                          ${
                            isCurrentStudent
                              ? "bg-[#dfe6da] border-[#758467] scale-[1.02] shadow-md"
                              : "bg-white border-gray-200 hover:bg-[#edf3eb]"
                          }`}
                        >

                          <span
                            className={`font-semibold ${
                              isCurrentStudent
                                ? "text-[#758467]"
                                : "text-gray-800"
                            }`}
                          >
                            {rec.rank}. {rec.name}
                          </span>

                          <span
                            className={`font-bold ${
                              isCurrentStudent
                                ? "text-[#758467]"
                                : "text-gray-700"
                            }`}
                          >
                            {rec.totalScore} pts
                          </span>

                        </div>
                      );
                    })}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default StudentSubjectStats;