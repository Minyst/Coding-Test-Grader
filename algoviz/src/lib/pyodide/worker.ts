// Pyodide Web Worker
// 브라우저에서 Python 코드를 안전하게 실행합니다.

/* eslint-disable no-restricted-globals */

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (text: string) => void }) => void;
  setStderr: (options: { batched: (text: string) => void }) => void;
}

interface WorkerSelf {
  loadPyodide: (config: { indexURL: string }) => Promise<PyodideInterface>;
  importScripts: (...urls: string[]) => void;
  onmessage: ((event: MessageEvent) => void) | null;
  postMessage: (message: unknown) => void;
}

const ctx = self as unknown as WorkerSelf;

let pyodide: PyodideInterface | null = null;

async function loadPyodideRuntime() {
  if (pyodide) return pyodide;

  ctx.importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
  pyodide = await ctx.loadPyodide({
    indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
  });

  return pyodide;
}

ctx.onmessage = async (event: MessageEvent) => {
  const { type, code, testCases, timeLimit = 10000 } = event.data;

  try {
    const py = await loadPyodideRuntime();

    if (type === 'execute') {
      let output = '';
      py.setStdout({ batched: (text: string) => { output += text + '\n'; } });
      py.setStderr({ batched: (text: string) => { output += '[Error] ' + text + '\n'; } });

      const start = performance.now();

      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('시간 초과 (10초)')), timeLimit)
      );

      await Promise.race([
        py.runPythonAsync(code),
        timeout,
      ]);

      const elapsed = performance.now() - start;

      ctx.postMessage({
        type: 'result',
        output: output.trim(),
        executionTimeMs: Math.round(elapsed),
      });
    } else if (type === 'judge') {
      const results: Array<{
        passed: boolean;
        input: string;
        expected: string;
        actual: string;
        executionTimeMs: number;
      }> = [];

      for (const tc of testCases) {
        let output = '';
        py.setStdout({ batched: (text: string) => { output += text + '\n'; } });
        py.setStderr({ batched: () => {} });

        const wrappedCode = `
import sys
from io import StringIO
sys.stdin = StringIO(${JSON.stringify(tc.input)})
${code}
`;
        const start = performance.now();
        try {
          await Promise.race([
            py.runPythonAsync(wrappedCode),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('시간 초과')), timeLimit)
            ),
          ]);
          const elapsed = performance.now() - start;
          const actual = output.trim();
          const expected = tc.expectedOutput.trim();

          results.push({
            passed: actual === expected,
            input: tc.input,
            expected,
            actual,
            executionTimeMs: Math.round(elapsed),
          });
        } catch (err) {
          results.push({
            passed: false,
            input: tc.input,
            expected: tc.expectedOutput.trim(),
            actual: `Error: ${err instanceof Error ? err.message : String(err)}`,
            executionTimeMs: 0,
          });
        }
      }

      ctx.postMessage({ type: 'judge-result', results });
    }
  } catch (err) {
    ctx.postMessage({
      type: 'error',
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
