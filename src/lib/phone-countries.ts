export interface Country {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
  mask: string;
  minDigits: number;
}

export const countries: Country[] = [
  { code: 'BR', dialCode: '+55', flag: '🇧🇷', name: 'Brasil', mask: '(99) 99999-9999', minDigits: 11 },
  { code: 'PT', dialCode: '+351', flag: '🇵🇹', name: 'Portugal', mask: '999 999 999', minDigits: 9 },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'EUA', mask: '(999) 999-9999', minDigits: 10 },
  { code: 'AR', dialCode: '+54', flag: '🇦🇷', name: 'Argentina', mask: '(99) 9999-9999', minDigits: 10 },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Espanha', mask: '999 99 99 99', minDigits: 9 },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'França', mask: '9 99 99 99 99', minDigits: 9 },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Alemanha', mask: '999 99999999', minDigits: 10 },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Itália', mask: '999 999 9999', minDigits: 10 },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'Reino Unido', mask: '9999 999999', minDigits: 10 },
  { code: 'MX', dialCode: '+52', flag: '🇲🇽', name: 'México', mask: '(99) 9999-9999', minDigits: 10 },
  { code: 'CL', dialCode: '+56', flag: '🇨🇱', name: 'Chile', mask: '9 9999 9999', minDigits: 9 },
  { code: 'CO', dialCode: '+57', flag: '🇨🇴', name: 'Colômbia', mask: '999 999 9999', minDigits: 10 },
  { code: 'UY', dialCode: '+598', flag: '🇺🇾', name: 'Uruguai', mask: '99 999 999', minDigits: 8 },
  { code: 'PY', dialCode: '+595', flag: '🇵🇾', name: 'Paraguai', mask: '999 999 999', minDigits: 9 },
];

export function applyMask(value: string, mask: string): string {
  const digits = value.replace(/\D/g, '');
  let result = '';
  let digitIndex = 0;

  for (const char of mask) {
    if (digitIndex >= digits.length) break;
    if (char === '9') {
      result += digits[digitIndex++];
    } else {
      result += char;
    }
  }

  return result;
}

export function getDigitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidPhone(phone: string, country: Country): boolean {
  const digits = getDigitsOnly(phone);
  return digits.length >= country.minDigits;
}

export function detectCountryFromPhone(fullPhone: string): Country {
  // Remove any formatting
  const clean = fullPhone.replace(/\D/g, '');
  
  // Try to match by dial code (longest first)
  const sortedCountries = [...countries].sort((a, b) => 
    b.dialCode.length - a.dialCode.length
  );
  
  for (const country of sortedCountries) {
    const dialDigits = country.dialCode.replace(/\D/g, '');
    if (clean.startsWith(dialDigits)) {
      return country;
    }
  }
  
  // Default to Brazil
  return countries[0];
}

export function extractPhoneWithoutDialCode(fullPhone: string, country: Country): string {
  const clean = fullPhone.replace(/\D/g, '');
  const dialDigits = country.dialCode.replace(/\D/g, '');
  
  if (clean.startsWith(dialDigits)) {
    return clean.slice(dialDigits.length);
  }
  
  return clean;
}

export function formatFullPhone(dialCode: string, localPhone: string): string {
  const dialDigits = dialCode.replace(/\D/g, '');
  const phoneDigits = localPhone.replace(/\D/g, '');
  return dialDigits + phoneDigits;
}
