import { useState, useEffect, useRef } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  countries,
  applyMask,
  getDigitsOnly,
  isValidPhone,
  type Country,
} from '@/lib/phone-countries';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryChange: (code: string) => void;
  error?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryChange,
  error,
  onValidationChange,
  className,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const country = countries.find((c) => c.code === countryCode) || countries[0];
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digits = getDigitsOnly(rawValue);
    const masked = applyMask(digits, country.mask);
    onChange(masked);
  };

  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isValidPhone(value, country));
    }
  }, [value, country, onValidationChange]);

  // Re-apply mask when country changes
  useEffect(() => {
    const digits = getDigitsOnly(value);
    const masked = applyMask(digits, country.mask);
    if (masked !== value) {
      onChangeRef.current(masked);
    }
  }, [countryCode, value, country.mask]);

  return (
    <div className={cn('flex gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100px] justify-between bg-background/50 border-input hover:bg-background/70 transition-all duration-150"
          >
            <span className="flex items-center gap-1.5">
              <span>{country.flag}</span>
              <span className="text-xs text-muted-foreground">{country.dialCode}</span>
            </span>
            <CaretDown weight="thin" className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <ScrollArea className="h-[200px]">
            <div className="p-1">
              {countries.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    onCountryChange(c.code);
                    setOpen(false);
                  }}
                  className={cn(
                    'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors duration-150',
                    'hover:bg-muted/50',
                    c.code === countryCode && 'bg-muted'
                  )}
                >
                  <span>{c.flag}</span>
                  <span className="flex-1 text-left truncate">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.dialCode}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <Input
        type="tel"
        value={value}
        onChange={handleInputChange}
        placeholder={country.mask.replace(/9/g, '0')}
        className={cn(
          'flex-1 bg-background/50 transition-all duration-150',
          error && 'border-red-400/50 focus-visible:ring-red-400/30'
        )}
      />
    </div>
  );
}

export function PhoneErrorMessage({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="text-xs text-red-400/80 mt-1">
      Insira um telefone válido com DDD
    </p>
  );
}
