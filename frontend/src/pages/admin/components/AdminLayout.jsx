import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar.jsx";

const AdminLayout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen ">

      <div className="w-full md:w-64 md:fixed md:top-0 md:left-0">
        <AdminSidebar />
      </div>

      <div className="flex-1 p-3 sm:p-6 md:ml-64 mt-16 md:mt-0">
        <Outlet />
      </div>

    </div>
  );
};

export default AdminLayout;