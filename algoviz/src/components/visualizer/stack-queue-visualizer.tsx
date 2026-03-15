'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVisualizerStore } from '@/store/visualizer-store';
import type { VisualElement } from '@/types/visualizer';

const STATUS_BG: Record<VisualElement['status'], string> = {
  default: 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600',
  active: 'bg-yellow-200 dark:bg-yellow-800 border-yellow-400',
  comparing: 'bg-red-200 dark:bg-red-800 border-red-400',
  sorted: 'bg-green-200 dark:bg-green-800 border-green-400',
  found: 'bg-emerald-200 dark:bg-emerald-800 border-emerald-400',
  visited: 'bg-orange-200 dark:bg-orange-800 border-orange-400',
};

interface Props {
  mode: 'stack' | 'queue';
}

export function StackQueueVisualizer({ mode }: Props) {
  const { steps, currentStep } = useVisualizerStore();

  if (steps.length === 0) return null;
  const step = steps[currentStep];
  if (!step) return null;

  const cells = step.elements;

  if (mode === 'stack') {
    // 스택: 세로로 쌓기 (위가 top)
    const reversed = [...cells].reverse();
    return (
      <div className="flex flex-col items-center gap-1 p-4">
        <div className="text-xs text-muted-foreground mb-1">← TOP</div>
        <div className="flex flex-col gap-1 min-h-[200px]">
          <AnimatePresence>
            {reversed.map((cell) => (
              <motion.div
                key={cell.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`w-20 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-lg font-mono ${STATUS_BG[cell.status]}`}
              >
                {cell.value}
              </motion.div>
            ))}
          </AnimatePresence>
          {cells.length === 0 && (
            <div className="w-20 h-12 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-sm text-muted-foreground">
              비어있음
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">← BOTTOM</div>
      </div>
    );
  }

  // 큐: 가로로 나열 (왼쪽이 front)
  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>FRONT →</span>
        <span className="ml-auto">← REAR</span>
      </div>
      <div className="flex gap-1 min-w-[200px]">
        <AnimatePresence>
          {cells.map((cell) => (
            <motion.div
              key={cell.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center font-bold text-lg font-mono ${STATUS_BG[cell.status]}`}
            >
              {cell.value}
            </motion.div>
          ))}
        </AnimatePresence>
        {cells.length === 0 && (
          <div className="w-14 h-14 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center text-sm text-muted-foreground">
            비어있음
          </div>
        )}
      </div>
    </div>
  );
}
