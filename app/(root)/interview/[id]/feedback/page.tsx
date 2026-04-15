import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  CheckCircle2, 
  ChevronLeft, 
  RotateCcw, 
  Target, 
  Zap, 
  Lightbulb,
  Calendar
} from "lucide-react";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Scorecard from "@/components/Scorecard";
import { cn } from "@/lib/utils";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id || "",
  });

  if (!feedback) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="p-6 rounded-full bg-dark-200 animate-pulse">
          <RotateCcw className="size-12 text-primary-200" />
        </div>
        <h2 className="text-2xl font-bold">No feedback found yet</h2>
        <p className="text-light-100 italic">Processing your interview evaluation...</p>
        <Button className="btn-primary" asChild>
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <section className="section-feedback animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Interview <span className="text-primary-200">Analysis</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-3 py-1 rounded-full bg-dark-200 text-sm font-bold text-light-100 border border-white/5">
              {interview.role}
            </span>
            <div className="flex items-center gap-1.5 text-light-400 text-sm">
              <Calendar className="size-4" />
              {dayjs(feedback.createdAt).format("MMM D, YYYY • h:mm A")}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="btn-secondary group" asChild>
            <Link href="/">
              <ChevronLeft className="size-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Dashboard
            </Link>
          </Button>
          <Button className="btn-primary group" asChild>
            <Link href={`/interview/${id}`}>
              <RotateCcw className="size-4 mr-2 group-hover:rotate-45 transition-transform" />
              Retake
            </Link>
          </Button>
        </div>
      </div>

      <hr className="border-white/5" />

      {/* Scorecard Component */}
      <Scorecard totalScore={feedback.totalScore} categoryScores={feedback.categoryScores} />

      {/* Final Assessment Quote */}
      <div className="relative p-10 rounded-3xl bg-dark-200/50 border border-white/5 italic text-xl md:text-2xl text-light-100 text-center shadow-inner">
        <span className="absolute top-4 left-6 text-6xl text-primary-200/20 font-serif">&quot;</span>
        {feedback.finalAssessment}
        <span className="absolute bottom-0 right-6 text-6xl text-primary-200/20 font-serif">&quot;</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success-100/10 text-success-100">
              <Zap className="size-6" />
            </div>
            <h3 className="text-2xl font-bold">Key Strengths</h3>
          </div>
          <div className="grid gap-3">
            {feedback.strengths.map((strength, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 rounded-2xl bg-dark-200/30 border border-white/5 hover:bg-dark-200/50 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CheckCircle2 className="size-5 text-success-100 shrink-0" />
                <p className="text-white font-medium">{strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-200/10 text-primary-200">
              <Target className="size-6" />
            </div>
            <h3 className="text-2xl font-bold">Growth Opportunities</h3>
          </div>
          <div className="grid gap-3">
            {feedback.areasForImprovement.map((area, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 p-4 rounded-2xl bg-dark-200/30 border border-white/5 hover:bg-dark-200/50 transition-colors"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="size-2 rounded-full bg-primary-200 shrink-0 shadow-[0_0_10px_rgba(202,197,254,0.5)]" />
                <p className="text-white font-medium">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Improvement Tips Section */}
      <div className="flex flex-col gap-6 p-8 md:p-10 rounded-[2.5rem] blue-gradient-dark border-2 border-primary-200/10 shadow-3xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary-200 text-dark-100 shadow-lg shadow-primary-200/20">
            <Lightbulb className="size-7" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Actionable Tips</h3>
            <p className="text-sm text-primary-200 font-bold uppercase tracking-widest leading-none mt-1">For your next session</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {feedback.improvementTips?.map((tip, index) => (
            <div key={index} className="flex gap-4 p-5 rounded-3xl bg-dark-300/40 border border-white/5">
              <span className="flex items-center justify-center size-8 rounded-full bg-dark-200 text-primary-200 font-bold text-sm shrink-0 border border-white/10">
                {index + 1}
              </span>
              <p className="text-light-100 text-[15px] leading-relaxed italic">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col items-center gap-6 mt-12 py-10 border-t border-white/5">
        <h2 className="text-3xl font-bold text-white text-center">Ready for another round?</h2>
        <p className="text-light-100 text-center max-w-xl">
          Consistency is key to mastering interviews. Take another mock interview to put these tips into practice immediately.
        </p>
        <div className="flex gap-4">
          <Button className="btn-secondary h-12 px-8" asChild>
            <Link href="/">Back to Dashboard</Link>
          </Button>
          <Button className="btn-primary h-12 px-8" asChild>
            <Link href={`/interview/${id}`}>Retake Interview</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
