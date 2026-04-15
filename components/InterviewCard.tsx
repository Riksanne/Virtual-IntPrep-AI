import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { ArrowRight } from "lucide-react";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import ResultExpansion from "./ResultExpansion";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
  feedbackSummary,
}: InterviewCardProps) => {
  // Use denormalized summary if available, otherwise fetch full feedback
  const feedback = feedbackSummary
    ? ({
        totalScore: feedbackSummary.totalScore,
        finalAssessment: feedbackSummary.finalAssessment,
      } as Feedback)
    : userId && interviewId
    ? await getFeedbackByInterviewId({
        interviewId,
        userId,
      })
    : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="card-border w-[360px] max-sm:w-full min-h-96 h-fit">
      <div className="card-interview h-full">
        <div className="absolute top-2 left-2 text-[8px] opacity-30 text-white z-50">v2.1</div>
        <div>
          {/* Type Badge */}
          <div
            className={cn(
              "absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg",
              badgeColor
            )}
          >
            <p className="badge-text ">{normalizedType}</p>
          </div>

          {/* Cover Image */}
          <div className="flex items-center gap-4">
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={60}
              height={60}
              className="rounded-full object-fit size-[60px]"
            />
            <div>
              <h3 className="capitalize text-xl">{role}</h3>
              <div className="flex flex-row gap-4 mt-1 opacity-70">
                <div className="flex flex-row gap-1 items-center">
                  <Image
                    src="/calendar.svg"
                    width={14}
                    height={14}
                    alt="calendar"
                  />
                  <p className="text-xs">{formattedDate}</p>
                </div>

                <div className="flex flex-row gap-1 items-center">
                  <Image src="/star.svg" width={14} height={14} alt="star" />
                  <p className="text-xs font-bold">{feedback?.totalScore || "---"}/100</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <DisplayTechIcons techStack={techstack} />
          </div>

          {/* Feedback/Result Section (Always Visible) */}
          <div className="flex flex-col gap-4">
            <ResultExpansion feedback={feedback as any} interviewId={interviewId!} />
            
            <Button asChild className={cn(
              "w-full h-12 rounded-xl mt-2 flex items-center justify-center gap-2",
              feedback ? "btn-primary" : "bg-dark-200 text-light-100 hover:bg-dark-300 border border-white/5 opacity-50 pointer-events-none"
            )}>
              <Link href={feedback ? `/interview/${interviewId}/feedback` : "#"}>
                <ArrowRight className="size-4" />
                {feedback ? "Full Result Analysis" : "Result Analysis Pending"}
              </Link>
            </Button>
          </div>

          {!feedback && (
            <div className="mt-8 flex flex-col gap-4">
              <Button asChild className="btn-primary w-full h-12 rounded-xl">
                <Link href={`/interview/${interviewId}`} className="flex items-center gap-2">
                  Practice Now
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
