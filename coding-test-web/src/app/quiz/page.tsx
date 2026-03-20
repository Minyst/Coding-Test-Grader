"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Problem, TestResult } from "@/lib/types";
import CodeEditor from "@/components/CodeEditor";
import {
  getTodayKey,
  getDailyResult,
  saveDailyResult,
  getMonthResults,
  getWrongAnswers,
  removeWrongAnswer,
  type QuizAnswer,
  type DailyQuizResult,
  type WrongAnswer,
} from "@/lib/quiz-storage";

type Tab = "quiz" | "calendar" | "wrong";

export default function QuizPage() {
  const [tab, setTab] = useState<Tab>("quiz");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [quizProblems, setQuizProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayDone, setTodayDone] = useState(false);
  const [todayResult, setTodayResult] = useState<DailyQuizResult | null>(null);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCodes, setUserCodes] = useState<string[]>(["", "", ""]);
  const [results, setResults] = useState<(boolean | null)[]>([null, null, null]);
  const [grading, setGrading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);

  // Calendar state
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
  const [monthResults, setMonthResults] = useState<Record<string, DailyQuizResult>>({});

  // Wrong answers
  const [wrongAnswers, setWrongAnswers] = useState<Record<string, WrongAnswer>>({});
  const [expandedWrong, setExpandedWrong] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("problems")
      .select("*")
      .not("test_cases", "is", null)
      .then(({ data }) => {
        const all = data || [];
        setProblems(all);

        const today = getTodayKey();
        const existing = getDailyResult(today);
        if (existing) {
          setTodayDone(true);
          setTodayResult(existing);
        } else if (all.length >= 3) {
          // 랜덤 3문제 선택
          const shuffled = [...all].sort(() => Math.random() - 0.5);
          setQuizProblems(shuffled.slice(0, 3));
        } else {
          setQuizProblems(all.slice(0, 3));
        }

        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setMonthResults(getMonthResults(calYear, calMonth));
  }, [calYear, calMonth]);

  useEffect(() => {
    setWrongAnswers(getWrongAnswers());
  }, [tab]);

  const loadPyodide = useCallback(async () => {
    if (pyodideReady) return;
    const { getPyodide } = await import("@/lib/pyodide-runner");
    await getPyodide();
    setPyodideReady(true);
  }, [pyodideReady]);

  const handleGradeOne = async (index: number) => {
    const problem = quizProblems[index];
    const code = userCodes[index];
    if (!problem || !code.trim() || !problem.test_cases) return;

    setGrading(true);
    try {
      if (!pyodideReady) await loadPyodide();
      const { runTestCases } = await import("@/lib/test-runner");
      const runResult = await runTestCases(code, problem.test_cases);
      const newResults = [...results];
      newResults[index] = runResult.passed;
      setResults(newResults);

      // 마지막 문제까지 채점 완료 확인
      const allDone = newResults.every((r) => r !== null);
      if (allDone) {
        finishQuiz(newResults as boolean[], code);
      }
    } catch {
      const newResults = [...results];
      newResults[index] = false;
      setResults(newResults);
    } finally {
      setGrading(false);
    }
  };

  const finishQuiz = (finalResults: boolean[], _lastCode?: string) => {
    const today = getTodayKey();
    const answers: QuizAnswer[] = quizProblems.map((p, i) => ({
      problemId: p.id,
      problemTitle: p.title,
      category: p.category,
      correct: finalResults[i],
      userCode: userCodes[i],
      answerCode: p.code,
    }));
    const result: DailyQuizResult = {
      date: today,
      answers,
      completedAt: new Date().toISOString(),
    };
    saveDailyResult(result);
    setTodayDone(true);
    setTodayResult(result);
    setQuizFinished(true);
  };

  const handleFinishQuiz = () => {
    // 남은 미채점 문제는 오답 처리
    const finalResults = results.map((r) => r === true);
    finishQuiz(finalResults);
  };

  // Calendar helpers
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth - 1, 1).getDay();
  const calDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padDays = Array.from({ length: firstDayOfWeek }, () => 0);

  const prevMonth = () => {
    if (calMonth === 1) { setCalYear(calYear - 1); setCalMonth(12); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 12) { setCalYear(calYear + 1); setCalMonth(1); }
    else setCalMonth(calMonth + 1);
  };

  if (loading) return <div className="py-20 text-center text-gray-500">로딩 중...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Daily Quiz</h1>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["quiz", "calendar", "wrong"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {t === "quiz" ? "오늘의 퀴즈" : t === "calendar" ? "달력" : "오답노트"}
          </button>
        ))}
      </div>

      {/* Quiz Tab */}
      {tab === "quiz" && (
        <div className="space-y-6">
          {todayDone && todayResult ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 text-center">
                <p className="text-xl font-bold">오늘의 퀴즈 완료!</p>
                <p className="mt-2 text-gray-400">
                  {todayResult.answers.filter((a) => a.correct).length} / {todayResult.answers.length} 정답
                </p>
              </div>
              {todayResult.answers.map((ans, i) => (
                <div
                  key={ans.problemId}
                  className={`rounded-xl border p-4 ${
                    ans.correct ? "border-green-700 bg-green-900/20" : "border-red-700 bg-red-900/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {i + 1}. {ans.problemTitle}
                    </span>
                    <span className={`text-sm font-bold ${ans.correct ? "text-green-400" : "text-red-400"}`}>
                      {ans.correct ? "정답" : "오답"}
                    </span>
                  </div>
                  <span className="mt-1 inline-block rounded-full bg-gray-700/50 px-2 py-0.5 text-xs text-gray-400">
                    {ans.category}
                  </span>
                </div>
              ))}
            </div>
          ) : quizProblems.length === 0 ? (
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 text-center">
              <p className="text-gray-400">테스트케이스가 있는 문제가 부족합니다.</p>
            </div>
          ) : (
            <>
              {/* Progress */}
              <div className="flex items-center gap-3">
                {quizProblems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                      results[i] === true
                        ? "bg-green-600 text-white"
                        : results[i] === false
                        ? "bg-red-600 text-white"
                        : currentIndex === i
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <span className="ml-auto text-sm text-gray-400">
                  {results.filter((r) => r !== null).length} / 3 채점됨
                </span>
              </div>

              {/* Current Problem */}
              {quizProblems[currentIndex] && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
                    <h2 className="text-xl font-bold">{quizProblems[currentIndex].title}</h2>
                    <div className="mt-2 flex gap-2">
                      <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs text-blue-400">
                        {quizProblems[currentIndex].category}
                      </span>
                      <span className="rounded-full bg-yellow-500/15 px-3 py-1 text-xs text-yellow-400">
                        {quizProblems[currentIndex].difficulty}
                      </span>
                    </div>
                    {quizProblems[currentIndex].description && (
                      <p className="mt-3 text-sm text-gray-400">{quizProblems[currentIndex].description}</p>
                    )}
                  </div>

                  <CodeEditor
                    value={userCodes[currentIndex]}
                    onChange={(v) => {
                      const next = [...userCodes];
                      next[currentIndex] = v;
                      setUserCodes(next);
                    }}
                    placeholder="여기에 코드를 작성하세요..."
                    readOnly={results[currentIndex] !== null}
                  />

                  {results[currentIndex] === null ? (
                    <button
                      onClick={() => handleGradeOne(currentIndex)}
                      disabled={grading || !userCodes[currentIndex].trim()}
                      className="w-full rounded-xl bg-black border border-gray-700 py-3 text-lg font-bold text-white hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {grading ? "채점 중..." : "채점하기"}
                    </button>
                  ) : (
                    <div
                      className={`rounded-xl border p-4 text-center font-bold ${
                        results[currentIndex] ? "border-green-700 bg-green-900/20 text-green-400" : "border-red-700 bg-red-900/20 text-red-400"
                      }`}
                    >
                      {results[currentIndex] ? "정답입니다!" : "오답입니다"}
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex gap-3">
                    {currentIndex > 0 && (
                      <button
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        className="flex-1 rounded-lg bg-gray-800 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        이전 문제
                      </button>
                    )}
                    {currentIndex < 2 && (
                      <button
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                        className="flex-1 rounded-lg bg-gray-800 py-2 text-sm font-semibold text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        다음 문제
                      </button>
                    )}
                  </div>

                  {/* Finish button when all graded or want to finish early */}
                  {results.every((r) => r !== null) && !quizFinished && (
                    <button
                      onClick={handleFinishQuiz}
                      className="w-full rounded-xl bg-blue-600 py-3 text-lg font-bold text-white hover:bg-blue-500 transition-colors"
                    >
                      퀴즈 완료
                    </button>
                  )}
                  {results.some((r) => r !== null) && !results.every((r) => r !== null) && (
                    <button
                      onClick={handleFinishQuiz}
                      className="w-full rounded-xl bg-gray-700 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-600 transition-colors"
                    >
                      나머지 문제 건너뛰고 완료
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Calendar Tab */}
      {tab === "calendar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="rounded-lg bg-gray-800 px-3 py-1 text-sm text-gray-300 hover:bg-gray-700">
              ←
            </button>
            <span className="text-lg font-bold">{calYear}년 {calMonth}월</span>
            <button onClick={nextMonth} className="rounded-lg bg-gray-800 px-3 py-1 text-sm text-gray-300 hover:bg-gray-700">
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm">
            {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
              <div key={d} className="py-2 text-gray-500 font-medium">{d}</div>
            ))}
            {padDays.map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {calDays.map((day) => {
              const dateStr = `${calYear}-${String(calMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const result = monthResults[dateStr];
              const isToday = dateStr === getTodayKey();
              const correctCount = result?.answers.filter((a) => a.correct).length ?? 0;
              const totalCount = result?.answers.length ?? 0;

              return (
                <div
                  key={day}
                  className={`relative rounded-lg py-2 text-sm ${
                    isToday ? "ring-2 ring-blue-500" : ""
                  } ${result ? "bg-gray-800" : ""}`}
                >
                  <span className={isToday ? "font-bold text-blue-400" : "text-gray-300"}>
                    {day}
                  </span>
                  {result && (
                    <div className="mt-0.5 text-xs">
                      <span className={correctCount === totalCount ? "text-green-400" : correctCount > 0 ? "text-yellow-400" : "text-red-400"}>
                        {correctCount}/{totalCount}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected date details */}
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">이번 달 기록</h3>
            {Object.keys(monthResults).length === 0 ? (
              <p className="text-sm text-gray-500">이번 달 퀴즈 기록이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(monthResults)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([date, r]) => (
                    <div key={date} className="flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2 text-sm">
                      <span className="text-gray-300">{date}</span>
                      <div className="flex gap-2">
                        {r.answers.map((a, i) => (
                          <span
                            key={i}
                            className={`rounded px-2 py-0.5 text-xs ${
                              a.correct ? "bg-green-900/50 text-green-400" : "bg-red-900/50 text-red-400"
                            }`}
                          >
                            {a.problemTitle.length > 15 ? a.problemTitle.slice(0, 15) + "..." : a.problemTitle}
                            {a.correct ? " ✓" : " ✗"}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Wrong Answers Tab */}
      {tab === "wrong" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">오답노트</h2>
          {Object.keys(wrongAnswers).length === 0 ? (
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 text-center">
              <p className="text-gray-400">틀린 문제가 없습니다. 대단해요!</p>
            </div>
          ) : (
            Object.values(wrongAnswers)
              .sort((a, b) => b.lastDate.localeCompare(a.lastDate))
              .map((w) => (
                <div key={w.problemId} className="rounded-xl border border-gray-700 bg-gray-900 overflow-hidden">
                  <button
                    onClick={() => setExpandedWrong(expandedWrong === w.problemId ? null : w.problemId)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-white">{w.problemTitle}</span>
                      <div className="mt-1 flex gap-2">
                        <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-blue-400">{w.category}</span>
                        <span className="text-xs text-gray-500">마지막 오답: {w.lastDate}</span>
                      </div>
                    </div>
                    <span className="text-gray-500">{expandedWrong === w.problemId ? "▲" : "▼"}</span>
                  </button>
                  {expandedWrong === w.problemId && (
                    <div className="border-t border-gray-700 p-4 space-y-3">
                      <div>
                        <span className="text-sm font-semibold text-red-400">내가 작성한 코드</span>
                        <pre className="mt-1 rounded-lg bg-black p-3 text-sm text-gray-300 overflow-x-auto">
                          {w.userCode || "(코드 없음)"}
                        </pre>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-green-400">정답 코드</span>
                        <pre className="mt-1 rounded-lg bg-black p-3 text-sm text-gray-300 overflow-x-auto">
                          {w.answerCode}
                        </pre>
                      </div>
                      <button
                        onClick={() => {
                          removeWrongAnswer(w.problemId);
                          setWrongAnswers(getWrongAnswers());
                        }}
                        className="rounded-lg bg-gray-700 px-3 py-1 text-xs text-gray-300 hover:bg-gray-600 transition-colors"
                      >
                        오답노트에서 제거
                      </button>
                    </div>
                  )}
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
}
