import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-[#dfe6da]">

      {/* Hero Section */}
      <div className="bg-[#9caf88] text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">About EduNova</h1>
        <p className="text-lg max-w-2xl mx-auto">
          EduNova is an intelligent learning assistant designed to help
          students understand concepts faster, practice questions, and improve
          their knowledge through interactive AI-powered conversations.
        </p>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-10 items-center">
        <img
          src="https://img.freepik.com/free-vector/online-learning-concept-illustration_114360-4876.jpg"
          alt="EduNova"
          className="rounded-lg shadow-lg"
        />

        <div>
          <h2 className="text-3xl font-bold mb-4 text-[#4f6f52]">
            What is EduNova?
          </h2>

          <p className="text-gray-700 mb-4">
            EduNova is a smart educational platform that allows students to
            learn with the help of Artificial Intelligence. It provides instant
            answers, explanations, and learning guidance just like a personal
            tutor.
          </p>

          <p className="text-gray-700">
            Students can ask questions, solve assignments, and practice
            problems while receiving instant feedback and explanations powered
            by AI.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#4f6f52]">
          Key Features
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">

          <div className="bg-[#dfe6da] p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold mb-2 text-[#4f6f52]">
              AI Chat EduNova
            </h3>
            <p className="text-gray-600">
              Ask questions and get instant explanations from the AI EduNova
              anytime.
            </p>
          </div>

          <div className="bg-[#dfe6da] p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold mb-2 text-[#4f6f52]">
              Assignments
            </h3>
            <p className="text-gray-600">
              Practice coding and theoretical assignments to strengthen your
              knowledge.
            </p>
          </div>

          <div className="bg-[#dfe6da] p-6 rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold mb-2 text-[#4f6f52]">
              Leaderboard
            </h3>
            <p className="text-gray-600">
              Compete with other students and track your learning progress.
            </p>
          </div>

        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-[#dfe6da] text-center px-6">
        <h2 className="text-3xl font-bold mb-4 text-[#4f6f52]">
          Our Mission
        </h2>

        <p className="max-w-3xl mx-auto text-gray-700">
          Our mission is to make learning accessible, interactive, and
          personalized for every student. With the help of Artificial
          Intelligence, we aim to provide a smart tutor that is available 24/7
          and helps students understand concepts easily.
        </p>
      </div>

      {/* CTA Section */}
      <div className="bg-[#9caf88] text-white text-center py-12">
        <h2 className="text-2xl font-bold mb-4">
          Start Learning with EduNova Today
        </h2>

        <p className="mb-6">
          Explore assignments, ask questions, and improve your skills.
        </p>

        <button className="bg-white text-[#9caf88] px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
          Get Started
        </button>
      </div>

    </div>
  );
};

export default About;