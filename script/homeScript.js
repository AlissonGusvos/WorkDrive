// MONTAR LINHA DA ORDEM RECENTE

function adicionarOrdemRecente(ordem, ultimaLinha) {
    const linha = document.createElement("div");
    linha.classList.add("panel-row");

    if (ultimaLinha) {
        linha.style.border = "none";
    }

    const container = document.createElement("div");
    container.classList.add("ordem-container");

    const nomesFases = {
        aguardando: "Aguardando Peça",
        execucao: "Em Execução",
        concluido: "Concluído"
    };

    const classesFases = {
        aguardando: "negado",
        execucao: "andamento",
        concluido: "aceito"
    };

    const status = document.createElement("div");
    status.classList.add(
        "ordem-status",
        classesFases[ordem.fase] || "andamento"
    );

    const textoStatus = document.createElement("span");
    textoStatus.textContent = nomesFases[ordem.fase] || ordem.fase;
    status.appendChild(textoStatus);

    const informacoes = document.createElement("div");
    informacoes.classList.add("ordem-info");

    const servico = document.createElement("h3");
    servico.textContent = ordem.servico;

    const cliente = document.createElement("span");
    cliente.textContent = `${ordem.nomeCliente} • ${ordem.placa}`;

    informacoes.append(servico, cliente);
    container.append(status, informacoes);

    const preco = document.createElement("div");
    preco.classList.add("valor-ordem");
    preco.textContent = Number(ordem.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    linha.append(container, preco);
    document.querySelector("#ordens-recentes").appendChild(linha);
}

// CARREGAR AS QUATRO ORDENS MAIS RECENTES

function carregarOrdensRecentes() {
    const painel = document.querySelector("#ordens-recentes");

    if (!painel) {
        return;
    }

    painel.innerHTML = "";

    const ordens = JSON.parse(localStorage.getItem("ordens")) || [];
    const ultimasOrdens = ordens.slice(-4).reverse();

    ultimasOrdens.forEach((ordem, indice) => {
        const ultimaLinha = indice === ultimasOrdens.length - 1;
        adicionarOrdemRecente(ordem, ultimaLinha);
    });
}

document.addEventListener("homeCarregada", carregarOrdensRecentes);

// CARREGAR PEÇAS PARA REPOR

function carregarPecasParaRepor() {
    const painel = document.querySelector("#pecas-para-repor");

    if (!painel) {
        return;
    }

    painel.innerHTML = "";

    const itens = JSON.parse(localStorage.getItem("itensEstoque")) || [];
    const itensParaRepor = itens.filter(item =>
        Number(item.quantidade) <= Number(item.minimo)
    );

    if (itensParaRepor.length === 0) {
        const mensagem = document.createElement("div");
        mensagem.classList.add("panel-row", "mensagem-vazia");
        mensagem.textContent = "Nenhuma peça precisa de reposição.";
        painel.appendChild(mensagem);
        return;
    }

    itensParaRepor.forEach((item, indice) => {
        const linha = document.createElement("div");
        linha.classList.add("panel-row");

        if (indice === itensParaRepor.length - 1) {
            linha.style.border = "none";
        }

        const informacoes = document.createElement("div");
        informacoes.classList.add("ordem-info");

        const nome = document.createElement("h3");
        nome.textContent = item.nome;
        informacoes.appendChild(nome);

        const quantidade = document.createElement("div");
        quantidade.classList.add("peca-falta", "negado");

        const unidade = Number(item.quantidade) === 1 ? "unidade" : "unidades";
        quantidade.textContent = `Restam: ${item.quantidade} ${unidade}`;

        linha.append(informacoes, quantidade);
        painel.appendChild(linha);
    });
}

document.addEventListener("homeCarregada", carregarPecasParaRepor);

// ATUALIZAR INDICADORES DA HOME

function atualizarIndicadores() {
    const ordens = JSON.parse(localStorage.getItem("ordens")) || [];
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    const itens = JSON.parse(localStorage.getItem("itensEstoque")) || [];

    const ordensAbertas = ordens.filter(ordem =>
        ordem.fase === "aguardando" || ordem.fase === "execucao"
    );

    const faturamento = ordensAbertas.reduce((total, ordem) => {
        return total + Number(ordem.preco);
    }, 0);

    const pecasBaixas = itens.filter(item =>
        Number(item.quantidade) <= Number(item.minimo)
    );

    document.querySelector("#total-ordens-abertas").textContent =
        ordensAbertas.length;

    document.querySelector("#total-clientes").textContent =
        clientes.length;

    document.querySelector("#faturamento-execucao").textContent =
        faturamento.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    document.querySelector("#total-pecas-baixo").textContent =
        pecasBaixas.length;
}

document.addEventListener("homeCarregada", atualizarIndicadores);

// NAVEGAR PELOS BOTÕES DOS PAINÉIS

document.addEventListener("click", (evento) => {
    const botao = evento.target.closest("#main-container [data-page]");

    if (botao) {
        const destino = document.querySelector(
            `.menu-item[data-page="${botao.dataset.page}"]`
        );

        if (destino) {
            destino.click();
        }
    }
});
