"use strict";
/* COMPETÊNCIA: eventos (clique e formulário) e inicialização.
   Liga as ações do usuário às funções dos outros arquivos. */

async function carregarEstados() {
  try {
    preencherEstados(await obterEstados());
  } catch (e) {
    mostrarStatus(`Não foi possível carregar os estados. ${e.message}`, true);
  }
}

async function carregarMunicipios() {
  mostrarStatus("Carregando municípios…");
  el.lista.innerHTML = "";
  el.mais.hidden = true;
  try {
    const dados = await obterMunicipiosDoEstado(el.uf.value);
    estado.municipios = dados.map(normalizar);
    estado.visiveis = POR_PAGINA;
    atualizarTela();
  } catch (e) {
    estado.municipios = [];
    mostrarStatus(`Não foi possível carregar os municípios. ${e.message}`, true);
  }
}

function reiniciarPagina() {
  estado.visiveis = POR_PAGINA;
  atualizarTela();
}

el.form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  estado.busca = el.busca.value;
  reiniciarPagina();
});
el.busca.addEventListener("input", () => {
  estado.busca = el.busca.value;
  reiniciarPagina();
});
el.uf.addEventListener("change", carregarMunicipios);
el.mais.addEventListener("click", () => { estado.visiveis += POR_PAGINA; atualizarTela(); });
el.abaTodos.addEventListener("click", () => { estado.soFavoritos = false; reiniciarPagina(); });
el.abaFav.addEventListener("click", () => { estado.soFavoritos = true; reiniciarPagina(); });

(async function iniciar() {
  estado.favoritos = lerFavoritos();
  atualizarTela();
  await carregarEstados();
  if (!el.uf.disabled) await carregarMunicipios();
})();
