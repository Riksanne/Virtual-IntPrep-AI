import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import { 
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import Scorecard from "@/components/Scorecard";
import { Zap, Target, Lightbulb } from "lucide-react";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id || "",
  });

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user?.name || ""}
        userId={user?.id}
        interviewId={id}
        type="interview"
        questions={interview.questions}
        feedbackId={feedback?.id}
      />

      {feedback && (
        <section className="flex flex-col gap-12 mt-8 animate-fadeIn">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Interview <span className="text-primary-200">Results</span>
            </h2>
            <p className="text-light-100">
              Below is the comprehensive analysis of your performance during this session.
            </p>
          </div>

          <hr className="border-white/5" />

          {/* Full Scorecard */}
          <Scorecard totalScore={feedback.totalScore} categoryScores={feedback.categoryScores} />

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
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-dark-200/30 border border-white/5">
                    <div className="size-1.5 rounded-full bg-success-100 shrink-0 shadow-[0_0_8px_rgba(73,222,80,0.5)]" />
                    <p className="text-white font-medium">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Opportunities */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-200/10 text-primary-200">
                  <Target className="size-6" />
                </div>
                <h3 className="text-2xl font-bold">Growth Opportunities</h3>
              </div>
              <div className="grid gap-3">
                {feedback.areasForImprovement.map((area, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-dark-200/30 border border-white/5">
                    <div className="size-1.5 rounded-full bg-primary-200 shrink-0 shadow-[0_0_8px_rgba(202,197,254,0.5)]" />
                    <p className="text-white font-medium">{area}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Improvement Tips Quote */}
          {feedback.improvementTips && feedback.improvementTips.length > 0 && (
            <div className="flex flex-col gap-6 p-8 md:p-10 rounded-[2.5rem] blue-gradient-dark border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="size-8 text-primary-200" />
                <h3 className="text-2xl font-bold text-white">Actionable Tips</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedback.improvementTips.map((tip, index) => (
                  <div key={index} className="p-5 rounded-2xl bg-dark-300/50 border border-white/5 italic text-light-100 text-sm leading-relaxed">
                    &quot;{tip}&quot;
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default InterviewDetails;
