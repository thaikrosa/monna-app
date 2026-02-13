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
}

interface ChildFormProps {
  data: ChildFormData;
  onChange: (field: keyof ChildFormData, value: unknown) => void;
  showRequired?: boolean;
}

export function ChildForm({ data, onChange, showRequired = false }: ChildFormProps) {
  return (
    <div className="space-y-4">
      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">
            Nome {showRequired && '*'}
          </Label>
          <Input
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Nome completo"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Apelido</Label>
          <Input
            value={data.nickname}
            onChange={(e) => onChange('nickname', e.target.value)}
            placeholder="Como chamamos"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">
            Data de Nascimento {showRequired && '*'}
          </Label>
          <Input
            type="date"
            value={data.birth_date}
            onChange={(e) => onChange('birth_date', e.target.value)}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Gênero</Label>
          <Select
            value={data.gender}
            onValueChange={(value) => onChange('gender', value)}
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
          <p className="text-xs text-muted-foreground">Ajusto as sugestões ao ritmo único</p>
        </div>
        <Switch
          checked={data.is_neurodivergent}
          onCheckedChange={(value) => onChange('is_neurodivergent', value)}
        />
      </div>

      {data.is_neurodivergent && (
        <div>
          <Label className="text-xs text-muted-foreground">Notas especiais</Label>
          <Textarea
            value={data.special_needs_notes}
            onChange={(e) => onChange('special_needs_notes', e.target.value)}
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
              value={data.allergies}
              onChange={(e) => onChange('allergies', e.target.value)}
              placeholder="Alimentos, medicamentos, etc."
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">Tipo Sanguíneo</Label>
            <Select
              value={data.blood_type}
              onValueChange={(value) => onChange('blood_type', value)}
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
              value={data.medical_notes}
              onChange={(e) => onChange('medical_notes', e.target.value)}
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
              value={data.personality_traits}
              onChange={(e) => onChange('personality_traits', e.target.value)}
              placeholder="Como é o temperamento, preferências, etc."
              rows={2}
            />
          </div>

          <div>
            <Label className="text-xs text-muted-foreground">O que acalma</Label>
            <Textarea
              value={data.soothing_methods}
              onChange={(e) => onChange('soothing_methods', e.target.value)}
              placeholder="Métodos para acalmar quando necessário"
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
