// ========================================
// DADOS FICTÍCIOS DO BOLETIM
// ========================================

const disciplinas = [
    {
        disciplina: "Língua Portuguesa",
        tri1: 84,
        tri2: "0",
        tri3: 0,
        faltas: [2, 1, 1]
    },
    {
        disciplina: "Matemática",
        tri1: 52,
        tri2: "5,8",
        tri3: null,
        faltas: [3, 2, 1]
    },
    {
        disciplina: "Ciências",
        tri1: "8,1",
        tri2: 76,
        tri3: 8.0,
        faltas: [1, 2, 0]
    },
    {
        disciplina: "História",
        tri1: 7.0,
        tri2: 84,
        tri3: null,
        faltas: [1, 1, 1]
    },
    {
        disciplina: "Geografia",
        tri1: 68,
        tri2: 7.3,
        tri3: "7,9",
        faltas: [0, 1, 1]
    },
    {
        disciplina: "Língua Inglesa",
        tri1: 86,
        tri2: "8,1",
        tri3: 8.7,
        faltas: [1, 0, 0]
    },
    {
        disciplina: "Arte",
        tri1: 9.0,
        tri2: 92,
        tri3: null,
        faltas: [1, 1, 0]
    },
    {
        disciplina: "Educação Física",
        tri1: 95,
        tri2: 9.0,
        tri3: "9,4",
        faltas: [0, 1, 0]
    },
    {
        disciplina: "Educação Digital",
        tri1: 88,
        tri2: 9.1,
        tri3: 93,
        faltas: [1, 0, 1]
    },
    {
        disciplina: "Educação Financeira",
        tri1: 74,
        tri2: "7,8",
        tri3: null,
        faltas: [1, 1, 1]
    },
    {
        disciplina: "Estudo Orientado",
        tri1: 8.0,
        tri2: 83,
        tri3: "8,5",
        faltas: [0, 1, 0]
    },
    {
        disciplina: "Redação e Leitura",
        tri1: 62,
        tri2: "6,8",
        tri3: null,
        faltas: [2, 1, 1]
    },
    {
        disciplina: "Pensamento Lógico",
        tri1: 48,
        tri2: 5.6,
        tri3: "6,0",
        faltas: [2, 2, 1]
    },
    {
        disciplina: "Literatura Arte e Movimento",
        tri1: "7,7",
        tri2: 80,
        tri3: null,
        faltas: [1, 0, 1]
    },
    {
        disciplina: "Práticas Experimentais",
        tri1: 58,
        tri2: "6,2",
        tri3: 6.4,
        faltas: [1, 1, 1]
    }
];


// ========================================
// NORMALIZAÇÃO DAS NOTAS
// ========================================

function normalizarNota(valor) {
    // Nota vazia não foi lançada.
    if (valor === null || valor === undefined || valor === "") {
        return null;
    }

    // Aceita números e textos com vírgula decimal.
    let numero;

    if (typeof valor === "string") {
        numero = Number(valor.replace(",", ".").trim());
    } else {
        numero = Number(valor);
    }

    // Se não for um número válido, retorna inválido.
    if (Number.isNaN(numero)) {
        return null;
    }

    // Valores entre 0 e 10 já estão na escala correta.
    if (numero >= 0 && numero <= 10) {
        return numero;
    }

    // Valores acima de 10 até 100 são convertidos para a escala 0–10.
    if (numero > 10 && numero <= 100) {
        return numero / 10;
    }

    // Qualquer outro valor é inválido.
    return null;
}


// ========================================
// FORMATAÇÃO DAS NOTAS
// ========================================

function formatarNota(valor) {
    if (valor === null) {
        return "Ainda não lançada";
    }

    return valor.toFixed(1).replace(".", ",");
}


// ========================================
// CÁLCULO DA MÉDIA
// ========================================

function calcularMedia(disciplina) {
    const notas = [
        normalizarNota(disciplina.tri1),
        normalizarNota(disciplina.tri2),
        normalizarNota(disciplina.tri3)
    ];

    // Remove as notas que não existem.
    const notasDisponiveis = notas.filter(nota => nota !== null);

    // Não transforma nota ausente em zero.
    if (notasDisponiveis.length === 0) {
        return null;
    }

    const soma = notasDisponiveis.reduce(
        (total, nota) => total + nota,
        0
    );

    return soma / notasDisponiveis.length;
}


// ========================================
// SOMA DAS FALTAS
// ========================================

function calcularFaltas(disciplina) {
    return disciplina.faltas.reduce(
        (total, falta) => total + falta,
        0
    );
}


// ========================================
// SITUAÇÃO DA DISCIPLINA
// ========================================

function definirSituacao(media) {
    if (media === null) {
        return "Nota ainda não disponível";
    }

    if (media >= 6.0) {
        return "Bom desempenho";
    }

    return "Atenção";
}


// ========================================
// CLASSE CSS DA SITUAÇÃO
// ========================================

function classeSituacao(situacao) {
    if (situacao === "Bom desempenho") {
        return "situacao-bom";
    }

    if (situacao === "Atenção") {
        return "situacao-atencao";
    }

    return "situacao-indisponivel";
}


// ========================================
// PREENCHIMENTO DA TABELA
// ========================================

function preencherTabela() {
    const tabela = document.getElementById("tabela-boletim");

    tabela.innerHTML = "";

    disciplinas.forEach(disciplina => {
        const nota1 = normalizarNota(disciplina.tri1);
        const nota2 = normalizarNota(disciplina.tri2);
        const nota3 = normalizarNota(disciplina.tri3);

        const media = calcularMedia(disciplina);
        const faltas = calcularFaltas(disciplina);
        const situacao = definirSituacao(media);

        const linha = document.createElement("tr");

        linha.innerHTML = `
            <td>${disciplina.disciplina}</td>
            <td>${formatarNota(nota1)}</td>
            <td>${formatarNota(nota2)}</td>
            <td>${formatarNota(nota3)}</td>
            <td>${formatarNota(media)}</td>
            <td>${faltas}</td>
            <td class="${classeSituacao(situacao)}">
                ${situacao}
            </td>
        `;

        tabela.appendChild(linha);
    });
}


// ========================================
// CARDS DE RESUMO
// ========================================

function preencherResumo() {
    const medias = disciplinas
        .map(disciplina => calcularMedia(disciplina))
        .filter(media => media !== null);

    const mediaGeral = medias.reduce(
        (total, media) => total + media,
        0
    ) / medias.length;

    const totalFaltas = disciplinas.reduce(
        (total, disciplina) => total + calcularFaltas(disciplina),
        0
    );

    const quantidadeBom = disciplinas.filter(disciplina => {
        const media = calcularMedia(disciplina);
        return media !== null && media >= 6.0;
    }).length;

    const quantidadeAtencao = disciplinas.filter(disciplina => {
        const media = calcularMedia(disciplina);
        return media !== null && media < 6.0;
    }).length;

    document.getElementById("media-geral").textContent =
        formatarNota(mediaGeral);

    document.getElementById("total-faltas").textContent =
        totalFaltas;

    document.getElementById("bom-desempenho").textContent =
        quantidadeBom;

    document.getElementById("atencao").textContent =
        quantidadeAtencao;
}


// ========================================
// FREQUÊNCIA DEMONSTRATIVA
// ========================================

// Esta frequência é apenas demonstrativa.
// No futuro, ela será tratada de outra forma.
// Ela NÃO é calculada a partir das faltas.


// ========================================
// INICIAR O BOLETIM
// ========================================

preencherTabela();
preencherResumo();