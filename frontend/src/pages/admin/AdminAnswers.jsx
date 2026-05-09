import React, { useEffect, useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const AdminAnswers = () => {
  const [data, setData] = useState([]);

  const fetchAnswers = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/answers`,
        { withCredentials: true }
      );
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  return (
    <div className="p-6 mt-15">
      <h1 className="text-2xl font-bold">Answer Monitoring</h1>

      {data.map((q) => (
        <div key={q._id} className="border p-4 my-3">
          <p className="font-semibold">{q.question}</p>

          {q.answers.map((ans, i) => (
            <div key={i} className="ml-4">
              <p>
                {ans.user?.name}: {ans.text}
                {ans.isCorrect && " ✅"}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminAnswers;