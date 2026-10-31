"use strict";
/* COMPETÊNCIA: persistência com localStorage.
   Salva e recupera os favoritos usando JSON.stringify() e JSON.parse(). */

const CHAVE_FAV = "saude-quilombola:favoritos";

function lerFavoritos() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_FAV));
    return Array.isArray(dados) ? dados : [];
  } catch (e) {
    return [];
  }
}

// Devolve true se salvou; false se o navegador bloqueou o armazenamento.
function salvarFavoritos() {
  try {
    localStorage.setItem(CHAVE_FAV, JSON.stringify(estado.favoritos));
    return true;
  } catch (e) {
    return false;
  }
}

const ehFavorito = (id) => estado.favoritos.some((f) => f.id === id);

// Adiciona ou remove o município da lista de favoritos e persiste a mudança.
function alternarFavorito(m) {
  if (ehFavorito(m.id)) {
    estado.favoritos = estado.favoritos.filter((f) => f.id !== m.id);
  } else {
    // objeto que representa o favorito
    estado.favoritos.push({ id: m.id, nome: m.nome, uf: m.uf, microrregiao: m.microrregiao });
  }
  return salvarFavoritos();
}
