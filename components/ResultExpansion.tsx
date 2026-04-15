"use client";

import React, { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./ui/button";

interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

interface Feedback {
  totalScore: number;
  categoryScores: CategoryScore[];
  strengths: string[];
  areasForImprovement: string[];
  improvementTips: string[];
  finalAssessment: string;
}

interface ResultExpansionProps {
  feedback: Feedback | null;
  interviewId: string;
}

const ResultExpansion = ({ feedback, interviewId }: ResultExpansionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col w-full mt-4">
      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-12 rounded-xl font-bold flex items-center justify-between px-6 transition-all duration-300",
          isOpen ? "bg-primary-200 text-dark-100" : "bg-dark-200 text-primary-200 hover:bg-dark-300 border border-primary-200/20"
        )}
      >
        <span className="flex items-center gap-2">
          <Zap className={cn("size-4", isOpen ? "text-dark-100" : "text-primary-200")} />
          Interview Result
        </span>
        {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </Button>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-6 p-6 rounded-2xl bg-dark-300/50 border border-white/5 animate-fadeIn">
          {feedback ? (
            <>
              {/* Quick Review */}
              <div className="flex flex-col gap-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary-200/60">Overall Review</p>
                <p className="text-sm text-light-100 italic leading-relaxed">
                  &quot;{feedback.finalAssessment}&quot;
                </p>
              </div>

              {feedback.categoryScores && <hr className="border-white/5" />}

              {/* Mini Scorecard */}
              {feedback.categoryScores && (
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-200/60">Scorecard</p>
                  <div className="grid grid-cols-1 gap-3">
                    {feedback.categoryScores.map((cat, i) => (
                      <div key={i} className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-light-400 font-medium">{cat.name}</span>
                          <span className="text-white font-bold">{cat.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-dark-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-200 transition-all duration-1000"
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {feedback.improvementTips && <hr className="border-white/5" />}

              {/* Improvement Suggestions */}
              {feedback.improvementTips && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="size-4 text-primary-200" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary-200/60">Improvement Suggestions</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {feedback.improvementTips.slice(0, 2).map((tip, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <span className="text-primary-200 text-xs mt-0.5">•</span>
                        <p className="text-xs text-light-100 leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="p-3 rounded-full bg-dark-200 text-primary-200/50">
                <Zap className="size-8" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="font-bold text-white uppercase text-xs tracking-wider">No Results Yet</p>
                <p className="text-xs text-light-100 leading-relaxed max-w-[200px]">
                  Finish an interview to generate your personalized scorecard and review.
                </p>
              </div>
              <Button asChild className="btn-primary w-full h-10 text-xs mt-2">
                <Link href={`/interview/${interviewId}`}>
                  Start Interview Now
                </Link>
              </Button>
            </div>
          )}

          {feedback && (
            <Button asChild className="mt-2 w-full btn-primary h-10 text-xs text-white">
              <Link href={`/interview/${interviewId}/feedback`}>
                View Full Analysis Table
                <ArrowRight className="size-3 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultExpansion;
