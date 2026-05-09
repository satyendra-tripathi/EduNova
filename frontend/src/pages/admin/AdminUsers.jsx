import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [blockId, setBlockId] = useState(null);

  const API_BASE = "http://localhost:4000/api/v1/admin";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`, {
        withCredentials: true,
      });
      setUsers(res.data.users || []);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.patch(
        `${API_BASE}/users/${userId}/role`,
        { role },
        { withCredentials: true }
      );
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/users/${deleteId}`, {
        withCredentials: true,
      });
      setDeleteId(null);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmBlock = async () => {
    try {
      await axios.put(
        `${API_BASE}/user/block/${blockId}`,
        {},
        { withCredentials: true }
      );
      setBlockId(null);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="p-6 mt-15 bg-[#f6fff8] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#4f6f52]">
        Admin Users
      </h1>

      <table className="w-full table-auto border-collapse border border-[#4f6f52] shadow-lg">
        <thead>
          <tr className="bg-gradient-to-r from-[#4f6f52] to-[#739072] text-white">
            <th className="px-4 py-3 border">Name</th>
            <th className="px-4 py-3 border">Email</th>
            <th className="px-4 py-3 border">Role</th>
            <th className="px-4 py-3 border">Status</th>
            <th className="px-4 py-3 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="text-center hover:bg-[#e8f5e9]"
            >
              <td className="px-4 py-2 border">{user.name}</td>
              <td className="px-4 py-2 border">{user.email}</td>

              <td className="px-4 py-2 border">
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user._id, e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </td>

              <td className="px-4 py-2 border">
                {user.isBlocked ? (
                  <span className="text-red-600 font-semibold">
                    Blocked
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    Active
                  </span>
                )}
              </td>

              <td className="px-4 py-2 border flex justify-center gap-3">
                <button
                  onClick={() => setBlockId(user._id)}
                  className={`px-3 py-1 rounded text-white ${
                    user.isBlocked
                      ? "bg-green-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>

                <button
                  onClick={() => setDeleteId(user._id)}
                  className="text-red-600"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="mb-4">Delete this user?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BLOCK MODAL */}
      {blockId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <p className="mb-4">Change user status?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setBlockId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmBlock}
                className="px-4 py-2 bg-yellow-600 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;