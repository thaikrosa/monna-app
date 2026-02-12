

## Fix: Validacao do WhatsApp mostrando erro durante digitacao

### Problema
O `onChange` do input WhatsApp chama `setWhatsappTouched(true)` a cada tecla digitada (linha 444). Isso faz a mensagem de erro aparecer imediatamente enquanto a pessoa ainda esta digitando, em vez de esperar ela sair do campo.

### Correcao
Remover `setWhatsappTouched(true)` do handler `onChange`, mantendo-o apenas no `onBlur` (linha 446). Assim:

- **Antes de digitar**: sem erro (touched = false)
- **Durante digitacao**: sem erro (touched = false, so muda no blur)
- **Apos sair do campo com numero incompleto**: erro aparece (touched = true + invalido)
- **Botao "Continuar"**: continua sempre desabilitado quando invalido (nao depende de touched)

### Arquivo alterado
- `src/pages/BemVinda.tsx` -- remover uma unica linha (`setWhatsappTouched(true)`) do onChange (linha 444)

### O que NAO muda
- Logica do botao "Continuar" (ja esta correta, valida independente de touched)
- onBlur (ja esta correto)
- Condicao da mensagem de erro (ja esta correta)
- Nenhum outro arquivo

