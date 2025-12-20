import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CaretLeft, 
  Camera, 
  Baby, 
  Users, 
  WhatsappLogo, 
  Check, 
  Warning,
  ChatCircleDots,
  CaretRight,
  PencilSimple,
  X
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/useProfile';
import { useChildren, useUpdateChild } from '@/hooks/useChildren';
import { useContacts } from '@/hooks/useContacts';
import { PhoneInput, PhoneErrorMessage } from '@/components/ui/phone-input';
import { LocationSelect } from '@/components/profile/LocationSelect';
import { 
  detectCountryFromPhone, 
  extractPhoneWithoutDialCode, 
  formatFullPhone,
  countries,
  isValidPhone
} from '@/lib/phone-countries';
import { differenceInYears, differenceInMonths, parseISO, format } from 'date-fns';

export default function Profile() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: children = [], isLoading: childrenLoading } = useChildren();
  const { data: contacts = [], isLoading: contactsLoading } = useContacts();
  const updateProfile = useUpdateProfile();
  const updateChild = useUpdateChild();
  const uploadAvatar = useUploadAvatar();

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

  // Child editing state
  const [editingChildren, setEditingChildren] = useState<Record<string, {
    name: string;
    nickname: string;
    birth_date: string;
    gender: string;
    is_neurodivergent: boolean;
    special_needs_notes: string;
    allergies: string;
    blood_type: string;
    medical_notes: string;
    personality_traits: string;
    soothing_methods: string;
  }>>({});

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

  // Initialize child editing data
  useEffect(() => {
    if (children.length > 0) {
      const initialData: typeof editingChildren = {};
      children.forEach((child) => {
        initialData[child.id] = {
          name: child.name || '',
          nickname: child.nickname || '',
          birth_date: child.birth_date || '',
          gender: child.gender || '',
          is_neurodivergent: child.is_neurodivergent || false,
          special_needs_notes: child.special_needs_notes || '',
          allergies: child.allergies || '',
          blood_type: child.blood_type || '',
          medical_notes: child.medical_notes || '',
          personality_traits: child.personality_traits || '',
          soothing_methods: child.soothing_methods || '',
        };
      });
      setEditingChildren(initialData);
    }
  }, [children]);

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  const handleAcceptDisclaimer = (childId: string) => {
    updateChild.mutate({ id: childId, accepted_health_disclaimer: true });
  };

  const handleRevokeDisclaimer = (childId: string) => {
    updateChild.mutate({ id: childId, accepted_health_disclaimer: false });
  };

  const handleSaveChild = (childId: string) => {
    const data = editingChildren[childId];
    if (data) {
      updateChild.mutate({
        id: childId,
        ...data,
      });
    }
  };

  const updateChildField = (childId: string, field: string, value: unknown) => {
    setEditingChildren((prev) => ({
      ...prev,
      [childId]: {
        ...prev[childId],
        [field]: value,
      },
    }));
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
            <Accordion type="single" collapsible className="space-y-2">
              {children.map((child) => {
                const childData = editingChildren[child.id];
                
                return (
                  <AccordionItem
                    key={child.id}
                    value={child.id}
                    className="annia-glass rounded-lg border border-border/30 overflow-hidden"
                  >
                    <AccordionTrigger className="px-3 py-3 hover:no-underline hover:bg-muted/20 [&[data-state=open]]:border-b [&[data-state=open]]:border-border/30">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Baby weight="thin" className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="text-foreground font-medium">
                            {child.nickname || child.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {calculateAge(child.birth_date)}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-3 pb-4 pt-3">
                      {childData && (
                        <div className="space-y-4">
                          {/* Basic Info */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-muted-foreground">Nome</Label>
                              <Input
                                value={childData.name}
                                onChange={(e) => updateChildField(child.id, 'name', e.target.value)}
                                placeholder="Nome completo"
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Apelido</Label>
                              <Input
                                value={childData.nickname}
                                onChange={(e) => updateChildField(child.id, 'nickname', e.target.value)}
                                placeholder="Como chamamos"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs text-muted-foreground">Data de Nascimento</Label>
                              <Input
                                type="date"
                                value={childData.birth_date}
                                onChange={(e) => updateChildField(child.id, 'birth_date', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Gênero</Label>
                              <Select
                                value={childData.gender}
                                onValueChange={(value) => updateChildField(child.id, 'gender', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="female">Feminino</SelectItem>
                                  <SelectItem value="male">Masculino</SelectItem>
                                  <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Neurodivergent */}
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div>
                              <Label className="text-sm text-foreground">É neurodivergente?</Label>
                              <p className="text-xs text-muted-foreground">Adaptamos as sugestões ao ritmo único</p>
                            </div>
                            <Switch
                              checked={childData.is_neurodivergent}
                              onCheckedChange={(value) => updateChildField(child.id, 'is_neurodivergent', value)}
                            />
                          </div>

                          {childData.is_neurodivergent && (
                            <div>
                              <Label className="text-xs text-muted-foreground">Notas especiais</Label>
                              <Textarea
                                value={childData.special_needs_notes}
                                onChange={(e) => updateChildField(child.id, 'special_needs_notes', e.target.value)}
                                placeholder="Informações sobre necessidades específicas"
                                rows={2}
                              />
                            </div>
                          )}

                          {/* Health Info */}
                          <div className="border-t border-border/30 pt-4">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                              Informações de saúde
                            </h4>
                            
                            <div className="space-y-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">Alergias</Label>
                                <Input
                                  value={childData.allergies}
                                  onChange={(e) => updateChildField(child.id, 'allergies', e.target.value)}
                                  placeholder="Alimentos, medicamentos, etc."
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs text-muted-foreground">Tipo Sanguíneo</Label>
                                <Select
                                  value={childData.blood_type}
                                  onValueChange={(value) => updateChildField(child.id, 'blood_type', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label className="text-xs text-muted-foreground">Notas Médicas</Label>
                                <Textarea
                                  value={childData.medical_notes}
                                  onChange={(e) => updateChildField(child.id, 'medical_notes', e.target.value)}
                                  placeholder="Condições, medicamentos, etc."
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Personality */}
                          <div className="border-t border-border/30 pt-4">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                              Personalidade
                            </h4>
                            
                            <div className="space-y-3">
                              <div>
                                <Label className="text-xs text-muted-foreground">Traços de Personalidade</Label>
                                <Textarea
                                  value={childData.personality_traits}
                                  onChange={(e) => updateChildField(child.id, 'personality_traits', e.target.value)}
                                  placeholder="Como é o temperamento, preferências, etc."
                                  rows={2}
                                />
                              </div>
                              
                              <div>
                                <Label className="text-xs text-muted-foreground">O que acalma</Label>
                                <Textarea
                                  value={childData.soothing_methods}
                                  onChange={(e) => updateChildField(child.id, 'soothing_methods', e.target.value)}
                                  placeholder="Métodos para acalmar quando está chateado"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Consent Section */}
                          <div className="border-t border-border/30 pt-4">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                              Consentimento
                            </h4>
                            
                            {child.accepted_health_disclaimer ? (
                              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                                <div className="flex items-center gap-2">
                                  <Check weight="thin" className="h-4 w-4 text-primary" />
                                  <span className="text-sm text-muted-foreground">
                                    Aceito em {format(parseISO(child.updated_at), "dd/MM/yyyy")}
                                  </span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRevokeDisclaimer(child.id)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  Revogar
                                </Button>
                              </div>
                            ) : (
                              <div className="p-3 rounded-lg bg-muted/30">
                                <div className="flex items-center gap-2 mb-2">
                                  <Warning weight="thin" className="h-4 w-4 text-amber-500" />
                                  <span className="text-sm text-foreground">Disclaimer de saúde</span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                  Aceite o disclaimer para receber lembretes de vacinas e acompanhamento médico.
                                </p>
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">Li e aceito o disclaimer de saúde</Label>
                                  <Switch
                                    checked={false}
                                    onCheckedChange={() => handleAcceptDisclaimer(child.id)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Save Button */}
                          <Button
                            className="w-full"
                            onClick={() => handleSaveChild(child.id)}
                            disabled={updateChild.isPending}
                          >
                            Salvar alterações
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
          
          {children.length > 0 && (
            <Link to="/filhos">
              <Button variant="ghost" size="sm" className="w-full text-primary mt-3">
                Adicionar mais filhos
              </Button>
            </Link>
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

        {/* Perguntas Especiais da Annia */}
        <section>
          <h2 className="text-base font-medium text-foreground mb-3">
            Perguntas especiais da Annia
          </h2>
          
          <div className="annia-glass p-4 rounded-lg border border-border/30">
            <div className="flex items-start gap-3 mb-4">
              <ChatCircleDots weight="thin" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground">
                  Suas respostas nos ajudam a te conhecer melhor e personalizar minha ajuda.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Você ainda não respondeu. Que tal começar?
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <a 
                href="https://wa.me/5511999999999?text=Quero%20atualizar%20minhas%20respostas"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappLogo weight="thin" className="h-4 w-4 mr-2" />
                Atualizar respostas via WhatsApp
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
