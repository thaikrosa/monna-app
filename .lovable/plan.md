
# Corrigir dominio e links legais em todo o projeto

## Resumo das mudancas

Duas categorias: (A) trocar dominio Lovable pelo oficial, (B) apontar links legais para arquivos estaticos.

---

## Mudancas detalhadas

### 1. `public/static/index.html` — Dominio Lovable (2 ocorrencias)

| Linha | De | Para |
|-------|-----|------|
| 591 | `href="https://anniawebapp.lovable.app/auth"` | `href="https://monna.ia.br/auth"` |
| 842 | `href="https://anniawebapp.lovable.app/auth"` | `href="https://monna.ia.br/auth"` |

### 2. `public/static/privacidade.html` — Link de Termos no footer

| Linha | De | Para |
|-------|-----|------|
| 336 | `href="/termos"` | `href="/static/termos.html"` |

### 3. `public/static/termos.html` — Link de Privacidade no footer

| Linha | De | Para |
|-------|-----|------|
| 322 | `href="/privacidade"` | `href="/static/privacidade.html"` |

### 4. `src/pages/Auth.tsx` — Links legais no login (React)

| Linha | De | Para |
|-------|-----|------|
| 68 | `<Link to="/termos">` | `<a href="/static/termos.html" target="_blank" rel="noopener noreferrer">` |
| 72 | `<Link to="/privacidade">` | `<a href="/static/privacidade.html" target="_blank" rel="noopener noreferrer">` |

### 5. `src/pages/BemVinda.tsx` — Links legais no onboarding

| Linha | De | Para |
|-------|-----|------|
| 293 | `href="/termos"` | `href="/static/termos.html"` |
| 313 | `href="/privacidade"` | `href="/static/privacidade.html"` |

### 6. `src/pages/Settings.tsx` — Links legais nas configuracoes (React)

| Linha | De | Para |
|-------|-----|------|
| 471 | `<Link to="/termos">` | Trocar para `<a href="/static/termos.html" target="_blank" rel="noopener noreferrer">` (manter mesma aparencia) |
| 481 | `<Link to="/privacidade">` | Trocar para `<a href="/static/privacidade.html" target="_blank" rel="noopener noreferrer">` |

### 7. `src/pages/Cookies.tsx` — Links legais na pagina de cookies (React)

| Linha | De | Para |
|-------|-----|------|
| 284 | `<Link to="/privacidade">` | `<a href="/static/privacidade.html" target="_blank" rel="noopener noreferrer">` |
| 288 | `<Link to="/termos">` | `<a href="/static/termos.html" target="_blank" rel="noopener noreferrer">` |

### 8. `src/components/landing/LandingFooter.tsx` — Links no footer da landing SPA

| Item | De | Para |
|------|-----|------|
| footerLinks.legal, "Termos de uso" | `href: "/termos"` | `href: "/static/termos.html"` |
| footerLinks.legal, "Politica de Privacidade" | `href: "/privacidade"` | `href: "/static/privacidade.html"` |

---

## Total: 13 trocas em 8 arquivos

Nenhuma funcionalidade sera alterada alem dos links.
