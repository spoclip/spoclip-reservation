import { z } from 'zod/v3';

// written by claude-4-sonnet

/**
 * 한국 전화번호 유형별 정규식
 */
const PHONE_PATTERNS = /^01[016789]\d{8}$/;

/**
 * 전화번호 형식을 표준화하는 함수
 */
export function formatPhoneNumber(phone: string): string {
  // 숫자 이외의 모든 문자 제거
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length > 7) {
    return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 7)} ${digitsOnly.slice(7, 11)}`;
  }
  if (digitsOnly.length > 3) {
    return `${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 7)}`;
  }
  return digitsOnly;
}

/**
 * 휴대폰 번호만 허용하는 스키마
 */
export const mobilePhoneSchema = z
  .string()
  .min(1, '휴대폰 번호를 입력해주세요')
  .max(13, '휴대폰 번호는 13자리여야 합니다');
