// ABRIR E FECHAR MODAL

document.addEventListener("click", (evento) => {
    if (evento.target.closest("#abrir-modal-ordem")) {
        carregarPlacas();

        const fundoModal = document.querySelector("#fundo-modal-ordem");
        fundoModal.classList.add("aberto");
        fundoModal.setAttribute("aria-hidden", "false");
    }

    if (evento.target.closest("#form-cancel-ordem")) {
        const fundoModal = document.querySelector("#fundo-modal-ordem");
        fundoModal.classList.remove("aberto");
        fundoModal.setAttribute("aria-hidden", "true");
    }
});

// CARREGAR PLACAS DOS CLIENTES

function carregarPlacas() {
    const seletor = document.querySelector("#placa-ordem");
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    seletor.innerHTML = '<option value="">Selecione a placa do veículo</option>';

    if (clientes.length === 0) {
        seletor.innerHTML = '<option value="">Nenhum cliente cadastrado</option>';
    }

    clientes.forEach(cliente => {
        const opcao = document.createElement("option");
        opcao.value = cliente.placa;
        opcao.textContent = cliente.placa;
        seletor.appendChild(opcao);
    });
}

// MOSTRAR DADOS DO CLIENTE SELECIONADO

document.addEventListener("change", (evento) => {
    if (evento.target.matches("#placa-ordem")) {
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        const cliente = clientes.find(item => item.placa === evento.target.value);
        const informacoes = document.querySelector("#cliente-selecionado");

        if (cliente) {
            informacoes.value = `${cliente.nome} • ${cliente.modelo}`;
        } else {
            informacoes.value = "";
        }
    }
});

// CRIAR CARTÃO DA ORDEM

function adicionarOrdem(ordem) {
    const coluna = document.querySelector(`.coluna[data-status="${ordem.fase}"] .card-area`);
    const cartao = document.createElement("div");
    cartao.classList.add("card");
    cartao.dataset.id = ordem.id;

    const linhaCodigo = document.createElement("div");
    linhaCodigo.classList.add("card-row-1");

    const codigo = document.createElement("span");
    codigo.classList.add("ordem-codigo");
    codigo.textContent = ordem.placa;

    const botaoExcluir = document.createElement("button");
    botaoExcluir.type = "button";
    botaoExcluir.classList.add("excluir-ordem");
    botaoExcluir.textContent = "Excluir";

    linhaCodigo.append(codigo, botaoExcluir);

    const linhaServico = document.createElement("div");
    linhaServico.classList.add("card-row-2");

    const servico = document.createElement("h4");
    servico.classList.add("nome-servico");
    servico.textContent = ordem.servico;

    const dadosCliente = document.createElement("span");
    dadosCliente.classList.add("client-info");
    dadosCliente.textContent = `${ordem.nomeCliente} • ${ordem.modelo}`;

    linhaServico.append(servico, dadosCliente);

    const linhaFase = document.createElement("div");
    linhaFase.classList.add("card-row-3");

    const preco = document.createElement("h4");
    preco.classList.add("preco");
    preco.textContent = Number(ordem.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const seletorFase = document.createElement("select");
    seletorFase.classList.add("opcoes");

    const fases = [
        { valor: "aguardando", nome: "Aguardando Peça" },
        { valor: "execucao", nome: "Em Execução" },
        { valor: "concluido", nome: "Concluído" }
    ];

    fases.forEach(fase => {
        const opcao = document.createElement("option");
        opcao.value = fase.valor;
        opcao.textContent = fase.nome;
        opcao.selected = fase.valor === ordem.fase;
        seletorFase.appendChild(opcao);
    });

    linhaFase.append(preco, seletorFase);
    cartao.append(linhaCodigo, linhaServico, linhaFase);
    coluna.appendChild(cartao);
}

// CARREGAR ORDENS SALVAS

function carregarOrdens() {
    const areas = document.querySelectorAll(".card-area");
    areas.forEach(area => area.innerHTML = "");

    const ordens = JSON.parse(localStorage.getItem("ordens")) || [];
    ordens.forEach(ordem => adicionarOrdem(ordem));
}

document.addEventListener("ordemCarregada", carregarOrdens);

// SALVAR ORDEM

document.addEventListener("click", (evento) => {
    if (evento.target.closest("#form-save-ordem")) {
        const formulario = document.querySelector("#formulario");

        if (!formulario.reportValidity()) {
            return;
        }

        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        const placa = document.querySelector("#placa-ordem").value;
        const cliente = clientes.find(item => item.placa === placa);

        if (!cliente) {
            alert("Cadastre um cliente antes de criar uma ordem.");
            return;
        }

        const ordem = {
            id: Date.now().toString(),
            codigo: `OS-${Date.now()}`,
            servico: document.querySelector("#servico-ordem").value.trim(),
            preco: document.querySelector("#preco-ordem").value,
            fase: document.querySelector("#fase-ordem").value,
            nomeCliente: cliente.nome,
            placa: cliente.placa,
            modelo: cliente.modelo
        };

        const ordens = JSON.parse(localStorage.getItem("ordens")) || [];
        ordens.push(ordem);
        localStorage.setItem("ordens", JSON.stringify(ordens));

        adicionarOrdem(ordem);
        formulario.reset();

        const informacoes = document.querySelector("#cliente-selecionado");
        informacoes.value = "";

        const fundoModal = document.querySelector("#fundo-modal-ordem");
        fundoModal.classList.remove("aberto");
        fundoModal.setAttribute("aria-hidden", "true");
    }
});

// ATUALIZAR FASE DA ORDEM

document.addEventListener("change", (evento) => {
    if (evento.target.matches(".opcoes")) {
        const cartao = evento.target.closest(".card");
        const ordens = JSON.parse(localStorage.getItem("ordens")) || [];
        const ordem = ordens.find(item => item.id === cartao.dataset.id);

        if (ordem) {
            ordem.fase = evento.target.value;
            localStorage.setItem("ordens", JSON.stringify(ordens));

            const destino = document.querySelector(
                `.coluna[data-status="${ordem.fase}"] .card-area`
            );
            destino.appendChild(cartao);
        }
    }
});

// EXCLUIR ORDEM

document.addEventListener("click", (evento) => {
    if (evento.target.closest(".excluir-ordem")) {
        const cartao = evento.target.closest(".card");
        const ordens = JSON.parse(localStorage.getItem("ordens")) || [];
        const novasOrdens = ordens.filter(ordem => ordem.id !== cartao.dataset.id);

        localStorage.setItem("ordens", JSON.stringify(novasOrdens));
        cartao.remove();
    }
});
