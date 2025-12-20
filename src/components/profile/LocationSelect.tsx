import { useState, useMemo } from 'react';
import { CaretDown, Check, MagnifyingGlass } from '@phosphor-icons/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  LOCATION_COUNTRIES,
  BRAZILIAN_STATES,
  CITIES_BY_STATE,
} from '@/lib/brazil-locations';
import { cn } from '@/lib/utils';

interface LocationSelectProps {
  country: string;
  state: string;
  city: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
}

export function LocationSelect({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange,
}: LocationSelectProps) {
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const selectedCountry = LOCATION_COUNTRIES.find((c) => c.code === country);
  const isBrazil = country === 'BR';

  // Filter states based on search
  const filteredStates = useMemo(() => {
    if (!stateSearch) return BRAZILIAN_STATES;
    const search = stateSearch.toLowerCase();
    return BRAZILIAN_STATES.filter(
      (s) =>
        s.name.toLowerCase().includes(search) ||
        s.code.toLowerCase().includes(search)
    );
  }, [stateSearch]);

  // Filter cities based on search and selected state
  const filteredCities = useMemo(() => {
    if (!isBrazil || !state) return [];
    const cities = CITIES_BY_STATE[state] || [];
    if (!citySearch) return cities;
    const search = citySearch.toLowerCase();
    return cities.filter((c) => c.toLowerCase().includes(search));
  }, [isBrazil, state, citySearch]);

  const handleCountryChange = (code: string) => {
    onCountryChange(code);
    // Reset state and city when country changes
    if (code !== country) {
      onStateChange('');
      onCityChange('');
    }
    setCountryOpen(false);
  };

  const handleStateChange = (value: string) => {
    onStateChange(value);
    // Reset city when state changes
    if (value !== state) {
      onCityChange('');
    }
    setStateOpen(false);
    setStateSearch('');
  };

  const handleCityChange = (value: string) => {
    onCityChange(value);
    setCityOpen(false);
    setCitySearch('');
  };

  return (
    <div className="space-y-3">
      {/* Country */}
      <div>
        <Label className="text-xs text-muted-foreground">País</Label>
        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={countryOpen}
              className="w-full justify-between bg-background/50 border-input hover:bg-background/70"
            >
              <span className="flex items-center gap-2">
                {selectedCountry && (
                  <>
                    <span>{selectedCountry.flag}</span>
                    <span>{selectedCountry.name}</span>
                  </>
                )}
                {!selectedCountry && (
                  <span className="text-muted-foreground">Selecione o país</span>
                )}
              </span>
              <CaretDown weight="thin" className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <ScrollArea className="h-[200px]">
              <div className="p-1">
                {LOCATION_COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleCountryChange(c.code)}
                    className={cn(
                      'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors',
                      'hover:bg-muted/50',
                      c.code === country && 'bg-muted'
                    )}
                  >
                    <span>{c.flag}</span>
                    <span className="flex-1 text-left">{c.name}</span>
                    {c.code === country && (
                      <Check weight="thin" className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>

      {/* State */}
      <div>
        <Label className="text-xs text-muted-foreground">
          {isBrazil ? 'Estado' : 'Estado / Província'}
        </Label>
        {isBrazil ? (
          <Popover open={stateOpen} onOpenChange={setStateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={stateOpen}
                className="w-full justify-between bg-background/50 border-input hover:bg-background/70"
              >
                <span>
                  {state
                    ? BRAZILIAN_STATES.find((s) => s.code === state)?.name || state
                    : <span className="text-muted-foreground">Selecione o estado</span>}
                </span>
                <CaretDown weight="thin" className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0" align="start">
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <MagnifyingGlass
                    weight="thin"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    placeholder="Buscar estado..."
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              </div>
              <ScrollArea className="h-[200px]">
                <div className="p-1">
                  {filteredStates.map((s) => (
                    <button
                      key={s.code}
                      onClick={() => handleStateChange(s.code)}
                      className={cn(
                        'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors',
                        'hover:bg-muted/50',
                        s.code === state && 'bg-muted'
                      )}
                    >
                      <span className="text-muted-foreground text-xs w-6">{s.code}</span>
                      <span className="flex-1 text-left">{s.name}</span>
                      {s.code === state && (
                        <Check weight="thin" className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        ) : (
          <Input
            value={state}
            onChange={(e) => onStateChange(e.target.value)}
            placeholder="Digite o estado ou província"
            className="bg-background/50"
          />
        )}
      </div>

      {/* City */}
      <div>
        <Label className="text-xs text-muted-foreground">Cidade</Label>
        {isBrazil && state ? (
          <Popover open={cityOpen} onOpenChange={setCityOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={cityOpen}
                className="w-full justify-between bg-background/50 border-input hover:bg-background/70"
              >
                <span>
                  {city || <span className="text-muted-foreground">Selecione a cidade</span>}
                </span>
                <CaretDown weight="thin" className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-0" align="start">
              <div className="p-2 border-b border-border">
                <div className="relative">
                  <MagnifyingGlass
                    weight="thin"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
                  />
                  <Input
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    placeholder="Buscar cidade..."
                    className="pl-8 h-8 text-sm"
                  />
                </div>
              </div>
              <ScrollArea className="h-[200px]">
                <div className="p-1">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((c) => (
                      <button
                        key={c}
                        onClick={() => handleCityChange(c)}
                        className={cn(
                          'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors',
                          'hover:bg-muted/50',
                          c === city && 'bg-muted'
                        )}
                      >
                        <span className="flex-1 text-left">{c}</span>
                        {c === city && (
                          <Check weight="thin" className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                      {citySearch ? 'Nenhuma cidade encontrada' : 'Digite para buscar'}
                    </div>
                  )}
                </div>
              </ScrollArea>
              {/* Option to type custom city */}
              <div className="p-2 border-t border-border">
                <Input
                  value={city}
                  onChange={(e) => onCityChange(e.target.value)}
                  placeholder="Ou digite manualmente..."
                  className="h-8 text-sm"
                />
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Input
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="Digite a cidade"
            className="bg-background/50"
            disabled={isBrazil && !state}
          />
        )}
      </div>
    </div>
  );
}
