"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Problem, TestResult } from "@/lib/types";
import type { GradeResult as GradeResultType } from "@/lib/grading";
import CodeEditor from "@/components/CodeEditor";
import GradeResult from "@/components/GradeResult";
import ProblemEditForm from "@/components/ProblemEditForm";

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [userCode, setUserCode] = useState("");
  const [result, setResult] = useState<(GradeResultType & { testResults: TestResult[] }) | null>(null);
  const [grading, setGrading] = useState(false);
  const [running, setRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [pyodideLoading, setPyodideLoading] = useState(false);
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

  // Pyodide 사전 로드
  const loadPyodide = useCallback(async () => {
    if (pyodideReady || pyodideLoading) return;
    setPyodideLoading(true);
    try {
      const { getPyodide } = await import("@/lib/pyodide-runner");
      await getPyodide();
      setPyodideReady(true);
    } catch {
      console.error("Pyodide 로드 실패");
    } finally {
      setPyodideLoading(false);
    }
  }, [pyodideReady, pyodideLoading]);

  useEffect(() => {
    if (problem) loadPyodide();
  }, [problem, loadPyodide]);

  // 코드 실행 (디버깅용)
  const handleRun = async () => {
    if (!userCode.trim()) return;
    setRunning(true);
    setRunOutput(null);
    try {
      if (!pyodideReady) await loadPyodide();
      const { executeCode } = await import("@/lib/test-runner");
      const res = await executeCode(userCode);
      if (res.error) {
        setRunOutput(`❌ 에러:\n${res.error}`);
      } else {
        setRunOutput(res.stdout || "(출력 없음)");
      }
    } catch {
      setRunOutput("❌ 실행 중 오류가 발생했습니다.");
    } finally {
      setRunning(false);
    }
  };

  // 채점
  const handleGrade = async () => {
    if (!problem || !userCode.trim()) return;
    if (!problem.test_cases) {
      alert("이 문제에는 아직 테스트케이스가 없습니다.");
      return;
    }

    setGrading(true);
    setResult(null);
    setRunOutput(null);

    try {
      if (!pyodideReady) await loadPyodide();
      const { runTestCases } = await import("@/lib/test-runner");
      const { gradeByTestResults } = await import("@/lib/grading");

      const runResult = await runTestCases(userCode, problem.test_cases);
      const gradeResult = gradeByTestResults(runResult.testResults);

      setResult({ ...gradeResult, testResults: runResult.testResults });

      // 서버에 결과 저장
      await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemId: problem.id,
          userCode,
          testResults: runResult.testResults,
          passedCount: runResult.passedCount,
          totalCount: runResult.totalCount,
          isCorrect: runResult.passed,
        }),
      });
    } catch {
      alert("채점 중 오류가 발생했습니다.");
    } finally {
      setGrading(false);
    }
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
            {!problem.test_cases && (
              <span className="rounded-full bg-gray-500/15 px-3 py-1 text-sm text-gray-400">
                테스트케이스 없음
              </span>
            )}
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

      {/* Problem Images */}
      {problem.images && problem.images.length > 0 && (
        <div className="space-y-3">
          {problem.images.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`문제 이미지 ${i + 1}`}
              className="rounded-lg max-w-full border border-gray-700"
            />
          ))}
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

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleRun}
          disabled={running || !userCode.trim()}
          className="flex-1 rounded-xl bg-black border border-gray-700 py-4 text-lg font-bold text-white transition-all hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {running ? "실행 중..." : "▶ 실행하기"}
        </button>
        <button
          onClick={handleGrade}
          disabled={grading || !userCode.trim() || !problem.test_cases}
          className="flex-1 rounded-xl bg-black border border-gray-700 py-4 text-lg font-bold text-white transition-all hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {grading ? "채점 중..." : "채점하기"}
        </button>
      </div>

      {/* Run Output */}
      {runOutput !== null && (
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <p className="mb-2 text-sm font-medium text-gray-400">실행 결과</p>
          <pre className="text-sm text-green-300 font-mono whitespace-pre-wrap">{runOutput}</pre>
        </div>
      )}

      {/* Grade Result */}
      {result && (
        <GradeResult
          grade={result.grade}
          message={result.message}
          emoji={result.emoji}
          passedCount={result.passedCount}
          totalCount={result.totalCount}
          testResults={result.testResults}
          answerCode={problem.code}
        />
      )}
    </div>
  );
}
