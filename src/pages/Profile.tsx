import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CaretLeft, 
  Camera, 
  Baby, 
  Syringe, 
  Users, 
  WhatsappLogo, 
  Check, 
  Warning,
  CaretRight
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/useProfile';
import { useChildren, useUpdateChild } from '@/hooks/useChildren';
import { useContacts } from '@/hooks/useContacts';
import { differenceInYears, differenceInMonths, parseISO } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: children = [], isLoading: childrenLoading } = useChildren();
  const { data: contacts = [], isLoading: contactsLoading } = useContacts();
  const updateProfile = useUpdateProfile();
  const updateChild = useUpdateChild();
  const uploadAvatar = useUploadAvatar();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nickname: '',
    whatsapp: '',
    city: '',
    state: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        nickname: profile.nickname || '',
        whatsapp: profile.whatsapp || '',
        city: profile.city || '',
        state: profile.state || '',
      });
    }
  });

  const handleSave = () => {
    updateProfile.mutate(formData, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  const handleAcceptDisclaimer = (childId: string) => {
    updateChild.mutate({ id: childId, accepted_health_disclaimer: true });
  };

  const calculateAge = (birthDate: string) => {
    const date = parseISO(birthDate);
    const years = differenceInYears(new Date(), date);
    if (years < 1) {
      const months = differenceInMonths(new Date(), date);
      return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    }
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
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

  // Group contacts by category
  const groupedContacts = contacts.reduce((acc, contact) => {
    const category = contact.category || 'Outros';
    if (!acc[category]) acc[category] = [];
    acc[category].push(contact);
    return acc;
  }, {} as Record<string, typeof contacts>);

  // Get high intimacy contacts (4 or 5)
  const highlightedContacts = contacts
    .filter(c => c.intimacy_level >= 4)
    .slice(0, 3);

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
            <h1 className="text-lg font-semibold text-foreground">Quem sou eu para a Annia</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        
        {/* Dados Pessoais */}
        <section className="annia-glass p-4 rounded-lg border border-border/30">
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar com upload */}
            <div className="relative">
              <Avatar className="h-16 w-16 border border-border">
                <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
                <AvatarFallback className="bg-muted text-foreground text-lg font-medium">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera weight="thin" className="h-3 w-3 text-primary-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={uploadAvatar.isPending}
                />
              </label>
            </div>
            
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">
                {user?.email}
              </p>
              {!isEditing && (
                <Button
                  variant="link"
                  className="h-auto p-0 text-primary text-sm"
                  onClick={() => {
                    setFormData({
                      first_name: profile?.first_name || '',
                      last_name: profile?.last_name || '',
                      nickname: profile?.nickname || '',
                      whatsapp: profile?.whatsapp || '',
                      city: profile?.city || '',
                      state: profile?.state || '',
                    });
                    setIsEditing(true);
                  }}
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
                <Input
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="+55 11 99999-9999"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Cidade</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Cidade"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Estado</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="UF"
                    maxLength={2}
                  />
                </div>
              </div>

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
            <div className="space-y-2">
              <p className="text-foreground font-medium">
                {profile?.first_name || 'Nome'} {profile?.last_name || ''}
              </p>
              {profile?.nickname && (
                <p className="text-sm text-muted-foreground">
                  Chamada de: {profile.nickname}
                </p>
              )}
              {profile?.whatsapp && (
                <p className="text-sm text-muted-foreground">
                  {profile.whatsapp}
                </p>
              )}
              {(profile?.city || profile?.state) && (
                <p className="text-sm text-muted-foreground">
                  {[profile.city, profile.state].filter(Boolean).join(', ')}
                </p>
              )}
            </div>
          )}
        </section>

        {/* Quem a gente cuida junto */}
        <section>
          <h2 className="text-base font-medium text-foreground mb-3">
            Quem a gente cuida junto
          </h2>
          
          {childrenLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
            </div>
          ) : children.length === 0 ? (
            <div className="annia-glass p-4 rounded-lg border border-border/30 text-center">
              <p className="text-muted-foreground text-sm">
                Nenhuma criança cadastrada
              </p>
              <Link to="/filhos">
                <Button variant="link" className="text-primary mt-1">
                  Adicionar primeira criança
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {children.map((child) => (
                <Link
                  key={child.id}
                  to="/filhos"
                  className="annia-glass p-3 rounded-lg border border-border/30 flex items-center gap-3 hover:border-primary/30 transition-colors"
                >
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Baby weight="thin" className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">
                      {child.nickname || child.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {calculateAge(child.birth_date)}
                    </p>
                  </div>
                  {child.vaccination_reminders_enabled && (
                    <Syringe weight="thin" className="h-4 w-4 text-primary/70" />
                  )}
                  <CaretRight weight="thin" className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
              <Link to="/filhos">
                <Button variant="ghost" size="sm" className="w-full text-primary mt-2">
                  Gerenciar filhos
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Sua rede de apoio */}
        <section>
          <h2 className="text-base font-medium text-foreground mb-3">
            Sua rede de apoio
          </h2>

          {contactsLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : contacts.length === 0 ? (
            <div className="annia-glass p-4 rounded-lg border border-border/30 text-center">
              <p className="text-muted-foreground text-sm">
                Nenhum contato cadastrado
              </p>
              <Link to="/rede-apoio">
                <Button variant="link" className="text-primary mt-1">
                  Adicionar primeiro contato
                </Button>
              </Link>
            </div>
          ) : (
            <div className="annia-glass p-4 rounded-lg border border-border/30">
              {highlightedContacts.length > 0 && (
                <div className="space-y-2 mb-3">
                  {highlightedContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center gap-2">
                      <Users weight="thin" className="h-4 w-4 text-primary" />
                      <span className="text-foreground text-sm">{contact.alias}</span>
                      {contact.category && (
                        <span className="text-xs text-muted-foreground">
                          ({contact.category})
                        </span>
                      )}
                      {contact.can_annia_message && (
                        <WhatsappLogo weight="thin" className="h-4 w-4 text-primary/70 ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <Link to="/rede-apoio">
                <Button variant="ghost" size="sm" className="w-full text-primary">
                  Ver todos os contatos
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Segurança e Consentimentos */}
        <section>
          <h2 className="text-base font-medium text-foreground mb-3">
            Segurança e Consentimentos
          </h2>

          {childrenLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : children.length === 0 ? (
            <div className="annia-glass p-4 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground">
                Cadastre seus filhos para gerenciar consentimentos de saúde
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="annia-glass p-3 rounded-lg border border-border/30"
                >
                  {child.accepted_health_disclaimer ? (
                    <div className="flex items-center gap-2">
                      <Check weight="thin" className="h-4 w-4 text-primary" />
                      <span className="text-foreground text-sm">
                        {child.nickname || child.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Disclaimer aceito
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Warning weight="thin" className="h-4 w-4 text-destructive" />
                        <span className="text-foreground text-sm">
                          {child.nickname || child.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Aceite o disclaimer de saúde para receber lembretes de vacinas e acompanhamento médico.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcceptDisclaimer(child.id)}
                        disabled={updateChild.isPending}
                      >
                        Aceitar disclaimer
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
