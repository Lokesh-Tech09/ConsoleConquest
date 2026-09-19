import { RegistrationInput } from './types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateRegistrationInput(data: Partial<RegistrationInput>): ValidationResult {
  const errors: Record<string, string> = {};

  // Point 18: Spam / Bot Protection - Honeypot check
  if (data.honeypot && typeof data.honeypot === 'string' && data.honeypot.trim() !== '') {
    errors.honeypot = 'Automated bot submission detected.';
  }

  // Point 18: Spam / Bot Protection - Timing check (under 2 seconds is almost certainly an automated script)
  if (data.formLoadedAt && typeof data.formLoadedAt === 'number') {
    const elapsed = Date.now() - data.formLoadedAt;
    if (elapsed < 1800) {
      errors.formLoadedAt = 'Form submitted too rapidly. Please take your time to review.';
    }
  }

  // Point 17: Full Name validation
  if (!data.fullName || typeof data.fullName !== 'string' || !data.fullName.trim()) {
    errors.fullName = 'Full Legal Name is required';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters';
  } else if (data.fullName.trim().length > 70) {
    errors.fullName = 'Full Name cannot exceed 70 characters';
  }

  // College / Institution
  if (!data.college || typeof data.college !== 'string' || !data.college.trim()) {
    errors.college = 'College or Institution name is required';
  } else if (data.college.trim().length < 3) {
    errors.college = 'College name must be at least 3 characters';
  }

  // Roll Number / Student ID
  if (!data.rollNumber || typeof data.rollNumber !== 'string' || !data.rollNumber.trim()) {
    errors.rollNumber = 'Student ID / Roll Number is required';
  } else if (data.rollNumber.trim().length < 2) {
    errors.rollNumber = 'Please provide a valid Roll Number or Student ID';
  }

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || typeof data.email !== 'string' || !data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!emailRegex.test(data.email.trim().toLowerCase())) {
    errors.email = 'Please provide a valid email address (e.g. name@college.edu)';
  }

  // Phone number format (Indian format: 10 digits starting with 6-9, with optional +91 or 0 prefix)
  const cleanPhone = (data.phone || '').replace(/[\s\-()]/g, '');
  const indianPhoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
  if (!data.phone || typeof data.phone !== 'string' || !data.phone.trim()) {
    errors.phone = 'Mobile Phone number is required';
  } else if (!indianPhoneRegex.test(cleanPhone)) {
    errors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
  }

  // Gamer Tag
  if (!data.gamerTag || typeof data.gamerTag !== 'string' || !data.gamerTag.trim()) {
    errors.gamerTag = 'Gamer Tag / In-Game Name is required';
  } else if (data.gamerTag.trim().length < 2) {
    errors.gamerTag = 'Gamer Tag must be at least 2 characters';
  } else if (data.gamerTag.trim().length > 30) {
    errors.gamerTag = 'Gamer Tag cannot exceed 30 characters';
  }

  // Age (optional or 14-80)
  if (data.age !== undefined && data.age !== null && String(data.age).trim() !== '') {
    const ageNum = Number(data.age);
    if (isNaN(ageNum) || ageNum < 14 || ageNum > 80) {
      errors.age = 'Participant age must be between 14 and 80';
    }
  }

  // Terms and Conditions checkbox
  if (!data.agreeTerms) {
    errors.agreeTerms = 'You must review and accept the official tournament rules & terms';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function normalizePhone(rawPhone: string): string {
  const digitsOnly = rawPhone.replace(/\D/g, '');
  if (digitsOnly.length === 10) {
    return digitsOnly;
  }
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return digitsOnly.slice(2);
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    return digitsOnly.slice(1);
  }
  return digitsOnly;
}
