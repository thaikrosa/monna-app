
# Plano: Adicionar Transparência OAuth para Verificação Google

## Resumo

Adicionar textos mínimos e discretos para atender aos requisitos de verificação OAuth do Google, sem alterar a identidade visual ou funcionalidades existentes.

---

## Alteração 1: Nova Pergunta no FAQ

**Arquivo:** `src/components/landing/FAQSection.tsx`

**O que será feito:**
Inserir uma nova entrada no array `faqs`, logo após a pergunta "Funciona com a agenda que eu já uso?" (posição 1 do array).

**Conteúdo exato:**
- **Pergunta:** "Como a Monna usa minha agenda do Google?"
- **Resposta:** "A Monna acessa o Google Calendar somente após o seu consentimento explícito, por meio do login Google. O acesso é utilizado exclusivamente para criar, atualizar e organizar eventos e lembretes solicitados por você dentro do aplicativo. Nenhuma informação da sua agenda é utilizada para fins publicitários, compartilhada com terceiros ou usada para treinar modelos de inteligência artificial."

**Visual:** Mantém o mesmo estilo de accordion das outras perguntas (sem alteração de CSS).

---

## Alteração 2: Texto de Transparência na Tela de Login

**Arquivo:** `src/pages/Auth.tsx`

**O que será feito:**
Adicionar um parágrafo discreto entre o botão "Continuar com Google" e os links de Termos/Privacidade.

**Conteúdo exato:**
"Usamos sua conta Google apenas para autenticação e, se autorizado por você, para integração com o Google Calendar."

**Estilo:** Utilizará exatamente as mesmas classes CSS dos textos auxiliares existentes:
```
text-xs text-muted-foreground text-center
```

---

## O Que NÃO Será Alterado

- Cores, tipografia, espaçamentos
- Headlines, CTAs ou textos existentes
- Estrutura visual das seções
- Links de Política de Privacidade
- Nenhuma funcionalidade existente
- Nenhum banner, pop-up ou checkbox

---

## Seção Técnica

### Mudanças no código

**FAQSection.tsx (linhas 5-26)**
```typescript
const faqs = [
  {
    question: "Funciona com a agenda que eu já uso?",
    answer: "Sim! Monna sincroniza com Google Calendar. Você não precisa mudar nada da sua rotina.",
  },
  // NOVA ENTRADA AQUI (posição 1)
  {
    question: "Como a Monna usa minha agenda do Google?",
    answer: "A Monna acessa o Google Calendar somente após o seu consentimento explícito, por meio do login Google. O acesso é utilizado exclusivamente para criar, atualizar e organizar eventos e lembretes solicitados por você dentro do aplicativo. Nenhuma informação da sua agenda é utilizada para fins publicitários, compartilhada com terceiros ou usada para treinar modelos de inteligência artificial.",
  },
  // ... restante do array permanece igual
];
```

**Auth.tsx (entre linhas 58 e 60)**
```tsx
{/* Novo texto de transparência OAuth */}
<p className="text-xs text-muted-foreground text-center">
  Usamos sua conta Google apenas para autenticação e, se autorizado por você, para integração com o Google Calendar.
</p>

{/* Legal links - já existente */}
<p className="text-xs text-muted-foreground text-center">
  Ao continuar, você concorda com nossos...
```

---

## Critérios de Aceitação Atendidos

| Critério | Status |
|----------|--------|
| Landing page visualmente idêntica | Sim |
| Nenhuma funcionalidade alterada | Sim |
| Explica uso de Google Calendar e OAuth | Sim |
| Conteúdo visível sem login | Sim (FAQ na landing) |
| Link de Privacidade inalterado | Sim |
