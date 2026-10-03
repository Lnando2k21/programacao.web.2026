# Prática 3 — Objetos, JSON e localStorage

## Tema escolhido

**Controle de Gastos**

Mini-sistema de cadastro executado diretamente no navegador.

## Requisitos da atividade atendidos

- Formulário para criar um registro (objeto).
- Array de objetos para guardar os registros.
- `JSON.stringify()` para transformar os dados em JSON.
- `localStorage.setItem()` para persistir os dados.
- `for...of` para percorrer e exibir os registros.
- `localStorage.getItem()` para recuperar os dados.
- `JSON.parse()` para converter o JSON novamente em objetos.
- `preventDefault()` no envio do formulário.
- `push()` para adicionar registros ao array.
- `Number()` para converter o valor digitado em número.
- Botão para limpar os registros.
- Persistência após recarregar a página com `F5`.

## Estrutura

```text
pratica-3-gastos/
├── index.html
├── README.md
├── css/
│   └── style.css
└── js/
    └── script.js
```

## Como executar

1. Baixe ou clone o projeto.
2. Abra o arquivo `index.html` no navegador.
3. Preencha o formulário.
4. Clique em **Adicionar gasto**.
5. Pressione `F5` para verificar que os dados continuam salvos.

## Como enviar para o GitHub

No terminal, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Prática 3 - Objetos JSON e localStorage"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/pratica-3-gastos.git
git push -u origin main
```

Substitua `SEU-USUARIO` pelo seu usuário do GitHub e ajuste o nome do repositório se necessário.

## Observação

O `localStorage` armazena dados como texto. Por isso o projeto utiliza `JSON.stringify()` para salvar o array de objetos e `JSON.parse()` para recuperar os dados. O campo de valor utiliza `Number()` para garantir que o valor seja tratado como número.
