// src/redux/profileSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  loading: false,
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : {},
  message: null,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // ===== Update Profile =====
    UpdateProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null; // ✅ remove any interim message
    },
    UpdateProfileSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.error = null;
    },
    UpdateProfileFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== Verify Email =====
    VerifyEmailRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null; // ✅ remove any interim message
    },
    VerifyEmailSuccess: (state, action) => {
      state.loading = false;
      state.user.emailVerified = true;
      state.message = action.payload;
      state.error = null;
    },
    VerifyEmailFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ===== Clear Errors & Messages =====
    clearAllErrors: (state) => {
      state.error = null;
      state.message = null;
    },
  },
});

// ============================
// THUNKS
// ============================

// 👉 Update Profile
export const updateProfile = (formData) => async (dispatch) => {
  dispatch(profileSlice.actions.UpdateProfileRequest());
  try {
    const { data } = await axios.put(
      `${API_URL}/user/profile`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    dispatch(profileSlice.actions.UpdateProfileSuccess(data));

    // ✅ Toast only on success
    toast.success(data.message);

    // ✅ Update localStorage
    if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
  } catch (err) {
    const message = err.response?.data?.message || err.message;

    dispatch(profileSlice.actions.UpdateProfileFailed(message));

    // ✅ Toast only on error
    toast.error(message);
  }
};

// 👉 Verify Email
export const verifyEmail = (token) => async (dispatch) => {
  dispatch(profileSlice.actions.VerifyEmailRequest());
  try {
    const { data } = await axios.get(
      `${API_URL}/user/verify-email/${token}`,
      { withCredentials: true }
    );

    dispatch(profileSlice.actions.VerifyEmailSuccess(data.message));

    toast.success(data.message);
  } catch (err) {
    const message = err.response?.data?.message || err.message;

    dispatch(profileSlice.actions.VerifyEmailFailed(message));

    toast.error(message);
  }
};

// 👉 Clear errors/messages
export const clearErrors = () => (dispatch) => {
  dispatch(profileSlice.actions.clearAllErrors());
};

export default profileSlice.reducer;
