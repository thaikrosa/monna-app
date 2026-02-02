
# Plano: Destacar Visualmente a Lista "Mercado"

## Resumo

Adicionar diferenciação visual sutil para a tab "Mercado" (lista principal protegida), usando uma borda com cor `primary` que a destaca das demais listas, respeitando o design system Monna.

---

## O Que Será Feito

**Arquivo:** `src/pages/ShoppingList.tsx`

Modificar a renderização das tabs para aplicar uma classe diferenciada à tag "Mercado":

- **Tabs normais (não-ativas):** `bg-card text-primary/70 border border-border`
- **Tab Mercado (não-ativa):** `bg-card text-primary/70 border-2 border-primary/40`
- **Qualquer tab ativa:** mantém o comportamento atual com `bg-primary text-primary-foreground`

Essa diferenciação sutil (borda mais espessa e com cor primary) indica visualmente que "Mercado" é especial, sem quebrar a harmonia do design system.

---

## Visual Esperado

| Estado | Tab Normal | Tab Mercado |
|--------|------------|-------------|
| Não-ativa | `border border-border` | `border-2 border-primary/40` |
| Ativa | `bg-primary text-primary-foreground` | `bg-primary text-primary-foreground` |

---

## Comportamento Adicional

A tab "Mercado" também não exibirá o ícone de edição (lápis), já que seu nome não pode ser alterado. Isso reforça a mensagem de que é uma lista protegida.

---

## Seção Técnica

### Mudança no código (ShoppingList.tsx, linhas 108-127)

```tsx
{sortedTags.map((tag) => {
  const isMercado = tag.name.toLowerCase().trim() === 'mercado';
  
  return (
    <TabsTrigger
      key={tag.id}
      value={tag.id}
      className={`relative px-3 py-1.5 text-xs rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground bg-card text-primary/70 shadow-sm transition-colors duration-150 ${
        isMercado 
          ? 'border-2 border-primary/40' 
          : 'border border-border'
      }`}
    >
      {tag.name}
      {/* Ícone de edição - só aparece quando tab está ativa E não é Mercado */}
      {activeTab === tag.id && !isMercado && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditingTag({ id: tag.id, name: tag.name });
          }}
          className="ml-1.5 opacity-70 hover:opacity-100 transition-opacity"
        >
          <PencilSimple weight="thin" className="h-3 w-3" />
        </button>
      )}
    </TabsTrigger>
  );
})}
```

### Resumo das alterações

1. Adiciona verificação `isMercado` baseada no nome normalizado da tag
2. Aplica `border-2 border-primary/40` para Mercado, `border border-border` para as demais
3. Remove o ícone de edição da tab Mercado (já que não pode ser renomeada)

---

## O Que NÃO Será Alterado

- Cores do design system
- Comportamento de seleção das tabs
- Lógica de ordenação (Mercado continua primeiro)
- Proteção de exclusão no EditTagDialog
