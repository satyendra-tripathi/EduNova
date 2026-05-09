import React, { useEffect, useState } from "react";
import axios from "axios";

const MySubjects = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const { data } = await axios.get("http://localhost:4000/api/v1/forum/subjects", {
        withCredentials: true,
      });
      setSubjects(data.subjects);
    };

    fetchSubjects();
  }, []);

  return (
    <div className="p-6 mt-15">
      <h2 className="text-2xl font-bold mb-4">My Subjects</h2>

      <div className="grid md:grid-cols-3 gap-4">
        {subjects.map((sub) => (
          <div key={sub._id} className="bg-white p-4 shadow rounded-lg">
            <h3 className="font-bold text-lg">{sub.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MySubjects;