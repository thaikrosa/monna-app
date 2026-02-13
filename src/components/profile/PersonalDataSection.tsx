import { useState, useEffect } from 'react';
import {
  IdentificationCard,
  WhatsappLogo,
  MapPin
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile, type Profile } from '@/hooks/useProfile';
import { PhoneInput, PhoneErrorMessage } from '@/components/ui/phone-input';
import { LocationSelect } from '@/components/profile/LocationSelect';
import {
  detectCountryFromPhone,
  extractPhoneWithoutDialCode,
  formatFullPhone,
  countries,
  isValidPhone
} from '@/lib/phone-countries';
import { AvatarSection } from './AvatarSection';

interface PersonalDataSectionProps {
  profile: Profile | null;
  userEmail: string | undefined;
}

export function PersonalDataSection({ profile, userEmail }: PersonalDataSectionProps) {
  const updateProfile = useUpdateProfile();

  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    city: '',
    state: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Phone state
  const [countryCode, setCountryCode] = useState('BR');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState(false);

  // Location state
  const [locationCountry, setLocationCountry] = useState('BR');

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        nickname: profile.nickname || '',
        city: profile.city || '',
        state: profile.state || '',
      });

      // Initialize phone
      if (profile.whatsapp) {
        const detectedCountry = detectCountryFromPhone(profile.whatsapp);
        setCountryCode(detectedCountry.code);
        setPhoneNumber(extractPhoneWithoutDialCode(profile.whatsapp, detectedCountry));
      }

      // Detect location country based on state (simple heuristic)
      if (profile.state && profile.state.length === 2) {
        setLocationCountry('BR');
      }
    }
  }, [profile]);

  const handleSave = () => {
    const country = countries.find((c) => c.code === countryCode) || countries[0];

    // Validate phone before saving
    if (phoneNumber && !isValidPhone(phoneNumber, country)) {
      setPhoneError(true);
      return;
    }

    const fullPhone = phoneNumber ? formatFullPhone(country.dialCode, phoneNumber) : '';

    updateProfile.mutate({
      ...formData,
      whatsapp: fullPhone,
    }, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const startEditing = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      nickname: profile?.nickname || '',
      city: profile?.city || '',
      state: profile?.state || '',
    });
    setIsEditing(true);
  };

  const getInitials = () => {
    if (profile?.nickname) return profile.nickname.slice(0, 2).toUpperCase();
    if (profile?.first_name) {
      const first = profile.first_name[0] || '';
      const last = profile.last_name?.[0] || '';
      return (first + last).toUpperCase() || 'U';
    }
    return 'U';
  };

  return (
    <section className="annia-glass p-4 rounded-lg border border-border/30">
      <div className="flex items-start gap-4 mb-4">
        <AvatarSection
          avatarUrl={profile?.avatar_url}
          initials={getInitials()}
        />

        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">
            {userEmail}
          </p>
          {!isEditing && (
            <Button
              variant="link"
              className="h-auto p-0 text-primary text-sm"
              onClick={startEditing}
            >
              Editar dados
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Nome</Label>
              <Input
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Nome"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Sobrenome</Label>
              <Input
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Sobrenome"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Como quer ser chamada</Label>
            <Input
              value={formData.nickname}
              onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
              placeholder="Apelido"
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">WhatsApp</Label>
            <PhoneInput
              value={phoneNumber}
              onChange={(value) => {
                setPhoneNumber(value);
                setPhoneError(false);
              }}
              countryCode={countryCode}
              onCountryChange={setCountryCode}
              error={phoneError}
              onValidationChange={(isValid) => {
                if (phoneNumber) setPhoneError(!isValid);
              }}
            />
            <PhoneErrorMessage show={phoneError} />
          </div>

          <LocationSelect
            country={locationCountry}
            state={formData.state}
            city={formData.city}
            onCountryChange={setLocationCountry}
            onStateChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
            onCityChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
          />

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={updateProfile.isPending}
              className="flex-1"
            >
              Salvar
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-foreground font-medium">
            {profile?.first_name || 'Nome'} {profile?.last_name || ''}
          </p>

          {profile?.nickname && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IdentificationCard weight="thin" className="h-4 w-4 text-primary/70" />
              <span>Gosto de ser chamada de: <strong className="text-foreground">{profile.nickname}</strong></span>
            </div>
          )}

          {profile?.whatsapp && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <WhatsappLogo weight="thin" className="h-4 w-4 text-primary/70" />
              <span>{profile.whatsapp}</span>
            </div>
          )}

          {(profile?.city || profile?.state) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin weight="thin" className="h-4 w-4 text-primary/70" />
              <span>{[profile.city, profile.state].filter(Boolean).join(', ')}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
