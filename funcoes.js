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

function mostrarMensagem(campo, mensagem) {
  const spanErro = document.getElementById("erro-" + campo.id);
  spanErro.textContent = mensagem;
  campo.setAttribute("aria-invalid", mensagem ? "true" : "false");
  return mensagem === "";
}

function validarNome() {
  const nome = campoNome.value.trim();
  let mensagem = "";

  if (nome === "") {
    mensagem = "Informe seu nome.";
  } else if (/\d/.test(nome)) {
    mensagem = "O nome não pode conter números.";
  } else if (!/^[\p{L}\s'’-]+$/u.test(nome)) {
    mensagem = "O nome deve conter apenas letras (acentos, espaços, hífen e apóstrofo são permitidos).";
  } else if (nome.length < 3) {
    mensagem = "O nome deve ter pelo menos 3 caracteres.";
  }
  return mostrarMensagem(campoNome, mensagem);
}

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

function validarSenha() {
  const senha = campoSenha.value;
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

function validarAceite() {
  const mensagem = campoAceite.checked ? "" : "Você precisa aceitar as regras do exercício.";
  return mostrarMensagem(campoAceite, mensagem);
}

const validacoes = [
  { campo: campoNome, rotulo: "Nome", validar: validarNome },
  { campo: campoEmail, rotulo: "E-mail", validar: validarEmail },
  { campo: campoUsuario, rotulo: "Nome de usuário", validar: validarUsuario },
  { campo: campoSenha, rotulo: "Senha", validar: validarSenha },
  { campo: campoConfirmacao, rotulo: "Confirmação da senha", validar: validarConfirmacao },
  { campo: campoAceite, rotulo: "Aceite", validar: validarAceite },
];

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
      li.textContent = texto;
      resumoLista.appendChild(li);
    });
  }
}

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

validacoes.forEach(function (item) {
  const evento = item.campo.type === "checkbox" ? "change" : "blur";
  item.campo.addEventListener(evento, item.validar);

  item.campo.addEventListener("input", function () {
    if (item.campo.getAttribute("aria-invalid") === "true") {
      item.validar();
    }
  });
});

campoSenha.addEventListener("input", function () {
  if (campoConfirmacao.value !== "") {
    validarConfirmacao();
  }
});

campoNome.addEventListener("input", function () {
  const valor = campoNome.value;
  if (/\d/.test(valor)) {
    const posicao = campoNome.selectionStart - (valor.slice(0, campoNome.selectionStart).match(/\d/g) || []).length;
    campoNome.value = valor.replace(/\d/g, "");
    campoNome.setSelectionRange(posicao, posicao);
    mostrarMensagem(campoNome, "O nome não pode conter números.");
  }
});
