import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Tag } from '@phosphor-icons/react';
import { useAddItem, useShoppingTags } from '@/hooks/useShoppingList';

export function AddItemForm() {
  const [newItem, setNewItem] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [newTagInput, setNewTagInput] = useState('');

  const { data: tags = [] } = useShoppingTags();
  const addItem = useAddItem();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Determina a tag a usar: nova tag > tag selecionada
    const usedTagName = newTagInput.trim() || selectedTag;
    if (newItem.trim() && usedTagName) {

      addItem.mutate(
        { name: newItem, tagName: usedTagName },
        {
          onSuccess: () => {
            // Sticky Tag: mantém a tag selecionada, limpa apenas o nome
            setNewItem('');
            
            // Se criou nova tag, ela vira a selecionada para próximos itens
            if (newTagInput.trim()) {
              setSelectedTag(newTagInput.trim());
            }
            setNewTagInput('');
          },
        }
      );
    }
  };

  const showTagSelector = newItem.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="annia-glass p-3 rounded-lg mb-8">
      {/* Linha principal: Input + Botão */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Adicionar item…"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 bg-transparent border-border/50 focus:border-primary/50"
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-foreground hover:bg-transparent"
          disabled={!newItem.trim() || addItem.isPending}
        >
          <Plus weight="thin" className="h-5 w-5" />
        </Button>
      </div>

      {/* Seletor de tag - aparece após digitar */}
      {showTagSelector && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
          <Tag weight="thin" className="h-4 w-4 text-muted-foreground shrink-0" />
          
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="h-8 text-xs bg-transparent border-border/30 w-36">
              <SelectValue placeholder="Sem categoria" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag.id} value={tag.name}>
                  {tag.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-xs text-muted-foreground">ou</span>

          <Input
            type="text"
            placeholder="Nova tag…"
            value={newTagInput}
            onChange={(e) => {
              setNewTagInput(e.target.value);
              if (e.target.value.trim()) {
                setSelectedTag('__none__'); // Limpa seleção se digitou nova
              }
            }}
            className="h-8 text-xs bg-transparent border-border/30 w-28"
          />
        </div>
      )}
    </form>
  );
}
