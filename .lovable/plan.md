

# Redirecionar botoes da pagina estatica para a selecao de planos

## Problema atual

Na pagina `public/static/index.html`:

- **"Quero testar gratis"** (Hero, linha 615): aponta para `#cta-final` (ancora interna)
- **"Comecar meu teste gratis"** (Features, linha 750): aponta para `#cta-final` (ancora interna)
- **"Comecar meu teste gratis"** (CTA Final, linha 802): aponta para WhatsApp (`https://wa.me/...`)

Nenhum deles leva a pagina de selecao de planos/assinatura.

## Solucao

Como a selecao de planos vive no React (componente `PlanSelectionDialog` na landing page `/`), a abordagem sera:

1. **Adicionar deteccao de hash na React LandingPage**: Quando a URL tiver `#planos`, abrir automaticamente o `PlanSelectionDialog`.

2. **Atualizar os 3 botoes na pagina estatica**: Todos apontarao para `https://monna.ia.br/#planos`, que carregara a landing React e abrira o dialog de planos automaticamente.

## Arquivos modificados

### 1. `src/pages/LandingPage.tsx`

Adicionar um `useEffect` que detecta o hash `#planos` na URL e chama `setDialogOpen(true)`:

```ts
useEffect(() => {
  if (location.hash === '#planos') {
    setDialogOpen(true);
    window.history.replaceState(null, '', location.pathname);
  }
}, [location.hash]);
```

### 2. `public/static/index.html`

Alterar os `href` dos 3 botoes:

- **Linha 615** (Hero): de `#cta-final` para `https://monna.ia.br/#planos`
- **Linha 750** (Features): de `#cta-final` para `https://monna.ia.br/#planos`
- **Linha 802** (CTA Final): de `https://wa.me/...` para `https://monna.ia.br/#planos`

## Resumo

- 2 arquivos modificados
- 1 useEffect adicionado no LandingPage
- 3 links atualizados no HTML estatico
- Nenhum componente novo criado

