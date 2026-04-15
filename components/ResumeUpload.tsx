"use client";

import React, { useState } from "react";
import { UploadCloud, FileText, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ParsedResume } from "@/lib/schema/resume";

interface ResumeUploadProps {
  userId?: string;
  onUploadSuccess?: (data: ParsedResume) => void;
}

export function ResumeUpload({ userId, onUploadSuccess }: ResumeUploadProps) {
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file.");
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setParsedData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to parse resume");
      }

      setParsedData(result.data);
      toast.success("Resume parsed! Generating tailored interview...");

      if (onUploadSuccess) {
        onUploadSuccess(result.data);
      }

      if (userId) {
        const genResponse = await fetch("/api/generate-from-resume", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            parsedResume: result.data,
          }),
        });

        const genResult = await genResponse.json();

        if (genResponse.ok && genResult.interviewId) {
          toast.success("Interview generated! Redirecting...");
          router.push(`/interview/${genResult.interviewId}`);
        } else {
          toast.error(genResult.error || "Failed to generate interview questions.");
        }
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong while parsing the resume.");
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          isHovering
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/30 bg-muted/20 hover:bg-muted/40"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          ) : uploadedFile && parsedData ? (
            <CheckCircle className="w-12 h-12 text-green-500" />
          ) : (
            <UploadCloud className="w-12 h-12 text-muted-foreground" />
          )}

          <div>
            <p className="text-lg font-medium">
              {isUploading && !parsedData
                ? "Parsing resume structure..."
                : isUploading && parsedData
                ? "Generating interview..."
                : "Drag & drop your resume here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {isUploading
                ? "This might take a few seconds..."
                : parsedData
                ? uploadedFile?.name
                : "Or click to browse files (PDF only)"}
            </p>
          </div>
        </div>
      </div>

      {/* Render output for demonstration purposes */}
      {parsedData && (
        <div className="bg-muted/30 border border-muted p-6 rounded-xl animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-semibold mb-2">Parsed Candidate Profile</h3>
          <ul className="space-y-2 text-sm">
            <li><strong>Name:</strong> {parsedData.personalInfo.name}</li>
            <li><strong>Target Role:</strong> {parsedData.targetRole}</li>
            <li><strong>Skills:</strong> {parsedData.skills.slice(0, 5).join(", ")}{parsedData.skills.length > 5 ? "..." : ""}</li>
            <li><strong>Experience:</strong> {parsedData.workExperience.length} roles found</li>
            <li><strong>Education:</strong> {parsedData.education.length} degrees found</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-4 italic">{parsedData.summary}</p>
        </div>
      )}
    </div>
  );
}
