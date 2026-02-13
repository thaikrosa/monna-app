import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import {
  CheckinSettings,
  CommunicationStyle,
  SuggestionsSettings,
  IntegrationsSection,
  ActivityHistorySection,
  AboutSection,
  type SettingsState,
  defaultSettings,
  normalizeTime,
  formatTimeForDb,
} from '@/components/settings';

export default function Settings() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setSettings({
        checkin_morning_enabled: profile.checkin_morning_enabled ?? false,
        checkin_morning_time: normalizeTime(profile.checkin_morning_time, '08:00'),
        checkin_evening_enabled: profile.checkin_evening_enabled ?? false,
        checkin_evening_time: normalizeTime(profile.checkin_evening_time, '21:00'),
        proactive_suggestions_enabled: profile.proactive_suggestions_enabled ?? false,
        inventory_alerts_enabled: profile.inventory_alerts_enabled ?? false,
        communication_style: profile.communication_style ?? 'caring',
      });
    }
  }, [profile]);

  const handleToggle = (key: keyof SettingsState, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleTimeChange = (key: 'checkin_morning_time' | 'checkin_evening_time', value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleStyleChange = (style: string) => {
    setSettings((prev) => ({ ...prev, communication_style: style }));
  };

  const handleSave = () => {
    updateProfile.mutate({
      ...settings,
      checkin_morning_time: formatTimeForDb(settings.checkin_morning_time),
      checkin_evening_time: formatTimeForDb(settings.checkin_evening_time),
    });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border/30">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground/60 hover:text-foreground active:text-foreground hover:bg-transparent"
              >
                <CaretLeft weight="thin" className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">Como a Monna cuida de você</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <CheckinSettings
          settings={settings}
          onToggle={handleToggle}
          onTimeChange={handleTimeChange}
        />

        <CommunicationStyle
          style={settings.communication_style}
          onChange={handleStyleChange}
        />

        <SuggestionsSettings
          settings={settings}
          onToggle={handleToggle}
        />

        <IntegrationsSection />

        <ActivityHistorySection />

        <AboutSection />

        {/* Save Button */}
        <div className="pt-4 pb-8">
          <Button
            className="w-full"
            onClick={handleSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending ? 'Salvando...' : 'Salvar preferências'}
          </Button>
        </div>
      </div>
    </div>
  );
}
