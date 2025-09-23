export const gymQueryKey = {
  all: ['gym'] as const,
  detailGym: (uuid: string) => [...gymQueryKey.all, 'gym', uuid] as const,
  detailCourt: (uuid: string) => [...gymQueryKey.all, 'court', uuid] as const,
};
