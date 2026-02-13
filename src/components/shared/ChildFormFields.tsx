import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ChildFormData {
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
  show_standard_milestones?: boolean;
  vaccination_reminders_enabled?: boolean;
}

export const emptyChildFormData: ChildFormData = {
  name: '',
  nickname: '',
  birth_date: '',
  gender: '',
  is_neurodivergent: false,
  special_needs_notes: '',
  allergies: '',
  blood_type: '',
  medical_notes: '',
  personality_traits: '',
  soothing_methods: '',
  show_standard_milestones: true,
  vaccination_reminders_enabled: true,
};

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = [
  { value: 'female', label: 'Feminino' },
  { value: 'male', label: 'Masculino' },
  { value: 'other', label: 'Outro' },
];

interface ChildFormFieldsProps {
  data: ChildFormData;
  onChange: <K extends keyof ChildFormData>(field: K, value: ChildFormData[K]) => void;
  showRequired?: boolean;
  variant?: 'compact' | 'full';
}

export function ChildFormFields({
  data,
  onChange,
  showRequired = false,
  variant = 'compact',
}: ChildFormFieldsProps) {
  const inputClass = variant === 'full' ? 'bg-background/50' : '';

  return (
    <div className="space-y-4">
      {/* Identity Section */}
      {variant === 'full' && (
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Identidade
        </h4>
      )}

      <div className={variant === 'compact' ? 'grid grid-cols-2 gap-3' : 'space-y-4'}>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Nome {showRequired && '*'}
          </Label>
          <Input
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nome completo"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Apelido</Label>
          <Input
            value={data.nickname}
            onChange={(e) => onChange('nickname', e.target.value)}
            placeholder="Como chamamos"
            className={inputClass}
          />
        </div>
      </div>

      <div className={variant === 'compact' ? 'grid grid-cols-2 gap-3' : 'space-y-4'}>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            Data de Nascimento {showRequired && '*'}
          </Label>
          <Input
            type="date"
            value={data.birth_date}
            onChange={(e) => onChange('birth_date', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Gênero</Label>
          <Select
            value={data.gender}
            onValueChange={(value) => onChange('gender', value)}
          >
            <SelectTrigger className={inputClass}>
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
      {variant === 'full' && (
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider pt-2">
          Sensibilidade
        </h4>
      )}

      {variant === 'full' && data.show_standard_milestones !== undefined && (
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-sm">Mostrar marcos de desenvolvimento</Label>
            <p className="text-xs text-muted-foreground">
              Exibir marcos padrão por idade
            </p>
          </div>
          <Switch
            checked={data.show_standard_milestones}
            onCheckedChange={(value) => onChange('show_standard_milestones', value)}
          />
        </div>
      )}

      <div className={variant === 'compact' ? 'flex items-center justify-between p-3 rounded-lg bg-muted/30' : 'flex items-center justify-between'}>
        <div className={variant === 'compact' ? '' : 'space-y-0.5'}>
          <Label className="text-sm text-foreground">É neurodivergente?</Label>
          <p className="text-xs text-muted-foreground">
            {variant === 'compact' ? 'Ajusto as sugestões ao ritmo único' : 'TEA, TDAH, ou outras condições'}
          </p>
        </div>
        <Switch
          checked={data.is_neurodivergent}
          onCheckedChange={(value) => onChange('is_neurodivergent', value)}
        />
      </div>

      {data.is_neurodivergent && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">
            {variant === 'compact' ? 'Notas especiais' : 'Notas de necessidades especiais'}
          </Label>
          <Textarea
            value={data.special_needs_notes}
            onChange={(e) => onChange('special_needs_notes', e.target.value)}
            placeholder="Informações sobre necessidades específicas"
            rows={2}
            className={inputClass}
          />
        </div>
      )}

      {/* Health Section */}
      <div className={variant === 'compact' ? 'border-t border-border/30 pt-4' : ''}>
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          {variant === 'compact' ? 'Informações de saúde' : 'Saúde'}
        </h4>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Tipo Sanguíneo</Label>
            <Select
              value={data.blood_type}
              onValueChange={(value) => onChange('blood_type', value)}
            >
              <SelectTrigger className={inputClass}>
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
            <Label className="text-xs text-muted-foreground">Alergias</Label>
            <Input
              value={data.allergies}
              onChange={(e) => onChange('allergies', e.target.value)}
              placeholder={variant === 'compact' ? 'Alimentos, medicamentos, etc.' : 'Ex: Amendoim, Lactose'}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Notas Médicas</Label>
            <Textarea
              value={data.medical_notes}
              onChange={(e) => onChange('medical_notes', e.target.value)}
              placeholder={variant === 'compact' ? 'Condições, medicamentos, etc.' : 'Informações médicas importantes'}
              rows={2}
              className={inputClass}
            />
          </div>

          {variant === 'full' && data.vaccination_reminders_enabled !== undefined && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Lembrar vacinas previstas</Label>
                <p className="text-xs text-muted-foreground">
                  Notificações de vacinação
                </p>
              </div>
              <Switch
                checked={data.vaccination_reminders_enabled}
                onCheckedChange={(value) => onChange('vaccination_reminders_enabled', value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Personality Section */}
      <div className={variant === 'compact' ? 'border-t border-border/30 pt-4' : ''}>
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          {variant === 'compact' ? 'Personalidade' : 'Manual do Filho'}
        </h4>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              {variant === 'compact' ? 'Traços de Personalidade' : 'Traços de personalidade'}
            </Label>
            <Textarea
              value={data.personality_traits}
              onChange={(e) => onChange('personality_traits', e.target.value)}
              placeholder={variant === 'compact' ? 'Como é o temperamento, preferências, etc.' : 'Características marcantes da personalidade'}
              rows={2}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">
              {variant === 'compact' ? 'O que acalma' : 'O que o acalma?'}
            </Label>
            <Textarea
              value={data.soothing_methods}
              onChange={(e) => onChange('soothing_methods', e.target.value)}
              placeholder="Métodos para acalmar quando necessário"
              rows={2}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
