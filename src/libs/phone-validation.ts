import { z } from 'zod/v3';

export function formatPhoneNumber(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length > 7) {
    return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 7)} ${digitsOnly.slice(7, 11)}`;
  }
  if (digitsOnly.length > 3) {
    return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 7)}`;
  }
  return digitsOnly;
}

export const mobilePhoneSchema = z
  .string()
  .min(1, '휴대폰 번호를 입력해주세요')
  .max(13, '휴대폰 번호는 13자리여야 합니다');
