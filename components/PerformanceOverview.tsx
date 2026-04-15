"use client";

import React from "react";
import { 
  BarChart3, 
  Target, 
  TrendingUp,
  History
} from "lucide-react";

interface CategoryScore {
  name: string;
  score: number;
}

interface PerformanceOverviewProps {
  allFeedback: {
    totalScore: number;
    categoryScores: CategoryScore[];
    createdAt: string;
  }[];
}

const PerformanceOverview = ({ allFeedback }: PerformanceOverviewProps) => {
  if (!allFeedback || allFeedback.length === 0) return null;

  const totalInterviews = allFeedback.length;
  const avgScore = Math.round(
    allFeedback.reduce((acc, curr) => acc + curr.totalScore, 0) / totalInterviews
  );

  // Calculate average per category
  const categoryAverages: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  allFeedback.forEach((f) => {
    f.categoryScores.forEach((c) => {
      categoryAverages[c.name] = (categoryAverages[c.name] || 0) + c.score;
      categoryCounts[c.name] = (categoryCounts[c.name] || 0) + 1;
    });
  });

  const sortedCategories = Object.keys(categoryAverages).map((name) => ({
    name,
    score: Math.round(categoryAverages[name] / categoryCounts[name]),
  })).sort((a, b) => b.score - a.score);

  return (
    <section className="flex flex-col gap-6 mt-12 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary-200/10 text-primary-200">
          <BarChart3 className="size-6" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Performance Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stats Cards */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="p-6 rounded-3xl bg-dark-200/50 border border-white/5 flex flex-col gap-2">
            <p className="text-light-400 text-sm font-bold uppercase tracking-wider">Average Score</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-primary-200">{avgScore}</span>
              <span className="text-light-400 font-bold mb-1">/ 100</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-success-100 font-bold">
              <TrendingUp className="size-3" />
              <span>Overall Rating: {avgScore >= 80 ? 'Expert' : avgScore >= 60 ? 'Pro' : 'Starter'}</span>
            </div>
          </div>
          
          <div className="p-6 rounded-3xl bg-dark-200/50 border border-white/5 flex flex-col gap-2">
            <p className="text-light-400 text-sm font-bold uppercase tracking-wider">Interviews</p>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-white">{totalInterviews}</span>
              <span className="text-light-400 font-bold mb-1">Total</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-primary-200 font-bold">
              <History className="size-3" />
              <span>Keep it up!</span>
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="md:col-span-3 p-8 rounded-[2rem] blue-gradient-dark border border-white/10 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Target className="size-5 text-primary-200" />
              Skill Proficiency
            </h3>
            <span className="text-xs font-bold text-primary-200/60 uppercase tracking-widest">Aggregate Data</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {sortedCategories.map((cat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-light-100 font-medium">{cat.name}</span>
                  <span className="text-primary-200 font-bold">{cat.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-dark-300 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-200 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(202,197,254,0.4)]"
                    style={{ width: `${cat.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 size-32 bg-primary-200/5 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default PerformanceOverview;
