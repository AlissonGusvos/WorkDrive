const botoes = document.querySelectorAll("[data-page]");
const conteudo = document.getElementById("main-container");

async function carregarPagina(pagina) {
    try {
        const resposta = await fetch(`pages/${pagina}.html`);

        if (!resposta.ok) {
            throw new Error("Página não encontrada");
        }

        const html = await resposta.text();

        conteudo.innerHTML = html;

    } catch (e) {
        conteudo.innerHTML = "<h1>Erro ao carregar a página</h1>";
        console.error(e);
    }
}

botoes.forEach(botao => {
    botao.addEventListener("click", () => {

        // Remove a classe ativo de todos os botões
        botoes.forEach(item => {
            item.classList.remove("ativo");
        });

        // Adiciona ativo ao botão clicado
        botao.classList.add("ativo");

        // Carrega a página correspondente
        carregarPagina(botao.dataset.page);
    });
});

carregarPagina("home");