
# Atualizar logo nos arquivos estaticos

O arquivo `logo_monna_original-01.png` sera copiado para `public/static/logo_monna_original-01.png` e as tags `<img>` nos tres arquivos estaticos serao atualizadas.

## Mudancas

**Copiar arquivo**: `user-uploads://logo_monna_original-01.png` para `public/static/logo_monna_original-01.png`

**Arquivo 1**: `public/static/index.html`
- Linha 589: trocar `src="https://anniawebapp.lovable.app/assets/logo-monna-BQjBg9UU.png"` por `src="/static/logo_monna_original-01.png"`
- Linha 833: mesma troca

**Arquivo 2**: `public/static/privacidade.html`
- Linha 197: trocar `src="https://anniawebapp.lovable.app/assets/logo-monna-BQjBg9UU.png"` por `src="/static/logo_monna_original-01.png"`

**Arquivo 3**: `public/static/termos.html`
- Linha 211: trocar `src="https://anniawebapp.lovable.app/assets/logo-monna-BQjBg9UU.png"` por `src="/static/logo_monna_original-01.png"`

Total: 4 tags `<img>` atualizadas em 3 arquivos.
