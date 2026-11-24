# Validação de formulários

Atividade não presencial de Front-End (IFCE): página de cadastro com validação feita em JavaScript externo.

**Página publicada:** https://yuricalves.github.io/Validacao_Formularios_JS/

## Arquivos
- `index.html`: estrutura do formulário, com labels associados aos campos
- `estilos.css`: estilos da página
- `funcoes.js`: funções de validação, carregadas com `defer`

## Validações
- `validarNome()`: obrigatório, com pelo menos 3 caracteres após `trim()`
- `validarEmail()`: usa `type="email"`, `required` e `validity`
- `validarUsuario()`: de 4 a 16 caracteres (A–Z, a–z, 0–9 e `_`), definido com `pattern`
- `validarSenha()`: de 12 a 64 caracteres, aceita espaços e não passa por `trim()`
- `validarConfirmacao()`: precisa ser idêntica à senha
- `validarAceite()`: checkbox obrigatório, desmarcado por padrão

As mensagens aparecem junto a cada campo, e há um resumo no fim da página. A senha nunca é exibida nem registrada.
