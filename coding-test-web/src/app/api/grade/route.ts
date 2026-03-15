import { NextRequest, NextResponse } from "next/server";
import { gradeSubmission, getDiffLines } from "@/lib/grading";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const { problemId, userCode, answerCode } = await request.json();

  const result = gradeSubmission(userCode, answerCode);
  const diff = getDiffLines(userCode, answerCode);

  // Save submission to Supabase
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  await supabase.from("submissions").insert({
    problem_id: problemId,
    user_code: userCode,
    similarity_score: result.similarity,
    is_correct: result.isCorrect,
  });

  return NextResponse.json({ ...result, diff });
}
