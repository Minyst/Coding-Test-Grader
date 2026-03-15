import { create } from 'zustand';
import type { AnimationStep } from '@/types/visualizer';

interface VisualizerStore {
  steps: AnimationStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;

  setSteps: (steps: AnimationStep[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
}

export const useVisualizerStore = create<VisualizerStore>((set, get) => ({
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1,

  setSteps: (steps) => set({ steps, currentStep: 0, isPlaying: false }),

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  goToStep: (index) => {
    const { steps } = get();
    if (index >= 0 && index < steps.length) {
      set({ currentStep: index });
    }
  },

  setSpeed: (speed) => set({ speed }),

  reset: () => set({ steps: [], currentStep: 0, isPlaying: false }),
}));
