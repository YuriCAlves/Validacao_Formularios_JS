// Referências aos elementos do formulário
const form = document.getElementById("form-cadastro");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoUsuario = document.getElementById("usuario");
const campoSenha = document.getElementById("senha");
const campoConfirmacao = document.getElementById("confirmacao");
const campoAceite = document.getElementById("aceite");

const resumo = document.getElementById("resumo");
const resumoTitulo = document.getElementById("resumo-titulo");
const resumoLista = document.getElementById("resumo-lista");

// Mostra (ou limpa) a mensagem junto ao campo e marca o estado de acessibilidade
function mostrarMensagem(campo, mensagem) {
  const spanErro = document.getElementById("erro-" + campo.id);
  spanErro.textContent = mensagem;
  campo.setAttribute("aria-invalid", mensagem ? "true" : "false");
  return mensagem === "";
}

// 1. Nome: obrigatório, pelo menos 3 caracteres após trim()
function validarNome() {
  const nome = campoNome.value.trim();
  let mensagem = "";

  if (nome === "") {
    mensagem = "Informe seu nome.";
  } else if (nome.length < 3) {
    mensagem = "O nome deve ter pelo menos 3 caracteres.";
  }
  return mostrarMensagem(campoNome, mensagem);
}

// 2. E-mail: usa a validação nativa (type="email" + required) via validity
function validarEmail() {
  const validade = campoEmail.validity;
  let mensagem = "";

  if (validade.valueMissing) {
    mensagem = "Informe seu e-mail.";
  } else if (validade.typeMismatch) {
    mensagem = "Formato de e-mail inválido. Exemplo: nome@dominio.com";
  }
  return mostrarMensagem(campoEmail, mensagem);
}

// 3. Usuário: 4 a 16 caracteres, apenas A-Z, a-z, 0-9 e _ (atributo pattern)
function validarUsuario() {
  const validade = campoUsuario.validity;
  let mensagem = "";

  if (validade.valueMissing) {
    mensagem = "Informe um nome de usuário.";
  } else if (validade.patternMismatch) {
    mensagem = "Usuário inválido: use de 4 a 16 caracteres, somente letras sem acento, números e _ (sem espaços).";
  }
  return mostrarMensagem(campoUsuario, mensagem);
}

// 4a. Senha: 12 a 64 caracteres, espaços permitidos, sem trim()
function validarSenha() {
  const senha = campoSenha.value; // sem trim() de propósito
  let mensagem = "";

  if (senha === "") {
    mensagem = "Informe uma senha.";
  } else if (senha.length < 12) {
    mensagem = "A senha deve ter pelo menos 12 caracteres.";
  } else if (senha.length > 64) {
    mensagem = "A senha deve ter no máximo 64 caracteres.";
  }
  return mostrarMensagem(campoSenha, mensagem);
}

// 4b. Confirmação: deve ser idêntica à senha
function validarConfirmacao() {
  const confirmacao = campoConfirmacao.value;
  let mensagem = "";

  if (confirmacao === "") {
    mensagem = "Confirme a senha.";
  } else if (confirmacao !== campoSenha.value) {
    mensagem = "A confirmação não é igual à senha.";
  }
  return mostrarMensagem(campoConfirmacao, mensagem);
}

// 5. Aceite: checkbox obrigatório
function validarAceite() {
  const mensagem = campoAceite.checked ? "" : "Você precisa aceitar as regras do exercício.";
  return mostrarMensagem(campoAceite, mensagem);
}

// Lista de validações, na ordem dos campos
const validacoes = [
  { campo: campoNome, rotulo: "Nome", validar: validarNome },
  { campo: campoEmail, rotulo: "E-mail", validar: validarEmail },
  { campo: campoUsuario, rotulo: "Nome de usuário", validar: validarUsuario },
  { campo: campoSenha, rotulo: "Senha", validar: validarSenha },
  { campo: campoConfirmacao, rotulo: "Confirmação da senha", validar: validarConfirmacao },
  { campo: campoAceite, rotulo: "Aceite", validar: validarAceite },
];

// Resumo exibido na página (nunca inclui a senha)
function mostrarResumo(erros) {
  resumoLista.innerHTML = "";
  resumo.hidden = false;

  if (erros.length > 0) {
    resumo.className = "resumo com-erros";
    resumoTitulo.textContent = `Corrija ${erros.length} campo(s):`;
    erros.forEach(function (item) {
      const li = document.createElement("li");
      const msg = document.getElementById("erro-" + item.campo.id).textContent;
      li.textContent = `${item.rotulo}: ${msg}`;
      resumoLista.appendChild(li);
    });
  } else {
    resumo.className = "resumo sucesso";
    resumoTitulo.textContent = "Cadastro válido!";
    const dados = [
      `Nome: ${campoNome.value.trim()}`,
      `E-mail: ${campoEmail.value}`,
      `Usuário: ${campoUsuario.value}`,
    ];
    dados.forEach(function (texto) {
      const li = document.createElement("li");
      li.textContent = texto; // textContent evita injeção de HTML
      resumoLista.appendChild(li);
    });
  }
}

// Envio: valida tudo, mostra o resumo e foca o primeiro campo inválido
form.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const erros = validacoes.filter(function (item) {
    return !item.validar();
  });

  mostrarResumo(erros);

  if (erros.length > 0) {
    erros[0].campo.focus();
  }
});

// Validação ao sair do campo (blur) e correção ao digitar, se já estiver com erro
validacoes.forEach(function (item) {
  const evento = item.campo.type === "checkbox" ? "change" : "blur";
  item.campo.addEventListener(evento, item.validar);

  item.campo.addEventListener("input", function () {
    if (item.campo.getAttribute("aria-invalid") === "true") {
      item.validar();
    }
  });
});

// Se a senha mudar, revalida a confirmação já preenchida
campoSenha.addEventListener("input", function () {
  if (campoConfirmacao.value !== "") {
    validarConfirmacao();
  }
});
