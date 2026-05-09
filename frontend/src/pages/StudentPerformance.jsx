import React from "react";
import StudentDailyPerformance from "./StudentDailyPerformance";
import StudentWeeklyPerformance from "./StudentWeeklyPerformance";
import StudentSubjectStats from "./StudentSubjectStats";

const StudentPerformance = () => {
  return (
    <div className="min-h-screen bg-[#dfe6da] pt-24 px-6">

      <div className="max-w-6xl mx-auto space-y-10">

        <h2 className="text-3xl font-bold text-[#758467] text-center">
          📊 Student Performance
        </h2>

        <StudentDailyPerformance />

        <StudentWeeklyPerformance />

        <StudentSubjectStats />

      </div>

    </div>
  );
};

export default StudentPerformance;