import { addMinutes, isAfter, subMinutes } from 'date-fns';

import type { GetGymResponse } from '@/services/gym';
import { OperatingDays } from '@/services/gym/enum';

export function getCurrentRecordingEndDate({
  now,
  recordingIntervalInMinute,
  operatingStartHour,
  operatingEndHour,
}: {
  now: Date;
  recordingIntervalInMinute: number;
  operatingStartHour: number;
  operatingEndHour: number;
}) {
  const operationStartDate = new Date();
  operationStartDate.setHours(operatingStartHour, 0, 0, 0);

  const operationEndDate = new Date();
  operationEndDate.setHours(operatingEndHour, 0, 0, 0);

  let nextRecordingEndDate: Date | null = operationStartDate;

  do {
    nextRecordingEndDate = addMinutes(
      nextRecordingEndDate,
      recordingIntervalInMinute,
    );
  } while (isAfter(now, nextRecordingEndDate));

  return nextRecordingEndDate;
}

export function getCurrentRecordingStartDate({
  now,
  recordingIntervalInMinute,
  operatingStartHour,
  operatingEndHour,
}: {
  now: Date;
  recordingIntervalInMinute: number;
  operatingStartHour: number;
  operatingEndHour: number;
}) {
  const operationStartDate = new Date();
  operationStartDate.setHours(operatingStartHour, 0, 0, 0);

  const operationEndDate = new Date();
  operationEndDate.setHours(operatingEndHour, 0, 0, 0);

  let currentRecordingStartDate: Date = operationEndDate;

  do {
    currentRecordingStartDate = subMinutes(
      currentRecordingStartDate,
      recordingIntervalInMinute,
    );
  } while (isAfter(currentRecordingStartDate, now));

  return currentRecordingStartDate;
}

export function isOverHalfInterval({
  now,
  recordingIntervalInMinute,
  operatingStartHour,
  operatingEndHour,
}: {
  now: Date;
  recordingIntervalInMinute: number;
  operatingStartHour: number;
  operatingEndHour: number;
}) {
  const currentRecordingEndDate = getCurrentRecordingEndDate({
    now,
    recordingIntervalInMinute,
    operatingStartHour,
    operatingEndHour,
  });

  const halfInterval = recordingIntervalInMinute / 2;

  const halfIntervalDate = subMinutes(currentRecordingEndDate, halfInterval);

  return isAfter(now, halfIntervalDate);
}

export function parseOperationHour(
  operationHours: GetGymResponse['data']['operatingHours'],
) {
  const now = new Date();
  const today = OperatingDays[now.getDay()];
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
