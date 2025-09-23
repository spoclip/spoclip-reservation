export const recordingQueryKeys = {
  all: ['recording'] as const,
  completed: () => [...recordingQueryKeys.all, 'completed'] as const,
};
