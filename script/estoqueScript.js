// ADICIONAR LINHAS DO PAINEL

function adicionarLinha(item, indice) {
    const listaEstoque = conteudo.querySelector("#lista-estoque");
    const linha = document.createElement("div");
    linha.classList.add("panel-row");
    linha.dataset.indice = indice;

    const nome = document.createElement("div");
    nome.classList.add("rw-peca");
    nome.textContent = item.nome;

    const quantidade = document.createElement("div");
    quantidade.classList.add("rw-quant");
    quantidade.innerHTML = `<input type="number" value="${item.quantidade}" min="0">`;

    const minimo = document.createElement("div");
    minimo.classList.add("rw-min");
    minimo.textContent = item.minimo;

    const preco = document.createElement("div");
    preco.classList.add("rw-preco");
    preco.textContent = Number(item.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const status = document.createElement("div");
    status.classList.add("rw-status");

    const textoStatus = document.createElement("span");

    if (Number(item.quantidade) <= Number(item.minimo)) {
        textoStatus.classList.add("negado");
        textoStatus.textContent = "Repor";
    } else {
        textoStatus.classList.add("aceito");
        textoStatus.textContent = "Ok";
    }

    status.appendChild(textoStatus);

    const apagar = document.createElement("div");
    apagar.classList.add("rw-apagar");
    apagar.innerHTML = '<button type="button">Excluir</button>';

    linha.append(nome, quantidade, minimo, preco, status, apagar);
    listaEstoque.appendChild(linha);
}

// CARREGAR ITENS PARA O PAINEL

function carregarItens() {
    const listaEstoque = conteudo.querySelector("#lista-estoque");

    if (!listaEstoque) {
        return;
    }

    const itens = JSON.parse(localStorage.getItem("itensEstoque")) || [];

    itens.forEach((item, indice) => adicionarLinha(item, indice));
}

// MODAL

conteudo.addEventListener("click", (evento) => {
    if (evento.target.closest(".rw-apagar button")) {
        const linha = evento.target.closest(".panel-row");
        const indice = Number(linha.dataset.indice);
        const itens = JSON.parse(localStorage.getItem("itensEstoque")) || [];

        itens.splice(indice, 1);
        localStorage.setItem("itensEstoque", JSON.stringify(itens));
        linha.remove();

        const linhas = conteudo.querySelectorAll(".panel-row");

        linhas.forEach((linha, novoIndice) => {
            linha.dataset.indice = novoIndice;
        });
    }

    if (evento.target.closest("#abrir-modal")) {
        const fundoModal = conteudo.querySelector("#fundo-modal");
        if (fundoModal) {
            fundoModal.classList.add("aberto");
            fundoModal.setAttribute("aria-hidden", "false");
        }
    }

    if (evento.target.closest("#form-cancel")) {
        const fundoModal = conteudo.querySelector("#fundo-modal");
        if (fundoModal) {
            fundoModal.classList.remove("aberto");
            fundoModal.setAttribute("aria-hidden", "true");
        }
    }
});

// SALVAR INFO MODAL

conteudo.addEventListener("click", (evento) => {
    if (evento.target.closest("#form-save")) {
        const formulario = conteudo.querySelector("#formulario");

        if (!formulario.reportValidity()) {
            return;
        }

        const item = {
            nome: conteudo.querySelector("#nome-item").value.trim(),
            quantidade: conteudo.querySelector("#quantidade-item").value,
            minimo: conteudo.querySelector("#minimo-item").value,
            preco: conteudo.querySelector("#preco-item").value
        };

        const itens = JSON.parse(localStorage.getItem("itensEstoque")) || [];
        itens.push(item);
        localStorage.setItem("itensEstoque", JSON.stringify(itens));

        adicionarLinha(item, itens.length - 1);
        formulario.reset();

        const fundoModal = conteudo.querySelector("#fundo-modal");
        fundoModal.classList.remove("aberto");
        fundoModal.setAttribute("aria-hidden", "true");
    }
});

// ATUALIZAR QUANTIDADE

conteudo.addEventListener("input", (evento) => {
    if (evento.target.matches(".rw-quant input")) {
        const linha = evento.target.closest(".panel-row");
        const indice = Number(linha.dataset.indice);
        const itens = JSON.parse(localStorage.getItem("itensEstoque")) || [];

        itens[indice].quantidade = evento.target.value;
        localStorage.setItem("itensEstoque", JSON.stringify(itens));

        atualizarStatus(linha, itens[indice]);
    }
});

// ATUALIZAR STATUS

function atualizarStatus(linha, item) {
    const status = linha.querySelector(".rw-status span");

    if (Number(item.quantidade) <= Number(item.minimo)) {
        status.textContent = "Repor";
        status.classList.remove("aceito");
        status.classList.add("negado");
    } else {
        status.textContent = "Ok";
        status.classList.remove("negado");
        status.classList.add("aceito");
    }
}

// EXCLUIR LINHA

conteudo.addEventListener("click", (evento) => {
    if (evento.target.closest(".rw-apagar button")) {
        const linha = evento.target.closest(".panel-row");
        const indice = Number(linha.dataset.indice);
        const itens = JSON.parse(localStorage.getItem("itensEstoque")) || [];

        itens.splice(indice, 1);
        localStorage.setItem("itensEstoque", JSON.stringify(itens));
        linha.remove();

        const linhas = conteudo.querySelectorAll(".panel-row");

        linhas.forEach((linha, novoIndice) => {
            linha.dataset.indice = novoIndice;
        });
    }
});

conteudo.addEventListener("input", (evento) => {
    if (evento.target.matches(".rw-quant input")) {
        const linha = evento.target.closest(".panel-row");
        const indice = linha.dataset.indice;
        const itens = JSON.parse(localStorage.getItem("itensEstoque")) || [];

        itens[indice].quantidade = evento.target.value;
        localStorage.setItem("itensEstoque", JSON.stringify(itens));

        const status = linha.querySelector(".rw-status span");

        if (Number(evento.target.value) <= Number(itens[indice].minimo)) {
            status.textContent = "Repor";
            status.classList.remove("aceito");
            status.classList.add("negado");
        } else {
            status.textContent = "Ok";
            status.classList.remove("negado");
            status.classList.add("aceito");
        }
    }
});
