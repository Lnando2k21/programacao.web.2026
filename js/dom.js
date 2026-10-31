"use strict";
/* COMPETÊNCIA: JavaScript e DOM.
   Cria e atualiza elementos da página. Não faz requisições nem acessa o localStorage
   diretamente: usa as funções de api.js, dados.js e storage.js. */

const $ = (id) => document.getElementById(id);
const el = {
  form: $("form-busca"), uf: $("uf"), busca: $("busca"), status: $("status"),
  lista: $("lista"), mais: $("mais"), contador: $("contador"),
  abaTodos: $("aba-todos"), abaFav: $("aba-fav"),
  dialogo: $("detalhes"), corpo: $("det-corpo"),
};

function mostrarStatus(texto, erro = false) {
  el.status.textContent = texto;
  el.status.classList.toggle("erro", erro);
}

function preencherEstados(estados) {
  el.uf.innerHTML = "";
  for (const e of estados) {
    const op = document.createElement("option");
    op.value = e.id;
    op.textContent = `${e.nome} (${e.sigla})`;
    el.uf.append(op);
  }
  el.uf.value = UF_INICIAL;
  el.uf.disabled = false;
}

function aoFavoritar(m) {
  if (!alternarFavorito(m)) mostrarStatus("Não foi possível salvar os favoritos neste navegador.", true);
  atualizarTela();
}

function criarCartao(m) {
  const li = document.createElement("li");
  li.className = "cartao";

  const topo = document.createElement("div");
  topo.className = "cartao-topo";
  const mono = document.createElement("div");
  mono.className = "mono";
  mono.setAttribute("aria-hidden", "true");
  mono.textContent = m.nome.charAt(0);
  const textos = document.createElement("div");
  const h3 = document.createElement("h3");
  h3.textContent = m.nome;
  const p = document.createElement("p");
  p.textContent = [m.uf, m.microrregiao].filter(Boolean).join(" – ");
  textos.append(h3, p);
  topo.append(mono, textos);

  const acoes = document.createElement("div");
  acoes.className = "acoes";
  const bDet = document.createElement("button");
  bDet.type = "button";
  bDet.className = "btn btn-sec";
  bDet.textContent = "Ver detalhes";
  bDet.addEventListener("click", () => abrirDetalhes(m));
  const bFav = document.createElement("button");
  bFav.type = "button";
  bFav.className = "btn fav";
  bFav.addEventListener("click", () => aoFavoritar(m));
  const fav = ehFavorito(m.id);
  bFav.setAttribute("aria-pressed", String(fav));
  bFav.textContent = fav ? "Remover" : "Favoritar";
  bFav.setAttribute("aria-label", `${fav ? "Remover dos favoritos" : "Favoritar"}: ${m.nome}`);
  acoes.append(bDet, bFav);

  li.append(topo, acoes);
  return li;
}

function atualizarTela() {
  el.contador.textContent = estado.favoritos.length;
  el.abaTodos.setAttribute("aria-pressed", String(!estado.soFavoritos));
  el.abaFav.setAttribute("aria-pressed", String(estado.soFavoritos));

  const resultado = filtrarMunicipios();
  el.lista.innerHTML = "";
  for (const m of resultado.slice(0, estado.visiveis)) el.lista.append(criarCartao(m));
  el.mais.hidden = resultado.length <= estado.visiveis;

  if (resultado.length === 0) {
    mostrarStatus(estado.soFavoritos
      ? "Você ainda não tem favoritos. Use o botão Favoritar em um município."
      : "Nenhum município encontrado. Confira o nome ou troque o estado.");
  } else {
    const parte = Math.min(estado.visiveis, resultado.length);
    mostrarStatus(`Mostrando ${parte} de ${resultado.length} município(s).`);
  }
}

function criarItemLista(dl, rotulo, valor) {
  const dt = document.createElement("dt"); dt.textContent = rotulo;
  const dd = document.createElement("dd"); dd.textContent = valor;
  dl.append(dt, dd);
}

async function abrirDetalhes(m) {
  el.corpo.innerHTML = `<h2 id="det-titulo"></h2><p class="aviso">Carregando detalhes…</p>`;
  $("det-titulo").textContent = m.nome;
  el.dialogo.showModal();

  const tituloWiki = `${m.nome} (${m.ufNome || m.uf})`.replace(/ /g, "_");
  const [info, censo, wiki] = await Promise.allSettled([
    obterMunicipio(m.id), obterCensoQuilombola(m.id), obterResumoWiki(tituloWiki),
  ]);

  const completo = info.status === "fulfilled" ? normalizar(info.value) : m;
  el.corpo.innerHTML = "";

  const h2 = document.createElement("h2");
  h2.id = "det-titulo";
  h2.textContent = `${completo.nome} – ${completo.uf}`;
  el.corpo.append(h2);

  const wikiOk = wiki.status === "fulfilled" && wiki.value.type === "standard";
  if (wikiOk && wiki.value.thumbnail) {
    const img = document.createElement("img");
    img.src = wiki.value.thumbnail.source;
    img.alt = `Imagem do município de ${completo.nome}`;
    img.loading = "lazy";
    el.corpo.append(img);
  }

  const dl = document.createElement("dl");
  for (const [rotulo, valor] of [["Código IBGE", completo.id], ["Microrregião", completo.microrregiao], ["Mesorregião", completo.mesorregiao]]) {
    if (valor) criarItemLista(dl, rotulo, valor);
  }
  el.corpo.append(dl);

  const blocoCenso = document.createElement("div");
  blocoCenso.className = "bloco";
  blocoCenso.innerHTML = "<h3>População quilombola (Censo 2022)</h3>";
  if (censo.status === "fulfilled" && censo.value.length > 1) {
    const dlc = document.createElement("dl");
    for (const l of linhasCenso(censo.value)) criarItemLista(dlc, l.rotulo, `${l.valor} (${l.unidade})`);
    blocoCenso.append(dlc);
  } else {
    const p = document.createElement("p");
    p.className = "aviso";
    p.textContent = "Dados do Censo indisponíveis para este município no momento.";
    blocoCenso.append(p);
  }
  el.corpo.append(blocoCenso);

  if (wikiOk && wiki.value.extract) {
    const b = document.createElement("div");
    b.className = "bloco";
    b.innerHTML = "<h3>Sobre o município</h3>";
    const p = document.createElement("p");
    p.textContent = wiki.value.extract;
    b.append(p);
    el.corpo.append(b);
  }

  const bFav = document.createElement("button");
  bFav.type = "button";
  bFav.className = "btn fav";
  const pintar = () => {
    const f = ehFavorito(completo.id);
    bFav.setAttribute("aria-pressed", String(f));
    bFav.textContent = f ? "Remover dos favoritos" : "Adicionar aos favoritos";
  };
  pintar();
  bFav.addEventListener("click", () => { aoFavoritar(completo); pintar(); });
  el.corpo.append(bFav);
}
