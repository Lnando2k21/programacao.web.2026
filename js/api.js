"use strict";
/* COMPETÊNCIA: APIs e requisições HTTP (fetch, GET, async/await, tratamento de erros).
   Este arquivo só conversa com a rede: não mexe no DOM nem no localStorage. */

const API_IBGE = "https://servicodados.ibge.gov.br/api/v1/localidades";
const API_SIDRA = "https://apisidra.ibge.gov.br/values/t/9578/n6/";
const API_WIKI = "https://pt.wikipedia.org/api/rest_v1/page/summary/";

// Requisição GET genérica, com tratamento de erro de rede e de resposta HTTP.
async function buscarJSON(url) {
  let resposta;
  try {
    resposta = await fetch(url, { method: "GET" });
  } catch (e) {
    throw new Error("Sem conexão com o servidor. Verifique sua internet.");
  }
  if (!resposta.ok) throw new Error(`O servidor respondeu com erro ${resposta.status}.`);
  return resposta.json();
}

const obterEstados = () => buscarJSON(`${API_IBGE}/estados?orderBy=nome`);
const obterMunicipiosDoEstado = (idUF) => buscarJSON(`${API_IBGE}/estados/${idUF}/municipios?orderBy=nome`);
const obterMunicipio = (id) => buscarJSON(`${API_IBGE}/municipios/${id}`);
const obterCensoQuilombola = (id) => buscarJSON(`${API_SIDRA}${id}/v/all`);
const obterResumoWiki = (titulo) => buscarJSON(`${API_WIKI}${encodeURIComponent(titulo)}`);
