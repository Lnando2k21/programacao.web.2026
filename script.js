// JavaScript puro: DOM, eventos, value, textContent e style.

// Seleciona elementos com getElementById().
const corpo = document.getElementById("corpo");
const botaoTema = document.getElementById("botaoTema");
const botaoLinhaTempo = document.getElementById("botaoLinhaTempo");
const linhaTempo = document.getElementById("linhaTempo");
const formulario = document.getElementById("formulario");
const nome = document.getElementById("nome");
const mensagemTexto = document.getElementById("mensagemTexto");
const contador = document.getElementById("contador");
const mensagemResultado = document.getElementById("mensagemResultado");

// Evento click: troca o modo visual.
botaoTema.addEventListener("click", function () {
    corpo.classList.toggle("modo-escuro");
    if (corpo.classList.contains("modo-escuro")) {
        botaoTema.textContent = "Modo claro";
    } else {
        botaoTema.textContent = "Modo escuro";
    }
});

// Evento click: mostra e esconde a linha do tempo.
botaoLinhaTempo.addEventListener("click", function () {
    linhaTempo.classList.toggle("oculto");
    if (linhaTempo.classList.contains("oculto")) {
        botaoLinhaTempo.textContent = "Ver linha do tempo";
    } else {
        botaoLinhaTempo.textContent = "Ocultar linha do tempo";
    }
});

// Evento input: lê .value e atualiza textContent enquanto o usuário digita.
nome.addEventListener("input", function () {
    const valorNome = nome.value;
    contador.textContent = valorNome.length + " caracteres";

    // Uso de .style para alterar a aparência via JavaScript.
    if (valorNome.length > 0) {
        nome.style.borderColor = "#d5a84f";
    } else {
        nome.style.borderColor = "transparent";
    }
});

// Evento submit: impede o recarregamento e modifica a página.
formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const valorNome = nome.value.trim();
    const valorMensagem = mensagemTexto.value.trim();

    if (valorNome === "") {
        mensagemResultado.textContent = "Digite seu nome antes de enviar.";
        mensagemResultado.style.borderLeft = "6px solid #a45732";
        nome.focus();
        return;
    }

    if (valorMensagem === "") {
        mensagemResultado.textContent = "Escreva uma mensagem antes de enviar.";
        mensagemResultado.style.borderLeft = "6px solid #a45732";
        mensagemTexto.focus();
        return;
    }

    mensagemResultado.textContent = "Obrigado, " + valorNome + "! Sua mensagem foi registrada nesta demonstração: “" + valorMensagem + "”";
    mensagemResultado.style.borderLeft = "6px solid #d5a84f";

    formulario.reset();
    contador.textContent = "0 caracteres";
    nome.style.borderColor = "transparent";
});
