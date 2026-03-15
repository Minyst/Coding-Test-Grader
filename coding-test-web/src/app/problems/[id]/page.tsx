"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Problem } from "@/lib/types";
import CodeEditor from "@/components/CodeEditor";
import CodeBlock from "@/components/CodeBlock";
import GradeResult from "@/components/GradeResult";
import ProblemEditForm from "@/components/ProblemEditForm";
import type { Change } from "diff";

interface GradeResponse {
  similarity: number;
  isCorrect: boolean;
  grade: "perfect" | "close" | "partial" | "wrong";
  message: string;
  emoji: string;
  diff: Change[];
}

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userCode, setUserCode] = useState("");
  const [result, setResult] = useState<GradeResponse | null>(null);
  const [grading, setGrading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "", category: "", difficulty: "", code: "", description: "", notes: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("problems")
      .select("*")
      .eq("id", params.id)
      .single()
      .then(({ data }) => {
        setProblem(data);
        if (data) {
          setEditForm({
            title: data.title,
            category: data.category,
            difficulty: data.difficulty,
            code: data.code,
            description: data.description || "",
            notes: data.notes || "",
          });
        }
        setLoading(false);
      });
  }, [params.id]);

  const handleGrade = async () => {
    if (!problem || !userCode.trim()) return;
    setGrading(true);
    setResult(null);

    const res = await fetch("/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        problemId: problem.id,
        userCode,
        answerCode: problem.code,
      }),
    });

    const data = await res.json();
    setResult(data);
    setGrading(false);
  };

  const handleDelete = async () => {
    if (!problem || !confirm("정말 삭제하시겠습니까?")) return;
    const supabase = createClient();
    await supabase.from("problems").delete().eq("id", problem.id);
    router.push("/");
  };

  const handleUpdate = async () => {
    if (!problem) return;
    const supabase = createClient();
    await supabase.from("problems").update({
      ...editForm,
      notes: editForm.notes || null,
      description: editForm.description || null,
    }).eq("id", problem.id);
    setProblem({ ...problem, ...editForm });
    setIsEditing(false);
  };

  if (loading) return <div className="py-20 text-center text-gray-500">로딩 중...</div>;
  if (!problem) return <div className="py-20 text-center text-gray-500">문제를 찾을 수 없습니다</div>;

  if (isEditing) {
    return (
      <ProblemEditForm
        title="문제 수정"
        form={editForm}
        onChange={setEditForm}
        onSave={handleUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{problem.title}</h1>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-blue-500/15 px-3 py-1 text-sm text-blue-400">
              {problem.category}
            </span>
            <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-sm text-yellow-400">
              {problem.difficulty}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-blue-200 border border-blue-300 px-4 py-2 text-sm text-blue-900 hover:bg-blue-300 hover:border-blue-400 transition-colors font-medium"
          >
            수정
          </button>
          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-200 border border-red-300 px-4 py-2 text-sm text-red-900 hover:bg-red-300 hover:border-red-400 transition-colors font-medium"
          >
            삭제
          </button>
        </div>
      </div>

      {/* Problem Description */}
      {problem.description && (
        <div className="rounded-xl border border-gray-800 p-5">
          <h2 className="mb-2 text-lg font-semibold">문제</h2>
          <p className="text-gray-300">{problem.description}</p>
          {problem.notes && (
            <p className="mt-2 text-sm text-gray-500 italic">{problem.notes}</p>
          )}
        </div>
      )}

      {/* Code Editor */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">풀이 작성</h2>
        <CodeEditor
          value={userCode}
          onChange={setUserCode}
          placeholder="여기에 코드를 작성하고 채점하기를 누르세요..."
        />
      </div>

      {/* Grade Button */}
      <button
        onClick={handleGrade}
        disabled={grading || !userCode.trim()}
        className="w-full rounded-xl bg-black border border-gray-700 py-4 text-lg font-bold text-white transition-all hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {grading ? "채점 중..." : "채점하기"}
      </button>

      {/* Result */}
      {result && (
        <GradeResult
          similarity={result.similarity}
          grade={result.grade}
          message={result.message}
          emoji={result.emoji}
          diff={result.diff}
          answerCode={problem.code}
        />
      )}
    </div>
  );
}
