import { createWithEqualityFn as create } from 'zustand/traditional';

export const useManualNow = create<{
  now: Date;
  updateNow: () => void;
}>((set) => ({
  now: new Date(),
  updateNow: () => set({ now: new Date() }),
}));
