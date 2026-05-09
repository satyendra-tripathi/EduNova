import React, { useState } from "react";
import { useSelector } from "react-redux";
import Login from "./Login";
import Register from "./Register";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [authType, setAuthType] = useState("login");
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleGetStarted = () => {
    setAuthType("login");
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="min-h-screen bg-[#dfe6da] flex items-center justify-center px-6">

      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold mb-6 text-[#4f6f52]">
          👋 Welcome to <span className="text-[#9caf88]">EduNova</span>
        </h1>

        <p className="text-lg md:text-xl mb-8 text-gray-700 leading-relaxed">
          Your personal learning companion powered by{" "}
          <span className="font-semibold">Artificial Intelligence</span>.
          Get answers instantly, learn smarter, and boost your knowledge
          every day.
        </p>

        {!isAuthenticated && (
          <div className="flex justify-center gap-4">

            <button
              className="bg-[#9caf88] text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#87a977] transition"
              onClick={handleGetStarted}
            >
              🚀 Get Started
            </button>

            <button className="bg-white border border-[#9caf88] text-[#9caf88] px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-[#9caf88] hover:text-white transition">
              📘 Learn More
            </button>

          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">

            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={handleClose}
            >
              ✖
            </button>

            {authType === "login" ? <Login /> : <Register />}

            <p className="text-center mt-4 text-gray-600">
              {authType === "login" ? (
                <>
                  New here?{" "}
                  <span
                    className="text-[#9caf88] cursor-pointer hover:underline"
                    onClick={() => setAuthType("register")}
                  >
                    Register
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-[#9caf88] cursor-pointer hover:underline"
                    onClick={() => setAuthType("login")}
                  >
                    Login
                  </span>
                </>
              )}
            </p>

          </div>

        </div>
      )}
    </div>
  );
}

export default Home;