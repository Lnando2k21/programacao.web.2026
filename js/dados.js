"use strict";
/* COMPETÊNCIA: objetos e JSON.
   Transforma o JSON recebido da API em objetos JavaScript, percorre arrays e filtra dados.
   Também guarda o objeto de estado da aplicação. */

const POR_PAGINA = 24;
const UF_INICIAL = "15"; // Pará

const estado = {
  municipios: [],
  busca: "",
  visiveis: POR_PAGINA,
  soFavoritos: false,
  favoritos: [], // preenchido em main.js com lerFavoritos()
};

// Converte o objeto bruto do IBGE em um objeto simples e padronizado.
function normalizar(m) {
  const micro = m.microrregiao;
  const imediata = m["regiao-imediata"];
  const ufObj = micro?.mesorregiao?.UF ?? imediata?.["regiao-intermediaria"]?.UF;
  return {
    id: Number(m.id),
    nome: m.nome,
    uf: ufObj?.sigla ?? "",
    ufNome: ufObj?.nome ?? "",
    microrregiao: micro?.nome ?? imediata?.nome ?? "",
    mesorregiao: micro?.mesorregiao?.nome ?? imediata?.["regiao-intermediaria"]?.nome ?? "",
  };
}

const semAcento = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Aplica a pesquisa por nome sobre todos os municípios ou só sobre os favoritos.
function filtrarMunicipios() {
  const base = estado.soFavoritos ? estado.favoritos : estado.municipios;
  const termo = semAcento(estado.busca.trim());
  return base.filter((m) => semAcento(m.nome).includes(termo));
}

// Transforma a resposta da SIDRA (array de objetos; o 1º item é o cabeçalho) em linhas legíveis.
const fmtNumero = new Intl.NumberFormat("pt-BR");
function linhasCenso(dados) {
  const [cab, ...linhas] = dados;
  const chaves = Object.keys(cab).filter(
    (k) => /^D\d+N$/.test(k) && !["Município", "Ano"].includes(cab[k])
  );
  return linhas.map((l) => ({
    rotulo: chaves.map((k) => l[k]).join(" – "),
    valor: isNaN(Number(l.V)) ? l.V : fmtNumero.format(Number(l.V)),
    unidade: l.MN,
  }));
}
