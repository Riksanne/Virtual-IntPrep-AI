import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { ResumeUpload } from "@/components/ResumeUpload";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getAllFeedbackByUserId,
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import PerformanceOverview from "@/components/PerformanceOverview";

export const dynamic = "force-dynamic";

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview, allFeedback] = await Promise.all([
    getInterviewsByUserId(user?.id || ""),
    getLatestInterviews({ userId: user?.id || "" }),
    getAllFeedbackByUserId(user?.id || ""),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (allInterview?.length ?? 0) > 0;

  return (
    <>
      <section className="card-cta relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary-200/5 rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col items-center text-center gap-7 max-w-xl mx-auto z-10 w-full">
          <div className="flex flex-col gap-3">
            <h2 className="text-4xl font-extrabold leading-tight">
              Get Interview-Ready with{" "}
              <span className="text-primary-200">AI-Powered</span> Practice &amp; Feedback
            </h2>
            <p className="text-light-400 text-lg">
              Practice real interview questions &amp; get instant AI feedback on your performance.
            </p>
          </div>

          <Button asChild className="btn-primary h-14 px-10 text-base font-bold rounded-2xl shadow-lg shadow-primary-200/20 hover:scale-105 transition-transform duration-200 max-sm:w-full">
            <Link href="/interview" className="flex items-center gap-2">
              🚀 Start an Interview
            </Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={320}
          height={320}
          className="max-lg:hidden shrink-0 z-10"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Upload Your Resume </h2>
        <p className="text-muted-foreground">
          Upload your resume below to have it instantly parsed into structured data for your AI interview.
        </p>
        <ResumeUpload userId={user?.id} />
      </section>

      <PerformanceOverview allFeedback={allFeedback} />

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>

        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedbackSummary={interview.feedbackSummary}
              />
            ))
          ) : (
            <p>You haven&apos;t taken any interviews yet</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take Interviews</h2>

        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user?.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedbackSummary={interview.feedbackSummary}
              />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
