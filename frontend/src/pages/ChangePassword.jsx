import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../store/slices/authSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      })
    );

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dfe6da] px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-2xl font-bold text-center text-[#758467] mb-6">
          Change Password
        </h2>

        <form onSubmit={submitHandler} className="space-y-5">

          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Old Password
            </label>

            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter old password"
              className="w-full px-4 py-2 border border-[#9caf88]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-[#9caf88]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-[#9caf88]/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9caf88]"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg transition ${
              loading
                ? "bg-[#9caf88] cursor-not-allowed"
                : "bg-[#758467] hover:bg-[#9caf88]"
            }`}
          >
            {loading ? "Updating..." : "Change Password"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;