import type { GetGymResponse } from '@/services/gym';
import { OperationDays } from '@/services/gym/enum';
import { addMinutes, isAfter, isBefore, subMinutes } from 'date-fns';

export function getCurrentRecordingEndDate({
  now,
  recordingIntervalInMinute,
  operationStartHour,
  operationEndHour,
}: {
  now: Date;
  recordingIntervalInMinute: number;
  operationStartHour: number;
  operationEndHour: number;
}) {
  const operationStartDate = new Date();
  operationStartDate.setHours(operationStartHour, 0, 0, 0);

  const operationEndDate = new Date();
  operationEndDate.setHours(operationEndHour, 0, 0, 0);

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

export function getCurrentRecordingStartDate({
  now,
  recordingIntervalInMinute,
  operationStartHour,
  operationEndHour,
}: {
  now: Date;
  recordingIntervalInMinute: number;
  operationStartHour: number;
  operationEndHour: number;
}) {
  const operationStartDate = new Date();
  operationStartDate.setHours(operationStartHour, 0, 0, 0);

  const operationEndDate = new Date();
  operationEndDate.setHours(operationEndHour, 0, 0, 0);

  let currentRecordingStartDate: Date | null = operationStartDate;

  while (isAfter(now, currentRecordingStartDate)) {
    currentRecordingStartDate = addMinutes(
      currentRecordingStartDate,
      recordingIntervalInMinute,
    );
  }

  return currentRecordingStartDate;
}

export function isOverHalfInterval({
  now,
  recordingIntervalInMinute,
  operationStartHour,
  operationEndHour,
}: {
  now: Date;
  recordingIntervalInMinute: number;
  operationStartHour: number;
  operationEndHour: number;
}) {
  const currentRecordingEndDate = getCurrentRecordingEndDate({
    now,
    recordingIntervalInMinute,
    operationStartHour,
    operationEndHour,
  });

  const halfInterval = recordingIntervalInMinute / 2;

  const halfIntervalDate = subMinutes(currentRecordingEndDate, halfInterval);

  return isAfter(now, halfIntervalDate);
}

export function parseOperationHour(
  operationHours: GetGymResponse['data']['operatingHours'],
) {
  const now = new Date();
  const today = OperationDays[now.getDay()];
  const todayOperatingTime = operationHours.find((hour) => hour.day === today);

  if (!todayOperatingTime) {
    throw new Error('Today operating time not found');
  }

  return {
    ...todayOperatingTime,
    openHour: Number(todayOperatingTime?.openTime.split(':')[0]),
    closeHour: Number(todayOperatingTime?.closeTime.split(':')[0]),
  };
}
