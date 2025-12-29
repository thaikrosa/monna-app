import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CaretLeft, 
  Sun, 
  Moon, 
  Lightbulb,
  Package,
  Baby,
  GoogleLogo,
  Check,
  Warning,
  ShoppingCart,
  Bell,
  ChatCircle,
  Heart,
  Target,
  Smiley
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useProfile, useUpdateProfile } from '@/hooks/useProfile';
import { useChildren, useUpdateChild } from '@/hooks/useChildren';
import { useGoogleCalendarConnection } from '@/hooks/useCalendarConnections';
import { useActivitySummary } from '@/hooks/useActivityHistory';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00'
];

export default function Settings() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: children = [], isLoading: childrenLoading } = useChildren();
  const { data: googleConnection, isConnected } = useGoogleCalendarConnection();
  const updateProfile = useUpdateProfile();
  const updateChild = useUpdateChild();
  
  const [historyDays, setHistoryDays] = useState<7 | 30>(7);
  const activitySummary = useActivitySummary(historyDays);

  // Local state for settings
  const [settings, setSettings] = useState({
    checkin_morning_enabled: false,
    checkin_morning_time: '08:00',
    checkin_evening_enabled: false,
    checkin_evening_time: '21:00',
    proactive_suggestions_enabled: false,
    inventory_alerts_enabled: false,
    communication_style: 'caring',
  });

  // Helper to normalize time format (remove seconds if present)
  const normalizeTime = (time: string | null | undefined, defaultValue: string): string => {
    if (!time) return defaultValue;
    // Handle "HH:mm:ss" format from Supabase - extract just "HH:mm"
    const parts = time.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return defaultValue;
  };

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

  const handleSave = () => {
    // Format times with seconds for PostgreSQL time type
    const dataToSave = {
      ...settings,
      checkin_morning_time: settings.checkin_morning_time.includes(':') 
        ? (settings.checkin_morning_time.split(':').length === 2 
            ? `${settings.checkin_morning_time}:00` 
            : settings.checkin_morning_time)
        : `${settings.checkin_morning_time}:00`,
      checkin_evening_time: settings.checkin_evening_time.includes(':') 
        ? (settings.checkin_evening_time.split(':').length === 2 
            ? `${settings.checkin_evening_time}:00` 
            : settings.checkin_evening_time)
        : `${settings.checkin_evening_time}:00`,
      communication_style: settings.communication_style,
    };
    updateProfile.mutate(dataToSave);
  };

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleTimeChange = (key: 'checkin_morning_time' | 'checkin_evening_time', value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleChildMilestonesToggle = (childId: string, value: boolean) => {
    updateChild.mutate({ id: childId, show_standard_milestones: value });
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
            <h1 className="text-lg font-semibold text-foreground">Como a Annia cuida de você</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Check-ins Diários */}
        <section>
          <h2 className="text-base font-medium text-foreground mb-1">
            Como vamos organizar nossos momentos?
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Configure quando você quer receber mensagens da Annia
          </p>

          <div className="annia-glass p-4 rounded-lg border border-border/30 space-y-4">
            {/* Bom Dia */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun weight="thin" className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-foreground text-sm font-medium">Check-in de Bom Dia</p>
                  <p className="text-xs text-muted-foreground">Comece o dia organizada</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={settings.checkin_morning_time}
                  onValueChange={(v) => handleTimeChange('checkin_morning_time', v)}
                  disabled={!settings.checkin_morning_enabled}
                >
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.filter(t => t < '12:00').map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Switch
                  checked={settings.checkin_morning_enabled}
                  onCheckedChange={(v) => handleToggle('checkin_morning_enabled', v)}
                />
              </div>
            </div>

            {/* Boa Noite */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon weight="thin" className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-foreground text-sm font-medium">Check-in de Boa Noite</p>
                  <p className="text-xs text-muted-foreground">Revise o dia e planeje o amanhã</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={settings.checkin_evening_time}
                  onValueChange={(v) => handleTimeChange('checkin_evening_time', v)}
                  disabled={!settings.checkin_evening_enabled}
                >
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.filter(t => t >= '18:00').map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Switch
                  checked={settings.checkin_evening_enabled}
                  onCheckedChange={(v) => handleToggle('checkin_evening_enabled', v)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Estilo de Comunicação */}
        <section>
          <h2 className="text-base font-medium text-foreground mb-1">
            Como você prefere que eu fale?
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Escolha o tom que combina mais com você
          </p>

          <div className="annia-glass p-4 rounded-lg border border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ChatCircle weight="thin" className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-foreground text-sm font-medium">Tom da Annia</p>
                  <p className="text-xs text-muted-foreground">
                    {settings.communication_style === 'caring' && 'Próxima e acolhedora'}
                    {settings.communication_style === 'direct' && 'Objetiva e direta'}
                    {settings.communication_style === 'playful' && 'Leve e divertida'}
                  </p>
                </div>
              </div>
              <Select
                value={settings.communication_style}
                onValueChange={(v) => setSettings(prev => ({ ...prev, communication_style: v }))}
              >
                <SelectTrigger className="w-36 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caring">
                    <span className="flex items-center gap-2">
                      <Heart weight="bold" className="h-4 w-4" />
                      Acolhedora
                    </span>
                  </SelectItem>
                  <SelectItem value="direct">
                    <span className="flex items-center gap-2">
                      <Target weight="bold" className="h-4 w-4" />
                      Direta
                    </span>
                  </SelectItem>
                  <SelectItem value="playful">
                    <span className="flex items-center gap-2">
                      <Smiley weight="bold" className="h-4 w-4" />
                      Humorada
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Inteligência Proativa */}
        <section>
          <h2 className="text-base font-medium text-foreground mb-1">
            O que posso antecipar para você?
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Deixe a Annia te ajudar antes que você precise pedir
          </p>

          <div className="annia-glass p-4 rounded-lg border border-border/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lightbulb weight="thin" className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-foreground text-sm font-medium">Sugestões antecipadas</p>
                  <p className="text-xs text-muted-foreground">Pausas, ajustes de agenda</p>
                </div>
              </div>
              <Switch
                checked={settings.proactive_suggestions_enabled}
                onCheckedChange={(v) => handleToggle('proactive_suggestions_enabled', v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package weight="thin" className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-foreground text-sm font-medium">Alertas de estoque</p>
                  <p className="text-xs text-muted-foreground">Fraldas, leite, itens recorrentes</p>
                </div>
              </div>
              <Switch
                checked={settings.inventory_alerts_enabled}
                onCheckedChange={(v) => handleToggle('inventory_alerts_enabled', v)}
              />
            </div>
          </div>

          {/* Filtro por filho */}
          {!childrenLoading && children.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-muted-foreground">
                Filtro de sensibilidade por filho
              </p>
              {children.map((child) => (
                <div
                  key={child.id}
                  className="annia-glass p-3 rounded-lg border border-border/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Baby weight="thin" className="h-4 w-4 text-primary" />
                      <span className="text-foreground text-sm">
                        {child.nickname || child.name}
                      </span>
                      {child.is_neurodivergent && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Neurodivergente
                        </span>
                      )}
                    </div>
                    <Switch
                      checked={child.show_standard_milestones ?? true}
                      onCheckedChange={(v) => handleChildMilestonesToggle(child.id, v)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 ml-6">
                    {child.show_standard_milestones !== false
                      ? 'Mostrando marcos de desenvolvimento padrão'
                      : `Acompanhando o ritmo único de ${child.nickname || child.name}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Integrações */}
        <section>
          <h2 className="text-base font-medium text-foreground mb-1">
            Nossas conexões
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Integrações para facilitar sua rotina
          </p>

          <div className="annia-glass p-4 rounded-lg border border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GoogleLogo weight="thin" className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-foreground text-sm font-medium">Google Calendar</p>
                  {isConnected && googleConnection?.last_synced_at && (
                    <p className="text-xs text-muted-foreground">
                      Sincronizado {formatDistanceToNow(parseISO(googleConnection.last_synced_at), { 
                        addSuffix: true, 
                        locale: ptBR 
                      })}
                    </p>
                  )}
                </div>
              </div>
              {isConnected ? (
                <div className="flex items-center gap-1 text-primary">
                  <Check weight="thin" className="h-4 w-4" />
                  <span className="text-xs">Conectado</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" disabled>
                    Conectar
                  </Button>
                  <span className="text-xs text-muted-foreground">Em breve</span>
                </div>
              )}
            </div>
            {googleConnection?.last_error && (
              <div className="mt-2 flex items-center gap-1 text-destructive text-xs">
                <Warning weight="thin" className="h-3 w-3" />
                <span>Erro na última sincronização</span>
              </div>
            )}
          </div>
        </section>

        {/* Histórico */}
        <section>
          <h2 className="text-base font-medium text-foreground mb-1">
            Seus dados, seu controle
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Resumo das suas atividades recentes
          </p>

          <div className="annia-glass p-4 rounded-lg border border-border/30">
            <div className="flex gap-2 mb-4">
              <Button
                size="sm"
                variant={historyDays === 7 ? 'default' : 'outline'}
                onClick={() => setHistoryDays(7)}
              >
                7 dias
              </Button>
              <Button
                size="sm"
                variant={historyDays === 30 ? 'default' : 'outline'}
                onClick={() => setHistoryDays(30)}
              >
                30 dias
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <ShoppingCart weight="thin" className="h-4 w-4 text-primary" />
                <span className="text-foreground text-sm">
                  {activitySummary.shoppingCount} itens comprados
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Bell weight="thin" className="h-4 w-4 text-primary" />
                <span className="text-foreground text-sm">
                  {activitySummary.remindersCompleted} lembretes concluídos
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Botão Salvar */}
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
