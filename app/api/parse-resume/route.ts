import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { resumeSchema } from "@/lib/schema/resume";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }
    
    // Convert Web File to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract structured data using Google Gemini via AI SDK directly with the PDF
    const { object } = await generateObject({
      model: google("gemini-flash-latest"),
      schema: resumeSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an expert technical recruiter and resume parser. Extract the required information from the attached raw resume PDF.
              Return the candidate's personal information, professional summary, work experience, education, skills, and determine the target role they are most suited for based on their background.
              If some information is completely missing, adapt accordingly (leave optional fields empty).`
            },
            {
              type: "file",
              mimeType: "application/pdf",
              data: buffer
            }
          ]
        }
      ]
    });

    return NextResponse.json({ success: true, data: object });
    
  } catch (error: any) {
    console.error("Resume parsing error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse resume using AI Vision" }, { status: 500 });
  }
}
