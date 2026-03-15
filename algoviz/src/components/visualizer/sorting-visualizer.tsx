'use client';

import { motion } from 'framer-motion';
import { useVisualizerStore } from '@/store/visualizer-store';
import type { VisualElement } from '@/types/visualizer';

const STATUS_BG: Record<VisualElement['status'], string> = {
  default: 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600',
  active: 'bg-yellow-200 dark:bg-yellow-800 border-yellow-400',
  comparing: 'bg-blue-200 dark:bg-blue-800 border-blue-400',
  sorted: 'bg-green-200 dark:bg-green-800 border-green-400',
  found: 'bg-emerald-200 dark:bg-emerald-800 border-emerald-400',
  visited: 'bg-orange-200 dark:bg-orange-800 border-orange-400',
};

const STATUS_TEXT: Record<VisualElement['status'], string> = {
  default: 'text-slate-700 dark:text-slate-200',
  active: 'text-yellow-800 dark:text-yellow-100',
  comparing: 'text-blue-800 dark:text-blue-100',
  sorted: 'text-green-800 dark:text-green-100',
  found: 'text-emerald-800 dark:text-emerald-100',
  visited: 'text-orange-800 dark:text-orange-100',
};

export function SortingVisualizer() {
  const { steps, currentStep } = useVisualizerStore();

  if (steps.length === 0) return null;

  const step = steps[currentStep];
  if (!step) return null;

  const cells = step.elements.filter((el) => el.type === 'bar');

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {/* 인덱스 표시 */}
      <div className="flex gap-1">
        {cells.map((_, i) => (
          <div
            key={`idx-${i}`}
            className="w-14 h-6 flex items-center justify-center text-xs text-muted-foreground font-mono"
          >
            [{i}]
          </div>
        ))}
      </div>

      {/* 배열 칸 */}
      <div className="flex gap-1">
        {cells.map((cell, i) => (
          <motion.div
            key={cell.id}
            layout
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`
              w-14 h-14 rounded-lg border-2 flex items-center justify-center
              font-bold text-lg font-mono select-none
              ${STATUS_BG[cell.status]}
              ${STATUS_TEXT[cell.status]}
            `}
          >
            {cell.value}
          </motion.div>
        ))}
      </div>

      {/* 하이라이트 화살표 */}
      {step.highlights.length > 0 && (
        <div className="flex gap-1">
          {cells.map((_, i) => (
            <div
              key={`arrow-${i}`}
              className="w-14 h-6 flex items-center justify-center text-sm"
            >
              {step.highlights.includes(i) ? (
                <span className="text-blue-500 dark:text-blue-400 font-bold">▲</span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
