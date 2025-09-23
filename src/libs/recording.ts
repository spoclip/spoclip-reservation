import { addMinutes, isAfter, isBefore } from 'date-fns';

export function getNextRecordingEndTime({
  recordingIntervalInMinute,
  operationStartHour,
  operationEndHour,
}: {
  recordingIntervalInMinute: number;
  operationStartHour: number;
  operationEndHour: number;
}) {
  const now = new Date();
  const operationStartDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    operationStartHour,
    0,
    0,
    0,
  );

  const operationEndDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    operationEndHour,
    0,
    0,
    0,
  );

  let nextRecordingEndDate: Date | null = operationStartDate;

  do {
    nextRecordingEndDate = addMinutes(
      nextRecordingEndDate,
      recordingIntervalInMinute,
    );

    if (isBefore(now, nextRecordingEndDate)) {
      break;
    }
  } while (isBefore(nextRecordingEndDate, operationEndDate));

  return nextRecordingEndDate;
}
