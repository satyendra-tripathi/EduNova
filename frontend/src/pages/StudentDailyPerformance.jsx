import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StudentDailyPerformance = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDailyProgress = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/leaderboard/student/${id}/daily`,
          { withCredentials: true }
        );

        setData(res.data.dailyProgress || []);
      } catch (err) {
        console.log(err);

        if (err.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchDailyProgress();
  }, [id, navigate]);

  const chartData = {
    labels: data.map((d) => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: "Score",
        data: data.map((d) => d.score),
        borderColor: "#758467",
        backgroundColor: "rgba(156,175,136,0.2)",
        pointBackgroundColor: "#758467",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // 🔥 important for mobile
    plugins: {
      legend: { display: true, position: "top" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="min-h-screen bg-[#dfe6da] pt-16 px-3 md:px-6">

      <div className="max-w-6xl mx-auto bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl shadow-xl">

        {/* TITLE */}
        <h3 className="text-xl md:text-3xl font-bold mb-6 text-[#758467] text-center">
          📊 Daily Performance
        </h3>

        {data.length === 0 ? (
          <p className="text-gray-500 text-center">
            No data available
          </p>
        ) : (
          <>
            {/* CHART */}
            <div className="w-full h-64 md:h-96 mb-8">
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

              {data.map((item, index) => {
                const goodScore = item.score >= 50;

                return (
                  <div
                    key={index}
                    className={`p-4 md:p-5 rounded-xl shadow border transition
                    ${
                      goodScore
                        ? "border-[#9caf88] bg-[#f4f7f2]"
                        : "border-red-300 bg-red-50"
                    }`}
                  >

                    <p className="text-sm md:text-base text-gray-700">
                      <span className="font-bold text-[#758467]">
                        Date:
                      </span>{" "}
                      {item.date.slice(0, 10)}
                    </p>

                    <p className="text-sm md:text-base mt-1">
                      <span className="font-bold text-[#758467]">
                        Score:
                      </span>{" "}
                      {item.score} pts
                    </p>

                  </div>
                );
              })}

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default StudentDailyPerformance;