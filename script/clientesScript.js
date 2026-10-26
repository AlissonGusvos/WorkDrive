// ABRIR MODAL DE CLIENTE

document.addEventListener("click", (evento) => {
    if (evento.target.closest("#abrir-modal-cliente")) {
        const fundoModal = document.querySelector("#fundo-modal-cliente");
        fundoModal.classList.add("aberto");
        fundoModal.setAttribute("aria-hidden", "false");
    }
});

// CRIAR LINHA DO CLIENTE

function adicionarCliente(cliente, indice) {
    const listaClientes = document.querySelector("#lista-clientes");

    const cartao = document.createElement("div");
    cartao.classList.add("box-content");
    cartao.dataset.indice = indice;

    const cabecalho = document.createElement("div");
    cabecalho.classList.add("head-client-info");

    const informacoes = document.createElement("div");
    informacoes.classList.add("client-info");

    const nome = document.createElement("h4");
    nome.classList.add("client-name");
    nome.textContent = cliente.nome;

    const telefone = document.createElement("span");
    telefone.classList.add("client-phone");
    telefone.textContent = cliente.telefone;

    informacoes.append(nome, telefone);

    const opcoes = document.createElement("div");
    opcoes.classList.add("info-opt");

    const botaoExcluir = document.createElement("button");
    botaoExcluir.classList.add("del-client");
    botaoExcluir.type = "button";
    botaoExcluir.textContent = "Excluir";

    opcoes.appendChild(botaoExcluir);
    cabecalho.append(informacoes, opcoes);

    const veiculo = document.createElement("div");
    veiculo.classList.add("info-veiculo");

    const placa = document.createElement("div");
    placa.classList.add("placa");
    placa.textContent = cliente.placa;

    const modeloAno = document.createElement("span");
    modeloAno.textContent = `${cliente.modelo} • ${cliente.ano}`;

    veiculo.append(placa, modeloAno);
    cartao.append(cabecalho, veiculo);
    listaClientes.appendChild(cartao);
}

// CARREGAR CLIENTES SALVOS

function carregarClientes() {
    const listaClientes = document.querySelector("#lista-clientes");

    if (!listaClientes) {
        return;
    }

    listaClientes.innerHTML = "";

    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    clientes.forEach((cliente, indice) => adicionarCliente(cliente, indice));
}

document.addEventListener("clientesCarregada", carregarClientes);

// SALVAR INFORMAÇÕES DO CLIENTE

document.addEventListener("click", (evento) => {
    if (evento.target.closest("#form-save-cliente")) {
        const formulario = document.querySelector("#formulario");

        if (!formulario.reportValidity()) {
            return;
        }

        const cliente = {
            nome: document.querySelector("#nome-cliente").value.trim(),
            telefone: document.querySelector("#telefone-cliente").value.trim(),
            placa: document.querySelector("#placa-cliente").value.trim(),
            modelo: document.querySelector("#modelo-cliente").value.trim(),
            ano: document.querySelector("#ano-cliente").value
        };

        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
        clientes.push(cliente);

        localStorage.setItem("clientes", JSON.stringify(clientes));
        adicionarCliente(cliente, clientes.length - 1);

        formulario.reset();

        const fundoModal = document.querySelector("#fundo-modal-cliente");
        fundoModal.classList.remove("aberto");
        fundoModal.setAttribute("aria-hidden", "true");
    }
});

// EXCLUIR CLIENTE

document.addEventListener("click", (evento) => {
    if (evento.target.closest(".del-client")) {
        const cartao = evento.target.closest(".box-content");
        const indice = Number(cartao.dataset.indice);
        const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

        clientes.splice(indice, 1);
        localStorage.setItem("clientes", JSON.stringify(clientes));
        cartao.remove();

        const cartoes = document.querySelectorAll("#lista-clientes > .box-content");

        cartoes.forEach((cartao, novoIndice) => {
            cartao.dataset.indice = novoIndice;
        });
    }
});

// FECHAR MODAL DE CLIENTE

document.addEventListener("click", (evento) => {
    if (evento.target.closest("#form-cancel-cliente")) {
        const fundoModal = document.querySelector("#fundo-modal-cliente");
        fundoModal.classList.remove("aberto");
        fundoModal.setAttribute("aria-hidden", "true");
    }
});
