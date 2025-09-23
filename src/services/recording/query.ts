import { useMutation } from '@tanstack/react-query';
import createRecording from './service';

function useCreateRecordingQuery() {
  return useMutation({
    mutationFn: createRecording,
  });
}

export default useCreateRecordingQuery;
