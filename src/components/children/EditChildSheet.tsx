import { useState, useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateChild, Child } from '@/hooks/useChildren';
import { Info } from '@phosphor-icons/react';

interface EditChildSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  child: Child | null;
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = [
  { value: 'feminino', label: 'Feminino' },
  { value: 'masculino', label: 'Masculino' },
  { value: 'outro', label: 'Outro' },
];

export function EditChildSheet({ open, onOpenChange, child }: EditChildSheetProps) {
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

  const updateChild = useUpdateChild();

  // Populate form when child changes
  useEffect(() => {
    if (child) {
      setName(child.name);
      setNickname(child.nickname || '');
      setBirthDate(child.birth_date);
      setGender(child.gender || '');
      setShowMilestones(child.show_standard_milestones ?? true);
      setIsNeurodivergent(child.is_neurodivergent ?? false);
      setSpecialNeedsNotes(child.special_needs_notes || '');
      setBloodType(child.blood_type || '');
      setAllergies(child.allergies || '');
      setMedicalNotes(child.medical_notes || '');
      setVaccinationReminders(child.vaccination_reminders_enabled ?? true);
      setSoothingMethods(child.soothing_methods || '');
      setPersonalityTraits(child.personality_traits || '');
    }
  }, [child]);

  const canSubmit = name.trim() && birthDate;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !child) return;

    updateChild.mutate(
      {
        id: child.id,
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
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar Criança</SheetTitle>
          <SheetDescription>
            Atualize os dados de {child?.nickname || child?.name}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Health Disclaimer Reference */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-start gap-2">
              <Info weight="thin" className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Lembre-se: a Monna não substitui orientações médicas.
              </p>
            </div>
          </div>

          {/* Identity Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Identidade
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-xs text-muted-foreground">
                Nome *
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-nickname" className="text-xs text-muted-foreground">
                Apelido
              </Label>
              <Input
                id="edit-nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Como você chama"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-birthDate" className="text-xs text-muted-foreground">
                Data de Nascimento *
              </Label>
              <Input
                id="edit-birthDate"
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
                <Label htmlFor="edit-specialNeeds" className="text-xs text-muted-foreground">
                  Notas de necessidades especiais
                </Label>
                <Textarea
                  id="edit-specialNeeds"
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
              <Label htmlFor="edit-allergies" className="text-xs text-muted-foreground">
                Alergias
              </Label>
              <Input
                id="edit-allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Ex: Amendoim, Lactose"
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-medicalNotes" className="text-xs text-muted-foreground">
                Notas Médicas
              </Label>
              <Textarea
                id="edit-medicalNotes"
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
              <Label htmlFor="edit-soothing" className="text-xs text-muted-foreground">
                O que o acalma?
              </Label>
              <Textarea
                id="edit-soothing"
                value={soothingMethods}
                onChange={(e) => setSoothingMethods(e.target.value)}
                placeholder="Técnicas que funcionam para acalmar"
                className="bg-background/50 min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-personality" className="text-xs text-muted-foreground">
                Traços de personalidade
              </Label>
              <Textarea
                id="edit-personality"
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
            disabled={!canSubmit || updateChild.isPending}
          >
            {updateChild.isPending ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
