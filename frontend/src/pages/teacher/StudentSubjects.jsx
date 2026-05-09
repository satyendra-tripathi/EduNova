// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const StudentSubjects = () => {
//   const [subjects, setSubjects] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchSubjects = async () => {
//       try {
//         const { data } = await axios.get("/api/student/subjects", {
//           withCredentials: true,
//         });

//         setSubjects(data.subjects);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchSubjects();
//   }, []);

//   return (
//     <div className="p-6 mt-15">
//       <h2 className="text-2xl font-bold mb-6">My Subjects</h2>

//       <div className="grid md:grid-cols-3 gap-4">
//         {subjects.map((sub) => (
//           <div
//             key={sub._id}
//             className="bg-white shadow rounded-xl p-5 cursor-pointer hover:shadow-lg transition"
//             onClick={() =>
//               navigate(`/student/subject/${sub._id}/content`)
//             }
//           >
//             <h3 className="text-lg font-bold text-[#07332c]">
//               {sub.name}
//             </h3>

//             <p className="text-gray-500 text-sm mt-1">
//               Click to view PDFs & Videos
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default StudentSubjects;