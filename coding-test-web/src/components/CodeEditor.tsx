"use client";

import { useState, useRef, useCallback } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  placeholder = "여기에 코드를 작성하세요...",
  readOnly = false,
}: CodeEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const setCursorPosition = useCallback((pos: number) => {
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = pos;
        textareaRef.current.selectionEnd = pos;
      }
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      if (e.key === "Tab") {
        e.preventDefault();
        const newValue = value.substring(0, start) + "    " + value.substring(end);
        onChange(newValue);
        setCursorPosition(start + 4);
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const beforeCursor = value.substring(0, start);
        const afterCursor = value.substring(end);
        const currentLine = beforeCursor.split("\n").pop() || "";

        // 현재 줄의 들여쓰기 수준 가져오기
        const indent = currentLine.match(/^(\s*)/)?.[1] || "";

        // 콜론(:)으로 끝나면 한 단계 추가 들여쓰기 (def, if, for, while, class, else, elif, try, except, with)
        const trimmedLine = currentLine.trimEnd();
        const extraIndent = trimmedLine.endsWith(":") ? "    " : "";

        const newValue = beforeCursor + "\n" + indent + extraIndent + afterCursor;
        onChange(newValue);
        setCursorPosition(start + 1 + indent.length + extraIndent.length);
      }

      // Backspace로 들여쓰기 한 단계 삭제
      if (e.key === "Backspace" && start === end) {
        const beforeCursor = value.substring(0, start);
        const currentLine = beforeCursor.split("\n").pop() || "";
        if (currentLine.length > 0 && currentLine.trim() === "" && currentLine.length % 4 === 0) {
          e.preventDefault();
          const newValue = value.substring(0, start - 4) + value.substring(end);
          onChange(newValue);
          setCursorPosition(start - 4);
        }
      }
    },
    [value, onChange, setCursorPosition]
  );

  return (
    <div
      className={`relative rounded-lg border ${
        isFocused ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-700"
      } bg-gray-900 transition-all`}
    >
      <div className="flex items-center gap-2 border-b border-gray-700 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs text-gray-400">Python</span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        readOnly={readOnly}
        spellCheck={false}
        className="w-full min-h-[300px] bg-transparent p-4 font-mono text-sm text-green-300 placeholder-gray-600 outline-none resize-y"
        style={{ tabSize: 4 }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
