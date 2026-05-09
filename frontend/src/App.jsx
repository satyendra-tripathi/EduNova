import React from "react";
import Home from "./pages/Home.jsx";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";
import StudentDashboard, {
  AIChatSection,
} from "./components/StudentDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
// import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentPerformance from "./pages/StudentPerformance";
import LeaderBoard from "./pages/LeaderBoard.jsx";
import Leaderboard from "./components/LeaderBoard.jsx";

import TeacherLayout from "./pages/TeacherDashboard.jsx";
import AddQuestion from "./pages/teacher/AddQuestion.jsx";
import AllQuestions from "./pages/teacher/AllQuestions.jsx";
// import Dashboardd from "./pages/Dashboard.jsx";
// import Leaderboard from "./pages/LeaderBoard.jsx";
import SubjectLeaderboard from "./pages/SubjectLeaderboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentSubjectQuestions from "./pages/student/StudentSubjectQuestions.jsx";
import { useSelector } from "react-redux";
import ChangePassword from "./pages/ChangePassword.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import About from "./pages/About.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminSubject from "./pages/admin/AdminSubject.jsx";
import AdminLayout from "./pages/admin/components/AdminLayout.jsx";
import AdminQuestions from "./pages/admin/AdminQuestions.jsx";
import AdminAnswers from "./pages/admin/AdminAnswers.jsx";
import AdminQuizzes from "./pages/admin/AdminQuizzes.jsx";
import StudentQuiz from "./pages/student/StudentQuiz.jsx";
import LongAnswerCheck from "./pages/teacher/LongAnswerCheck.jsx";


import StudentSubjectContent from "./pages/student/StudentSubjectContent.jsx";
import SubjectContent from "./pages/teacher/SubjectContent.jsx";
import UploadContent from "./pages/teacher/UploadContent.jsx"
import Subjects from "./pages/teacher/Subjects.jsx";
import TeacherAIQuizGenerator from "./pages/teacher/TeacherAIQuizGenerator.jsx";


function App() {
  const { user } = useSelector((state) => state.auth);
  const studentId = user?._id;
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/dashboard" element={<Dashboardd />} /> */}
        {/* Protected Routes */}
        <Route path="/about" element={<About />}></Route>
        <Route path="/student/change-password" element={<ChangePassword />} />
        <Route path="/student/change-profile" element={<ProfilePage />} />
        <Route path="/student/quiz" element={<StudentQuiz />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/ai-section" element={<AIChatSection />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/check-answer/:id" element={<LongAnswerCheck />} />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/teacher/dashboard" element={<TeacherDashboard />} /> */}
        <Route path="/teacher/student/:id" element={<StudentPerformance />} />
        <Route path="/teacher/leaderboard" element={<LeaderBoard />} />
        <Route
          path="/teacher/leaderboard/subject"
          element={<SubjectLeaderboard />}
        />
        <Route
          path="/student/:id/performance"
          element={<StudentPerformance />}
        />
        <Route path="/add-question" element={<AddQuestion />} />
        <Route path="/questions" element={<AllQuestions />} />

        <Route
          path="/student/questions"
          element={
            <ProtectedRoute>
              <StudentSubjectQuestions studentId={studentId} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/:studentId/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/:studentId/progress"
          element={
            <ProtectedRoute>
              <StudentPerformance />
            </ProtectedRoute>
          }
        />

        
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/upload-content" element={<UploadContent />} />
        <Route path="/subjects-content" element={<SubjectContent />} />
        <Route path="/teacher/ai-quiz-generator" element={<TeacherAIQuizGenerator />} />

        <Route path="/student-content" element={<StudentSubjectContent />} />




        {/* Admin Routes */}
        <Route  element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/admin-questions" element={<AdminQuestions />} />
          <Route path="/admin-subjects" element={<AdminSubject />} />
          <Route path="/student-answers" element={<AdminAnswers />} />
          <Route path="/admin-quizzes" element={<AdminQuizzes />} />
         
        </Route>





      </Routes>
    </>
  );
}

export default App;
