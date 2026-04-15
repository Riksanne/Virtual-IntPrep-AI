"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();

  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || userName[0]?.toUpperCase() || "?";

  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Use refs for values used inside async callbacks to avoid stale closures
  const messagesRef = useRef<SavedMessage[]>([]);
  const isGeneratingRef = useRef(false);
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript,
        };
        messagesRef.current = [...messagesRef.current, newMessage];
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error("Vapi Error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  // Separate effect ONLY for call end — no isGenerating in deps
  useEffect(() => {
    if (callStatus !== CallStatus.FINISHED) return;

    if (type === "generate") {
      router.push("/");
      return;
    }

    // Prevent double invocation
    if (isGeneratingRef.current || hasGeneratedRef.current) return;
    isGeneratingRef.current = true;

    const generateFeedback = async () => {
      // Wait for Vapi to flush all final transcript packets
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const transcript = messagesRef.current;
      console.log(
        "Generating feedback with transcript length:",
        transcript.length
      );

      if (!userId || !interviewId || transcript.length === 0) {
        console.warn("Missing data for feedback. Redirecting...");
        router.push("/");
        return;
      }

      setIsGenerating(true);

      try {
        const result = await createFeedback({
          interviewId,
          userId,
          transcript,
          feedbackId,
        });

        console.log("createFeedback result:", result);

        if (result.success) {
          hasGeneratedRef.current = true;
          console.log("Feedback saved! Redirecting to dashboard...");
        } else {
          const errResult = result as any;
          console.error("Feedback save failed. Server error:", errResult.error || "No error message returned");
        }
      } catch (err) {
        console.error("Exception during createFeedback:", err);
      } finally {
        setIsGenerating(false);
        isGeneratingRef.current = false;
        router.push("/");
      }
    };

    generateFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <div className="size-[120px] rounded-full bg-gradient-to-br from-primary-200/80 to-primary-200/30 flex items-center justify-center text-dark-100 font-bold text-4xl shrink-0 overflow-hidden border-4 border-primary-200/20 shadow-xl shadow-primary-200/5">
              {initials}
            </div>
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center gap-4 my-8">
          <div className="size-12 rounded-full border-2 border-t-primary-200 border-white/10 animate-spin" />
          <p className="text-primary-200 font-bold uppercase tracking-widest text-[10px]">
            Analyzing your performance...
          </p>
          <p className="text-light-100 text-xs opacity-60">
            This may take a moment. Please don&apos;t close this page.
          </p>
        </div>
      )}

      {messages.length > 0 && !isGenerating && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button
            className="relative btn-call"
            onClick={() => handleCall()}
            disabled={isGenerating}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
