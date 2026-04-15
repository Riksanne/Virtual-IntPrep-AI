import { createFeedback } from "./lib/actions/general.action";

async function main() {
  const result = await createFeedback({
    interviewId: "test-interview-123",
    userId: "test-user-123",
    transcript: [
      { role: "assistant", content: "Tell me about yourself." },
      { role: "user", content: "I am a software engineer." },
    ],
  });
  console.log("Result:", result);
}

main();
