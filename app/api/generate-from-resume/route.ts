import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { parsedResume, userId } = await request.json();

    if (!userId || !parsedResume) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const { object } = await generateObject({
      model: google("gemini-flash-latest"),
      schema: z.object({
        questions: z.array(z.string()).describe("An array of exactly 5 interview questions")
      }),
      prompt: `You are an expert technical interviewer.
        A candidate submitted the following resume profile:
        ${JSON.stringify(parsedResume, null, 2)}
        
        Generate exactly 5 highly customized interview questions for this candidate.
        Blend both behavioural and technical questions based specifically on their past "workExperience", their "skills", and their specified "targetRole".
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
      `,
    });

    const interview = {
      role: parsedResume.targetRole || "Unknown Role",
      type: "Mixed (Technical & Behavioural)",
      level: "Resume-Based", 
      techstack: parsedResume.skills || [],
      questions: object.questions,
      userId: userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return Response.json({ success: true, interviewId: docRef.id }, { status: 200 });
  } catch (error: any) {
    console.error("Error generating interview from resume:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
