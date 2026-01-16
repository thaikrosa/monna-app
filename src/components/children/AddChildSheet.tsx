import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAddChild } from '@/hooks/useChildren';
import { Warning } from '@phosphor-icons/react';

interface AddChildSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'outro', label: 'Outro' },
];

export function AddChildSheet({ open, onOpenChange }: AddChildSheetProps) {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  
  // Identity
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  
  // Sensitivity
  const [showMilestones, setShowMilestones] = useState(true);
  const [isNeurodivergent, setIsNeurodivergent] = useState(false);
  const [specialNeedsNotes, setSpecialNeedsNotes] = useState('');
  
  // Health
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [vaccinationReminders, setVaccinationReminders] = useState(true);
  
  // Child's Manual
  const [soothingMethods, setSoothingMethods] = useState('');
  const [personalityTraits, setPersonalityTraits] = useState('');

  const addChild = useAddChild();

  const canSubmit = disclaimerAccepted && name.trim() && birthDate;

  const resetForm = () => {
    setDisclaimerAccepted(false);
    setName('');
    setNickname('');
    setBirthDate('');
    setGender('');
    setShowMilestones(true);
    setIsNeurodivergent(false);
    setSpecialNeedsNotes('');
    setBloodType('');
    setAllergies('');
    setMedicalNotes('');
    setVaccinationReminders(true);
    setSoothingMethods('');
    setPersonalityTraits('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    addChild.mutate(
      {
        name: name.trim(),
        nickname: nickname.trim() || null,
        birth_date: birthDate,
        gender: gender || null,
        show_standard_milestones: showMilestones,
        is_neurodivergent: isNeurodivergent,
        special_needs_notes: specialNeedsNotes.trim() || null,
        blood_type: bloodType || null,
        allergies: allergies.trim() || null,
        medical_notes: medicalNotes.trim() || null,
        vaccination_reminders_enabled: vaccinationReminders,
        soothing_methods: soothingMethods.trim() || null,
        personality_traits: personalityTraits.trim() || null,
        accepted_health_disclaimer: true,
      },
      {
        onSuccess: () => {
          resetForm();
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Cadastrar Criança</SheetTitle>
          <SheetDescription>
            Adicione seu filho(a) à Monna
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Health Disclaimer */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-3">
              <Warning weight="thin" className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-3">
                <p className="text-sm text-amber-200/90">
                  A Monna é uma assistente de organização baseada em dados oficiais e não substitui orientações médicas. Consulte sempre seu pediatra.
                </p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="disclaimer"
                    checked={disclaimerAccepted}
                    onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
                  />
                  <Label htmlFor="disclaimer" className="text-sm text-amber-200/80 cursor-pointer">
                    Li e compreendo este aviso
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Identity Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Identidade
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs text-muted-foreground">
                Nome *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-xs text-muted-foreground">
                Apelido
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Como você chama"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-xs text-muted-foreground">
                Data de Nascimento *
              </Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Gênero</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {GENDERS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sensitivity Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sensibilidade
            </h4>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Mostrar marcos de desenvolvimento</Label>
                <p className="text-xs text-muted-foreground">
                  Exibir marcos padrão por idade
                </p>
              </div>
              <Switch
                checked={showMilestones}
                onCheckedChange={setShowMilestones}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">É neurodivergente</Label>
                <p className="text-xs text-muted-foreground">
                  TEA, TDAH, ou outras condições
                </p>
              </div>
              <Switch
                checked={isNeurodivergent}
                onCheckedChange={setIsNeurodivergent}
              />
            </div>

            {isNeurodivergent && (
              <div className="space-y-2">
                <Label htmlFor="specialNeeds" className="text-xs text-muted-foreground">
                  Notas de necessidades especiais
                </Label>
                <Textarea
                  id="specialNeeds"
                  value={specialNeedsNotes}
                  onChange={(e) => setSpecialNeedsNotes(e.target.value)}
                  placeholder="Informações relevantes sobre necessidades especiais"
                  className="bg-background/50 min-h-[80px]"
                />
              </div>
            )}
          </div>

          {/* Health Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Saúde
            </h4>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Tipo Sanguíneo</Label>
              <Select value={bloodType} onValueChange={setBloodType}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies" className="text-xs text-muted-foreground">
                Alergias
              </Label>
              <Input
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Ex: Amendoim, Lactose"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalNotes" className="text-xs text-muted-foreground">
                Notas Médicas
              </Label>
              <Textarea
                id="medicalNotes"
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="Informações médicas importantes"
                className="bg-background/50 min-h-[80px]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Lembrar vacinas previstas</Label>
                <p className="text-xs text-muted-foreground">
                  Notificações de vacinação
                </p>
              </div>
              <Switch
                checked={vaccinationReminders}
                onCheckedChange={setVaccinationReminders}
              />
            </div>
          </div>

          {/* Child's Manual Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Manual do Filho
            </h4>

            <div className="space-y-2">
              <Label htmlFor="soothing" className="text-xs text-muted-foreground">
                O que o acalma?
              </Label>
              <Textarea
                id="soothing"
                value={soothingMethods}
                onChange={(e) => setSoothingMethods(e.target.value)}
                placeholder="Técnicas que funcionam para acalmar"
                className="bg-background/50 min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality" className="text-xs text-muted-foreground">
                Traços de personalidade
              </Label>
              <Textarea
                id="personality"
                value={personalityTraits}
                onChange={(e) => setPersonalityTraits(e.target.value)}
                placeholder="Características marcantes da personalidade"
                className="bg-background/50 min-h-[80px]"
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || addChild.isPending}
          >
            {addChild.isPending ? 'Salvando...' : 'Salvar criança'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
