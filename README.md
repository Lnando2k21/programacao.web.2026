# Saúde Quilombola: catálogo interativo de municípios

Trabalho em Grupo 1 – Programação Web (HTML, CSS e JavaScript puros, sem bibliotecas).

## Integrantes
- Nome 1 – matrícula
- Nome 2 – matrícula

## Descrição
Aplicação que lista os municípios de qualquer estado brasileiro (padrão: Pará), permite pesquisar por nome, abrir os detalhes de cada um com os dados do **Censo 2022 sobre a população quilombola**, e manter uma lista de favoritos salva no navegador. Inclui uma seção informativa sobre pontos de atenção na saúde de comunidades quilombolas.

## Funcionalidades
- **Listagem:** cartões com nome, estado e microrregião (o município não tem foto na API; o cartão usa a inicial como identificação visual). A foto aparece nos detalhes, quando a Wikipédia tiver uma.
- **Pesquisa:** filtro por nome, sem diferenciar acentos, enquanto se digita.
- **Detalhes:** janela (`<dialog>`) com dados do IBGE, população quilombola (SIDRA) e resumo da Wikipédia.
- **Favoritos:** adicionar e remover, na lista e nos detalhes; aba "Favoritos" com contador.
- **Persistência:** favoritos em `localStorage` (`JSON.stringify` / `JSON.parse`), recuperados ao recarregar.
- **Carregamento:** mensagens de status enquanto os dados chegam.
- **Erros:** falha de rede, resposta HTTP de erro e `localStorage` indisponível são tratados com avisos ao usuário.

## APIs utilizadas (públicas, sem chave)
| API | Uso |
|---|---|
| IBGE Localidades `https://servicodados.ibge.gov.br/api/v1/localidades` | estados, municípios e detalhes |
| IBGE SIDRA, tabela 9578 `https://apisidra.ibge.gov.br/values/t/9578/n6/{id}/v/all` | população quilombola por município |
| Wikipédia REST `https://pt.wikipedia.org/api/rest_v1/page/summary/{titulo}` | imagem e resumo (opcional) |

## Como executar
1. Baixe ou clone o repositório.
2. Abra `index.html` no navegador (é necessário ter internet para consultar as APIs).
3. Opcional: `python -m http.server 8000` na pasta do projeto e acesse `http://localhost:8000`.

## Estrutura (um arquivo por competência)
```
index.html        HTML semântico
css/style.css     CSS próprio e responsividade
js/api.js         APIs e HTTP: fetch, GET, async/await, tratamento de erros
js/dados.js       Objetos e JSON: normalização, filtros, estado da aplicação
js/storage.js     localStorage: favoritos com JSON.stringify / JSON.parse
js/dom.js         DOM: criação de elementos, cartões, janela de detalhes
js/main.js        Eventos de clique e formulário, inicialização
README.md
```
Os scripts são carregados em ordem pelo `index.html` (api, dados, storage, dom, main), sem módulos, para funcionar também ao abrir o arquivo direto no navegador.
