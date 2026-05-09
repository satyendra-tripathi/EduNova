import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SubjectContent = () => {
  const [grouped, setGrouped] = useState([]);
  const [activeSubject, setActiveSubject] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/forum/content/playlist", {
        withCredentials: true,
      })
      .then((res) => setGrouped(res.data.grouped || []))
      .catch((err) => console.log(err));
  }, []);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/api/v1/forum/content/${deleteId}`,
        { withCredentials: true }
      );

      setGrouped((prev) =>
        prev.map((section) => ({
          ...section,
          content: section.content.filter((i) => i._id !== deleteId),
        }))
      );

      if (activeSubject) {
        setActiveSubject({
          ...activeSubject,
          content: activeSubject.content.filter((i) => i._id !== deleteId),
        });
      }

      setShowModal(false);
      setDeleteId(null);

      toast.success("Content deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#dfe6da] px-3 md:px-6 py-6 mt-16">

      {/* MAIN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">

        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-1/4 bg-white rounded-2xl shadow p-4">

          <h2 className="text-lg md:text-xl font-bold text-[#4f6f52] mb-4">
            My Subjects
          </h2>

          <div className="flex md:block gap-2 overflow-x-auto md:overflow-visible">

            {grouped.map((section) => (
              <div
                key={section.subject?._id}
                onClick={() => setActiveSubject(section)}
                className={`min-w-max md:w-full p-3 mb-0 md:mb-2 rounded-lg cursor-pointer text-sm md:text-base transition
                  ${
                    activeSubject?.subject?._id === section.subject?._id
                      ? "bg-[#4f6f52] text-white"
                      : "bg-gray-100 hover:bg-[#87a977] hover:text-white"
                  }`}
              >
                {section.subject?.name}
              </div>
            ))}

          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex-1 bg-white rounded-2xl shadow p-4 md:p-6">

          {!activeSubject ? (
            <h2 className="text-center text-gray-500">
              Select a subject
            </h2>
          ) : (
            <>
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#4f6f52]">
                {activeSubject.subject.name} Playlist
              </h2>

              <div className="space-y-4">

                {activeSubject.content.map((item) => (
                  <div key={item._id} className="border p-3 md:p-4 rounded-xl">

                    <h3 className="font-bold text-sm md:text-base">
                      {item.title}
                    </h3>

                    <p className="text-xs md:text-sm text-gray-500 mb-2 capitalize">
                      {item.type}
                    </p>

                    {/* PDF */}
                    {item.type === "pdf" && (
                      <>
                        <iframe
                          src={`https://docs.google.com/gview?url=${encodeURIComponent(
                            item.fileUrl
                          )}&embedded=true`}
                          width="100%"
                          height="250px"
                          className="border rounded-lg"
                        />

                        <a
                          href={`http://localhost:4000/api/v1/forum/content/download/${item._id}`}
                          className="block text-green-600 underline mt-2 text-sm"
                        >
                          Download PDF
                        </a>
                      </>
                    )}

                    {/* VIDEO */}
                    {item.type === "video" && (
                      <>
                        <video controls className="w-full rounded-lg">
                          <source src={item.fileUrl} />
                        </video>

                        <a
                          href={`http://localhost:4000/api/v1/forum/content/download/${item._id}`}
                          className="block text-green-600 underline mt-2 text-sm"
                        >
                          Download Video
                        </a>
                      </>
                    )}

                    {/* DELETE */}
                    <button
                      onClick={() => openDeleteModal(item._id)}
                      className="mt-2 text-red-600 underline text-sm"
                    >
                      Delete
                    </button>

                  </div>
                ))}

              </div>
            </>
          )}

        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className="bg-white p-5 rounded-xl w-full max-w-sm text-center">

            <h2 className="text-lg font-bold mb-2">
              Delete this content?
            </h2>

            <p className="text-gray-500 mb-5 text-sm">
              This action cannot be undone
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gray-300 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="w-full bg-red-600 text-white py-2 rounded-lg"
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SubjectContent;