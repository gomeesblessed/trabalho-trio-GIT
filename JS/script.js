
const formulario = document.getElementById("formNotas");

const quantidade = document.getElementById("quantidade");
const mediaResumo = document.getElementById("mediaResumo");
const situacaoResumo = document.getElementById("situacaoResumo");
const boletim = document.getElementById("boletim");
const historico = document.getElementById("historico");
const mensagem = document.getElementById("mensagem");

let calculos = [];


function atualizarQuantidade() {
    let preenchidas = 0;

    for (let i = 1; i <= 4; i++) {
        const campo = document.getElementById("nota" + i);

        if (campo.value !== "") {
            preenchidas++;
        }
    }

    quantidade.textContent = preenchidas + " de 4";
}


for (let i = 1; i <= 4; i++) {
    const campo = document.getElementById("nota" + i);
    campo.addEventListener("input", atualizarQuantidade);
}


formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    mensagem.textContent = "";

    const nome = document.getElementById("nome").value.trim();
    const disciplina = document.getElementById("disciplina").value.trim();

    const notas = [];

    for (let i = 1; i <= 4; i++) {
        const campo = document.getElementById("nota" + i);

        if (campo.value === "") {
            mensagem.textContent = "Preencha todas as notas.";
            campo.focus();
            return;
        }

        const nota = Number(campo.value);

        if (!Number.isFinite(nota) || nota < 0 || nota > 10) {
            mensagem.textContent =
                "Digite notas entre 0 e 10.";

            campo.focus();
            return;
        }

        notas.push(nota);
    }

    const soma = notas.reduce(function(total, nota) {
        return total + nota;
    }, 0);

    const media = soma / 4;

    
    let situacao;

    if (media >= 6) {
        situacao = "Aprovado";
    } else {
        situacao = "Reprovado";
    }

    const classe = media >= 6 ? "aprovado" : "reprovado";
    const mediaFormatada = media.toFixed(1).replace(".", ",");

   
    mediaResumo.textContent = mediaFormatada;
    situacaoResumo.textContent = situacao;

    
    boletim.className = "boletim-dados";

    boletim.innerHTML = `
        <strong>Estudante:</strong> ${escaparHTML(nome)}<br>
        <strong>Disciplina:</strong> ${escaparHTML(disciplina)}<br>
        <strong>Notas:</strong> ${notas.map(function(nota) {
            return nota.toFixed(1).replace(".", ",");
        }).join(" • ")}<br>
        <span class="media-final">${mediaFormatada}</span><br>
        <strong>Situação:</strong>
        <span class="${classe}">${situacao}</span>
    `;


    calculos.unshift({
        nome: nome,
        disciplina: disciplina,
        media: media,
        situacao: situacao
    });

   
    calculos = calculos.slice(0, 5);

    mostrarHistorico();
});


function mostrarHistorico() {
    historico.innerHTML = "";

    calculos.forEach(function(calculo) {
        const item = document.createElement("li");

        item.innerHTML = `
            <strong>${escaparHTML(calculo.nome)}</strong> —
            ${escaparHTML(calculo.disciplina)}<br>
            Média: ${calculo.media.toFixed(1).replace(".", ",")}
            • ${calculo.situacao}
        `;

        historico.appendChild(item);
    });
}


function escaparHTML(texto) {
    return texto.replace(/[&<>"']/g, function(caractere) {
        const entidades = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entidades[caractere];
    });
}


formulario.addEventListener("reset", function() {
    mensagem.textContent = "";

    quantidade.textContent = "0 de 4";
    mediaResumo.textContent = "--";
    situacaoResumo.textContent = "--";

    boletim.className = "boletim-vazio";
    boletim.textContent =
        'Preencha as informações e clique em "Calcular média".';
});


atualizarQuantidade();

