// base cad-a7k9
// aluno: ______________________________

// Array que armazenará todos os registros.
const registros = [];

// Chave utilizada para salvar os dados no localStorage.
const CHAVE_STORAGE = "gastos";

// Elementos do DOM.
const formGasto = document.getElementById("formGasto");
const descricaoInput = document.getElementById("descricao");
const categoriaInput = document.getElementById("categoria");
const valorInput = document.getElementById("valor");
const dataInput = document.getElementById("data");
const listaGastos = document.getElementById("listaGastos");
const mensagemVazia = document.getElementById("mensagemVazia");
const contador = document.getElementById("contador");
const totalGastos = document.getElementById("totalGastos");
const btnLimpar = document.getElementById("btnLimpar");

// Recupera os registros salvos no navegador.
// Na primeira vez, getItem() devolve null, então usamos [].
function carregarRegistros() {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);

    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);

        // O conteúdo do array é recuperado e inserido no array principal.
        registros.push(...dados);
    }

    mostrarRegistros();
}

// Formata o valor como moeda brasileira.
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Formata a data para o padrão brasileiro.
function formatarData(data) {
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Mostra os registros no DOM percorrendo o array com for...of.
function mostrarRegistros() {
    listaGastos.innerHTML = "";

    let total = 0;

    for (const registro of registros) {
        const item = document.createElement("article");
        item.classList.add("gasto");

        item.innerHTML = `
            <div class="gasto-info">
                <h3>${registro.descricao}</h3>
                <p>${registro.categoria} · ${formatarData(registro.data)}</p>
            </div>
            <div class="gasto-valor">${formatarMoeda(registro.valor)}</div>
        `;

        listaGastos.appendChild(item);
        total += registro.valor;
    }

    contador.textContent =
        registros.length === 1
            ? "1 registro"
            : `${registros.length} registros`;

    totalGastos.textContent = formatarMoeda(total);

    mensagemVazia.style.display =
        registros.length === 0 ? "block" : "none";
}

// Captura os valores do formulário no submit.
formGasto.addEventListener("submit", function (event) {
    // Impede o recarregamento automático da página.
    event.preventDefault();

    // Cria um objeto juntando os valores preenchidos.
    const novoRegistro = {
        descricao: descricaoInput.value.trim(),
        categoria: categoriaInput.value,
        valor: Number(valorInput.value),
        data: dataInput.value
    };

    // Adiciona o objeto ao array.
    registros.push(novoRegistro);

    // Converte o array de objetos para JSON e salva no localStorage.
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(registros));

    // Atualiza a exibição.
    mostrarRegistros();

    // Limpa o formulário.
    formGasto.reset();
    descricaoInput.focus();
});

// Botão para limpar todos os registros.
btnLimpar.addEventListener("click", function () {
    if (registros.length === 0) {
        return;
    }

    const confirmar = confirm("Deseja realmente limpar todos os registros?");

    if (!confirmar) {
        return;
    }

    // Remove todos os itens do array.
    registros.length = 0;

    // Remove os dados armazenados no navegador.
    localStorage.removeItem(CHAVE_STORAGE);

    // Atualiza a tela.
    mostrarRegistros();
});

// Executa a recuperação e exibição ao carregar a página.
carregarRegistros();
