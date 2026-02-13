import { ChildFormFields, type ChildFormData } from '@/components/shared/ChildFormFields';

// Re-export the shared type
export type { ChildFormData };

interface ChildFormProps {
  data: ChildFormData;
  onChange: (field: keyof ChildFormData, value: unknown) => void;
  showRequired?: boolean;
}

export function ChildForm({ data, onChange, showRequired = false }: ChildFormProps) {
  return (
    <ChildFormFields
      data={data}
      onChange={onChange as <K extends keyof ChildFormData>(field: K, value: ChildFormData[K]) => void}
      showRequired={showRequired}
      variant="compact"
    />
  );
}
