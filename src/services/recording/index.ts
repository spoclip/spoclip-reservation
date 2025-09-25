export const recordingQueryKey = {
  all: ['recording'],
  history: () => [...recordingQueryKey.all, 'history-list'],
};
