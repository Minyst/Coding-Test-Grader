'use client';

import { Play, Pause, SkipForward, SkipBack, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useVisualizerStore } from '@/store/visualizer-store';
import { useEffect, useRef } from 'react';

const SPEED_OPTIONS = [0.5, 1, 1.5, 2, 4];

export function VisualizerControls() {
  const {
    steps,
    currentStep,
    isPlaying,
    speed,
    togglePlay,
    nextStep,
    prevStep,
    goToStep,
    setSpeed,
    reset,
  } = useVisualizerStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        nextStep();
      }, 1000 / speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, nextStep]);

  if (steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-card">
      {/* Progress bar */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground w-12">
          {currentStep + 1}/{steps.length}
        </span>
        <Slider
          value={[currentStep]}
          max={steps.length - 1}
          step={1}
          onValueChange={(val) => goToStep(Array.isArray(val) ? val[0] : val)}
          className="flex-1"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={prevStep} disabled={currentStep === 0}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextStep}
            disabled={currentStep >= steps.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={reset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed control */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">속도:</span>
          {SPEED_OPTIONS.map((s) => (
            <Button
              key={s}
              variant={speed === s ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => setSpeed(s)}
            >
              {s}x
            </Button>
          ))}
        </div>
      </div>

      {/* Step description */}
      {steps[currentStep] && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm">{steps[currentStep].description}</p>
          {steps[currentStep].variables && (
            <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
              {Object.entries(steps[currentStep].variables!).map(([key, val]) => (
                <span key={key}>
                  <strong>{key}</strong>={String(val)}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
