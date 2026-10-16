const perguntas = [
    {
        pergunta: "Qual linguagem cria a estrutura de uma página?",
        opcoes: ["CSS", "HTML", "JavaScript", "Python"],
        resposta: 1
    },
    {
        pergunta: "Qual linguagem muda o visual da página?",
        opcoes: ["HTML", "CSS", "Python", "SQL"],
        resposta: 1
    },
    {
        pergunta: "Qual linguagem adiciona interatividade?",
        opcoes: ["CSS", "HTML", "JavaScript", "SQL"],
        resposta: 2
    },
    {
        pergunta: "Qual comando mostra uma mensagem no console?",
        opcoes: ["console.log()", "print()", "echo()", "write()"],
        resposta: 0
    },
    {
        pergunta: "Qual tag cria um link?",
        opcoes: ["<p>", "<a>", "<h1>", "<img>"],
        resposta: 1
    },
    {
        pergunta: "Qual palavra cria uma constante?",
        opcoes: ["let", "var", "const", "fixed"],
        resposta: 2
    }
];

let numero = 0;
let acertos = 0;
let tempo = 60;
let intervalo;
let respondeu = false;

function mostrarPergunta() {
    respondeu = false;

    document.getElementById("mensagem").textContent = "";
    document.getElementById("alternativas").innerHTML = "";
    document.getElementById("pergunta").textContent = perguntas[numero].pergunta;
    document.getElementById("indice").textContent = (numero + 1) + " / 6";

    for (let i = 0; i < 4; i++) {
        let botao = document.createElement("button");

        botao.textContent = perguntas[numero].opcoes[i];

        botao.onclick = function() {
            if (respondeu == false) {
                respondeu = true;

                if (i == perguntas[numero].resposta) {
                    acertos++;
                    document.getElementById("acertos").textContent = acertos;
                    document.getElementById("mensagem").textContent = "Você acertou!";
                } else {
                    document.getElementById("mensagem").textContent = "Você errou!";
                }

                document.getElementById("proxima").hidden = false;
            }
        };

        document.getElementById("alternativas").appendChild(botao);
    }
}

function iniciarQuiz() {
    clearInterval(intervalo);

    numero = 0;
    acertos = 0;
    tempo = 60;

    document.getElementById("acertos").textContent = 0;
    document.getElementById("tempo").textContent = tempo + " segundos";
    document.getElementById("iniciar").hidden = true;
    document.getElementById("proxima").hidden = true;

    mostrarPergunta();

    intervalo = setInterval(function() {
        tempo--;
        document.getElementById("tempo").textContent = tempo + " segundos";

        if (tempo == 0) {
            finalizarQuiz();
        }
    }, 1000);
}

function finalizarQuiz() {
    clearInterval(intervalo);

    document.getElementById("pergunta").textContent = "Quiz finalizado!";
    document.getElementById("alternativas").innerHTML = "";
    document.getElementById("mensagem").textContent =
        "Você acertou " + acertos + " de 6 perguntas.";

    document.getElementById("iniciar").textContent = "Jogar novamente";
    document.getElementById("iniciar").hidden = false;
    document.getElementById("proxima").hidden = true;
}

document.getElementById("iniciar").onclick = iniciarQuiz;

document.getElementById("proxima").onclick = function() {
    numero++;

    if (numero < 6) {
        mostrarPergunta();
        document.getElementById("proxima").hidden = true;
    } else {
        finalizarQuiz();
    }
};