"use client";

import React from "react";
import { 
  MessageSquare, 
  Code, 
  Lightbulb, 
  Users, 
  Zap, 
  Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

interface ScorecardProps {
  totalScore: number;
  categoryScores: CategoryScore[];
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success-100";
  if (score >= 60) return "text-primary-200";
  return "text-destructive-100";
};

const getScoreBg = (score: number) => {
  if (score >= 80) return "bg-success-100";
  if (score >= 60) return "bg-primary-200";
  return "bg-destructive-100";
};

const getCategoryIcon = (name: string) => {
  switch (name) {
    case "Communication Skills":
      return <MessageSquare className="size-5" />;
    case "Technical Knowledge":
      return <Code className="size-5" />;
    case "Problem Solving":
      return <Lightbulb className="size-5" />;
    case "Cultural Fit":
      return <Users className="size-5" />;
    case "Confidence and Clarity":
      return <Zap className="size-5" />;
    default:
      return <Trophy className="size-5" />;
  }
};

const Scorecard = ({ totalScore, categoryScores }: ScorecardProps) => {
  return (
    <div className="flex flex-col gap-10 w-full animate-fadeIn">
      {/* Overall Score Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-3xl blue-gradient-dark border-2 border-primary-200/20 shadow-2xl relative overflow-hidden">
        <div className="z-10 flex flex-col gap-2">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Overall <span className="text-primary-200">Score</span>
          </h2>
          <p className="text-lg text-light-100 max-w-md">
            Your performance was evaluated across multiple dimensions based on the mock interview transcript.
          </p>
        </div>

        <div className="relative flex-center size-48 md:size-56">
          {/* Circular Progress SVG */}
          <svg className="size-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="fill-none stroke-dark-300 stroke-[10]"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              strokeDasharray="283%"
              strokeDashoffset={`${283 - (totalScore / 100) * 283}%`}
              className={cn(
                "fill-none stroke-[10] transition-all duration-1000 ease-out",
                totalScore >= 80 ? "stroke-success-100" : 
                totalScore >= 60 ? "stroke-primary-200" : "stroke-destructive-100"
              )}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={cn("text-5xl md:text-6xl font-black", getScoreColor(totalScore))}>
              {totalScore}
            </span>
            <span className="text-sm font-bold text-light-400 uppercase tracking-widest">
              Out of 100
            </span>
          </div>
        </div>
        
        {/* Background Accent */}
        <div className="absolute -top-10 -left-10 size-40 bg-primary-200/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 size-40 bg-success-100/10 rounded-full blur-3xl" />
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {categoryScores.map((category, index) => (
          <div key={index} className="card-border group cursor-default">
            <div className="dark-gradient rounded-2xl p-6 h-full flex flex-col gap-4 transition-all duration-300 group-hover:bg-dark-300/50">
              <div className="flex items-center justify-between">
                <div className={cn("p-2.5 rounded-lg bg-dark-200 group-hover:scale-110 transition-transform", getScoreColor(category.score))}>
                  {getCategoryIcon(category.name)}
                </div>
                <span className={cn("text-xl font-bold", getScoreColor(category.score))}>
                  {category.score}/100
                </span>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">{category.name}</h4>
                <div className="h-2 w-full bg-dark-200 rounded-full overflow-hidden mb-3">
                  <div 
                    className={cn("h-full transition-all duration-1000 ease-out", getScoreBg(category.score))}
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                <p className="text-sm text-light-100 leading-relaxed line-clamp-3">
                  {category.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Scorecard;
