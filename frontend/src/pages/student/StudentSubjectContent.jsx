import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentSubjectContent = () => {
  const [grouped, setGrouped] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/forum/student/playlist", {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data.grouped || [];
        setGrouped(data);

        if (data.length > 0) {
          setActiveSubject(data[0]);
        }
      })
      .catch((err) => console.log("API ERROR:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#dfe6da] mt-15 relative">

      {/* MOBILE TOGGLE */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#4f6f52] text-white px-3 py-2 rounded-lg"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-72 md:w-1/4
          bg-white md:rounded-2xl md:shadow-lg p-4
          transition-transform duration-300 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <h2 className="text-xl font-bold text-[#4f6f52] mb-4">
          Subjects Playlist
        </h2>

        {grouped.map((section) => (
          <div
            key={section.subject?._id?.toString()}
            onClick={() => {
              setActiveSubject(section);
              setSidebarOpen(false);
            }}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition ${
              activeSubject?.subject?._id === section.subject?._id
                ? "bg-[#4f6f52] text-white"
                : "bg-gray-100 hover:bg-[#87a977] hover:text-white"
            }`}
          >
            {section.subject?.name}
          </div>
        ))}
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 p-4 md:p-6 bg-white md:rounded-2xl md:shadow-lg overflow-y-auto w-full">

        {!activeSubject ? (
          <h2 className="text-gray-500 text-lg">Select a subject</h2>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-bold text-[#4f6f52] mb-6">
              {activeSubject.subject.name} Playlist
            </h2>

            {/* PDFs */}
            <div className="mb-8">
              <h3 className="text-lg md:text-xl font-semibold text-blue-700 mb-4">
                📄 PDFs
              </h3>

              {activeSubject.content
                .filter((item) => item.type === "pdf")
                .length > 0 ? (
                activeSubject.content
                  .filter((item) => item.type === "pdf")
                  .map((item) => (
                    <div
                      key={item._id}
                      className="border rounded-xl p-4 bg-gray-50 mb-4"
                    >
                      <h3 className="font-bold text-lg">{item.title}</h3>

                      <p className="text-sm text-gray-600">
                        Teacher: {item.teacher?.name}
                      </p>

                      <iframe
                        src={`https://docs.google.com/gview?url=${encodeURIComponent(
                          item.fileUrl
                        )}&embedded=true`}
                        width="100%"
                        height="300px"
                        className="rounded-lg border mt-2"
                        title="PDF"
                      />

                      <a
                        href={`http://localhost:4000/api/v1/forum/content/download/${item._id}`}
                        className="text-green-600 underline mt-2 block"
                      >
                        Download PDF
                      </a>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">No PDFs available</p>
              )}
            </div>

            {/* VIDEOS */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-red-600 mb-4">
                🎥 Videos
              </h3>

              {activeSubject.content
                .filter((item) => item.type === "video")
                .length > 0 ? (
                activeSubject.content
                  .filter((item) => item.type === "video")
                  .map((item) => (
                    <div
                      key={item._id}
                      className="border rounded-xl p-4 bg-gray-50 mb-4"
                    >
                      <h3 className="font-bold text-lg">{item.title}</h3>

                      <p className="text-sm text-gray-600">
                        Teacher: {item.teacher?.name}
                      </p>

                      <video controls className="w-full rounded-lg mt-2">
                        <source src={item.fileUrl} />
                      </video>

                      <a
                        href={`http://localhost:4000/api/v1/forum/content/download/${item._id}`}
                        className="text-green-600 underline mt-2 block"
                      >
                        Download Video
                      </a>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">No Videos available</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentSubjectContent;