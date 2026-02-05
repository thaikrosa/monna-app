
# Plano: Gerar 3 Páginas HTML Estáticas

## Resumo

Criar 3 arquivos HTML estáticos (não-SPA) com o conteúdo completo das páginas do Monna para publicação direta no domínio monna.ia.br:

1. **index.html** - Landing Page principal
2. **privacidade.html** - Política de Privacidade
3. **termos.html** - Termos de Uso

## Características dos HTMLs

- **100% estáticos** - sem JavaScript obrigatório, sem React, sem SPA
- **CSS inline** - todos os estilos embutidos no próprio HTML
- **Responsivos** - funcionam em mobile e desktop
- **SEO-friendly** - meta tags completas
- **Cores do Design System Monna** - burgundy (#531C22), warm beige (#F9F3ED), etc.

## Estrutura dos Arquivos

```text
monna.ia.br/
├── index.html          ← Landing Page
├── privacidade.html    ← Política de Privacidade (ou /privacidade/index.html)
└── termos.html         ← Termos de Uso (ou /termos/index.html)
```

## Conteúdo de Cada Página

### 1. index.html (Landing Page)
- Navbar com logo e link de login
- Hero Section com título, subtítulo e CTA
- Seção de Depoimentos (5 cards estáticos, sem carrossel JS)
- Seção "Como Funciona" (3 passos)
- Seção de Funcionalidades (6 cards)
- Seção FAQ (expandível com CSS puro ou estático)
- CTA Final com botão WhatsApp
- Footer com links

### 2. privacidade.html
- Header simples com logo e título
- Todas as 11 seções da política de privacidade
- Informações sobre LGPD e Google API compliance
- Footer

### 3. termos.html  
- Header simples com logo e título
- Todas as 13 seções dos termos de uso
- Aviso sobre saúde em destaque
- Footer

## Seção Técnica

### Paleta de Cores (CSS Variables)
```css
:root {
  --background: hsl(30, 33%, 85%);      /* #D9CBBF - warm beige */
  --foreground: hsl(0, 69%, 8%);        /* #220707 - dark burgundy */
  --card: hsl(30, 47%, 95%);            /* #F9F3ED - cream */
  --primary: hsl(353, 50%, 22%);        /* #531C22 - burgundy */
  --primary-foreground: hsl(30, 47%, 95%);
  --muted-foreground: hsl(0, 40%, 35%);
  --border: hsl(30, 25%, 80%);
}
```

### Estrutura HTML Base
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Monna - Sua parceira no invisível da maternidade</title>
  <meta name="description" content="...">
  <link rel="icon" type="image/png" href="/monna-favicon.png">
  <style>/* CSS inline */</style>
</head>
<body>
  <!-- Conteúdo -->
</body>
</html>
```

### Navegação entre páginas
- Links diretos: `href="/privacidade"` e `href="/termos"`
- Botão voltar nos legais: `href="/"`

## O Que Será Criado

| Arquivo | Localização no projeto |
|---------|----------------------|
| `public/static/index.html` | Landing page |
| `public/static/privacidade.html` | Política de Privacidade |
| `public/static/termos.html` | Termos de Uso |

Você poderá baixar esses arquivos e publicar diretamente no seu servidor/hosting.

## Observações

- O logo Monna precisará ser hospedado separadamente (você pode usar um CDN ou incluir como base64)
- Os ícones serão representados por emojis ou SVGs inline para não depender de bibliotecas externas
- O FAQ pode funcionar com `<details>/<summary>` HTML nativo (sem JS)
