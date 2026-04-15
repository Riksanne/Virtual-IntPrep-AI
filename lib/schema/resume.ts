import { z } from "zod";

export const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().describe("Candidate's full name"),
    email: z.string().email().optional().describe("Candidate's email address"),
    phone: z.string().optional().describe("Candidate's phone number"),
  }),
  summary: z.string().describe("A brief professional summary of the candidate."),
  education: z.array(
    z.object({
      degree: z.string().describe("Degree name, e.g., Bachelor of Science"),
      institution: z.string().describe("Name of the school or university"),
      graduationYear: z.string().optional().describe("Year of graduation"),
    })
  ).describe("Candidate's educational background"),
  workExperience: z.array(
    z.object({
      role: z.string().describe("Job title"),
      company: z.string().describe("Company name"),
      duration: z.string().describe("Time period worked at the company"),
      description: z.string().describe("Brief description of responsibilities and achievements"),
    })
  ).describe("Candidate's work experience"),
  skills: z.array(z.string()).describe("A flat list of skills the candidate possesses (e.g. React, Python, Project Management)"),
  targetRole: z.string().describe("The most likely role this candidate is applying or suited for, based on the resume (e.g. Frontend Engineer, Product Manager)."),
});

export type ParsedResume = z.infer<typeof resumeSchema>;
