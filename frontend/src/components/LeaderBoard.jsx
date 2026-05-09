import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Leaderboard = () => {
  const { user } = useSelector((state) => state.auth);
  const studentId = user?._id;

  const [topStudents, setTopStudents] = useState([]);
  const [dailyProgress, setDailyProgress] = useState([]);
  const [subjectStats, setSubjectStats] = useState({});
  const [weeklyStats, setWeeklyStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topRes = await axios.get(
          "http://localhost:4000/api/v1/leaderboard/top"
        );
        setTopStudents(topRes.data.topStudents || []);

        const dailyRes = await axios.get(
          `http://localhost:4000/api/v1/leaderboard/student/${studentId}/daily`
        );
        setDailyProgress(dailyRes.data.dailyProgress || []);

        const subjectRes = await axios.get(
          `http://localhost:4000/api/v1/leaderboard/subject/ranking`
        );
        setSubjectStats(subjectRes.data.subjectRanking || {});

        const weeklyRes = await axios.get(
          `http://localhost:4000/api/v1/leaderboard/student/${studentId}/weekly-subjects`
        );
        setWeeklyStats(weeklyRes.data.weeklySubjectStats || {});
      } catch (error) {
        console.error(error);
      }
    };

    if (studentId) fetchData();
  }, [studentId]);

  const subjects = Object.keys(subjectStats || {});

  return (
    <div className="min-h-screen bg-[#dfe6da] p-3 sm:p-6 mt-20">

      <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-[#758467] mb-6 sm:mb-10">
        Student Leaderboard
      </h1>

      {/* ================= TOP STUDENTS ================= */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#758467]">
          Top Students
        </h2>

        <div className="bg-white shadow-xl rounded-3xl p-3 sm:p-6 max-h-[300px] overflow-y-auto space-y-2 border">

          {topStudents.slice(0, 10).map((s, idx) => {
            const isCurrent = s?.student?._id === studentId;

            return (
              <div
                key={idx}
                className={`flex justify-between items-center p-3 rounded-xl border
                ${isCurrent ? "bg-[#dfe6da] border-[#758467]" : "hover:bg-[#edf3eb]"}`}
              >
                <span className="font-bold text-[#758467]">
                  #{idx + 1}
                </span>

                <span className="font-semibold truncate max-w-[150px]">
                  {s?.student?.name ?? "Unknown"}
                </span>

                <span className="font-bold text-[#758467]">
                  {s?.totalPoints ?? 0} pts
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= DAILY ================= */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#758467]">
          Daily Performance
        </h2>

        <div className="bg-white rounded-2xl p-4 shadow overflow-x-auto">
          <Line
            data={{
              labels: dailyProgress.slice(0, 15).map((p) =>
                new Date(p.date).toLocaleDateString()
              ),
              datasets: [
                {
                  label: "Score",
                  data: dailyProgress.slice(0, 15).map((p) => p.score),
                  borderColor: "#758467",
                  backgroundColor: "rgba(117,132,103,0.2)",
                  tension: 0.3,
                  fill: true,
                },
              ],
            }}
          />
        </div>
      </section>

      {/* ================= SUBJECT STATS ================= */}
      <section className="mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#758467]">
          Subject-wise Stats
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4">

          {subjects.slice(0, 5).map((subject) => {
            const stats = subjectStats[subject];

            return (
              <div
                key={subject}
                className="min-w-[240px] bg-white rounded-2xl p-4 shadow border"
              >
                <h3 className="font-bold text-[#758467] mb-2">
                  {subject}
                </h3>

                <div className="max-h-[180px] overflow-y-auto space-y-2">

                  {stats.slice(0, 5).map((s, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm border p-2 rounded"
                    >
                      <span className="truncate">{s.name}</span>
                      <span className="font-bold text-[#758467]">
                        {s.totalScore}
                      </span>
                    </div>
                  ))}

                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* ================= WEEKLY ================= */}
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#758467]">
          Weekly Stats
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-4">

          {Object.keys(weeklyStats || {}).slice(0, 5).map((subject) => {
            const stats = weeklyStats[subject] || {};

            return (
              <div
                key={subject}
                className="min-w-[240px] bg-white rounded-2xl p-4 shadow border"
              >
                <h3 className="font-bold text-[#758467] mb-3">
                  {subject}
                </h3>

                <div className="grid grid-cols-3 text-center text-sm">
                  <div>
                    <p className="font-bold">{stats.totalScore || 0}</p>
                    <p className="text-gray-500">Score</p>
                  </div>

                  <div>
                    <p className="font-bold text-green-600">
                      {stats.totalCorrect || 0}
                    </p>
                    <p className="text-gray-500">Correct</p>
                  </div>

                  <div>
                    <p className="font-bold text-red-500">
                      {stats.totalWrong || 0}
                    </p>
                    <p className="text-gray-500">Wrong</p>
                  </div>
                </div>

              </div>
            );
          })}

        </div>
      </section>

    </div>
  );
};

export default Leaderboard;