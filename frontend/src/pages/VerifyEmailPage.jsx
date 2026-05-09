import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/user/verify-email/${token}`);
        if (data.success) {
          setStatus("success");
          setMessage(data.message);
        }
      } catch (error) {
        setStatus("error");
        setMessage(error.response?.data?.message || "Verification failed. The link may be invalid or expired.");
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dfe6da] px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 sm:p-12 w-full max-w-lg text-center transform transition-all hover:scale-[1.01]">
        
        {status === "loading" && (
          <div className="space-y-6">
            <Loader2 className="w-16 h-16 text-[#9caf88] animate-spin mx-auto" />
            <h2 className="text-2xl font-bold text-gray-800">Verifying Your Email</h2>
            <p className="text-gray-500">Please wait while we confirm your account...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            <h2 className="text-3xl font-extrabold text-[#4f6f52]">Email Verified!</h2>
            <p className="text-gray-600 text-lg">
              {message || "Your account has been successfully verified. Welcome to the EduNova community!"}
            </p>
            <div className="pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-[#4f6f52] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#3d5a40] transition-all shadow-lg active:scale-95"
              >
                Proceed to Login <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top duration-500">
            <XCircle className="w-20 h-20 text-red-500 mx-auto" />
            <h2 className="text-3xl font-extrabold text-red-600">Verification Failed</h2>
            <p className="text-gray-600">
              {message}
            </p>
            <div className="pt-4 space-y-4">
              <Link
                to="/register"
                className="block text-[#4f6f52] font-bold hover:underline"
              >
                Try Registering Again
              </Link>
              <p className="text-sm text-gray-400">
                If you think this is a mistake, please contact support.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default VerifyEmailPage;
