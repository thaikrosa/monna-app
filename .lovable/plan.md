

# Adicionar botao "Ir para o aplicativo" no Step 4 do onboarding

## O que muda

No arquivo `src/pages/BemVinda.tsx`, dentro do bloco do Step 4 (a tela final "Prontinho"), sera adicionado um `<Button>` com o texto **"Ir para o aplicativo"** logo apos o paragrafo "Se a mensagem ainda nao chegou, aguarde alguns segundinhos.".

## Detalhes tecnicos

**Arquivo**: `src/pages/BemVinda.tsx`

- Apos a linha 270 (o `<p>` com "Se a mensagem ainda nao chegou..."), inserir:

```tsx
<Button onClick={() => navigate('/home')} className="w-full" size="lg">
  Ir para o aplicativo
</Button>
```

- O componente `Button` e o hook `navigate` ja estao importados e disponiveis no arquivo, entao nenhuma importacao adicional e necessaria.
- O botao seguira o mesmo estilo visual (primary, full-width, tamanho `lg`) usado nos outros steps do wizard.

**Total**: 1 insercao em 1 arquivo.

