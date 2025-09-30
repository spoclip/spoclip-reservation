import { z } from 'zod/v3';

// written by claude-4-sonnet

/**
 * 한국 전화번호 유형별 정규식
 */
const PHONE_PATTERNS = {
  // 휴대폰: 010, 011, 016, 017, 018, 019
  mobile: /^01[016789]\d{8}$/,
  // 서울: 02
  seoul: /^02\d{7,8}$/,
  // 지역번호: 031~064 (경기, 인천, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주)
  local: /^0[3-9]\d{1}\d{7,8}$/,
  // 인터넷전화: 070
  internet: /^070\d{8}$/,
  // 무료전화: 080
  toll_free: /^080\d{7}$/,
  // 특수번호: 1588, 1577, 1566 등
  special: /^1[5-9]\d{2}\d{4}$/,
} as const;

/**
 * 전화번호 형식을 표준화하는 함수
 */
function formatPhoneNumber(phone: string): string {
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '');
  return numbers.replaceAll('-', '');
}

/**
 * 전화번호 유효성 검증 함수
 */
function isValidPhoneNumber(phone: string): boolean {
  const numbers = phone.replace(/\D/g, '');

  return Object.values(PHONE_PATTERNS).some((pattern) => pattern.test(numbers));
}

/**
 * 휴대폰 번호만 허용하는 스키마
 */
export const mobilePhoneSchema = z
  .string()
  .min(1, '휴대폰 번호를 입력해주세요')
  .transform((value) => value.replace(/\D/g, ''))
  .pipe(
    z
      .string()
      .refine((value) => PHONE_PATTERNS.mobile.test(value), {
        message: '-를 제외한 번호를 입력해주세요.',
      })
      .transform(formatPhoneNumber),
  );

/**
 * 모든 한국 전화번호를 허용하는 스키마
 */
export const koreanPhoneSchema = z
  .string()
  .min(1, '전화번호를 입력해주세요')
  .transform((value) => value.replace(/\D/g, ''))
  .pipe(
    z
      .string()
      .refine((value) => isValidPhoneNumber(value), {
        message: '올바른 전화번호 형식이 아닙니다',
      })
      .refine((value) => value.length >= 8 && value.length <= 11, {
        message: '전화번호는 8~11자리여야 합니다',
      })
      .transform(formatPhoneNumber),
  );

/**
 * 전화번호 유틸리티 함수들
 */
export const phoneUtils = {
  format: formatPhoneNumber,
  isValid: isValidPhoneNumber,
  isMobile: (phone: string) =>
    PHONE_PATTERNS.mobile.test(phone.replace(/\D/g, '')),
  isSeoul: (phone: string) =>
    PHONE_PATTERNS.seoul.test(phone.replace(/\D/g, '')),
  isLocal: (phone: string) =>
    PHONE_PATTERNS.local.test(phone.replace(/\D/g, '')),
  isSpecial: (phone: string) =>
    PHONE_PATTERNS.special.test(phone.replace(/\D/g, '')),

  /**
   * 전화번호에서 숫자만 추출
   */
  extractNumbers: (phone: string) => phone.replace(/\D/g, ''),

  /**
   * 전화번호 마스킹 (개인정보 보호)
   */
  mask: (phone: string, visibleDigits = 4) => {
    const formatted = formatPhoneNumber(phone);
    const parts = formatted.split('-');
    if (parts.length >= 2) {
      const lastPart = parts[parts.length - 1];
      const masked =
        '*'.repeat(Math.max(0, lastPart.length - visibleDigits)) +
        lastPart.slice(-visibleDigits);
      return [...parts.slice(0, -1), masked].join('-');
    }
    return formatted;
  },
} as const;
