// ========================================
// CONFIGURAÇÃO FIXA DO ALUNO
// ========================================

var CONFIG_ALUNO = CONFIG_ALUNO || {
    turma: "8B",
    numeroChamada: 36,
    apiUrl: "https://boletim-api.profbt.com.br"
};

// Sessão em memória
let pinSessao = null;
let disciplinasAtuais = [];

// ========================================
// DADOS FICTÍCIOS DO BOLETIM (INICIAIS)
// ========================================

const disciplinasPadrao = [
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
    if (valor === null || valor === undefined || valor === "") {
        return null;
    }

    let numero;

    if (typeof valor === "string") {
        numero = Number(valor.replace(",", ".").trim());
    } else {
        numero = Number(valor);
    }

    if (Number.isNaN(numero)) {
        return null;
    }

    if (numero >= 0 && numero <= 10) {
        return numero;
    }

    if (numero > 10 && numero <= 100) {
        return numero / 10;
    }

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

    const notasDisponiveis = notas.filter(nota => nota !== null);

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
    if (!disciplina.faltas || !Array.isArray(disciplina.faltas)) {
        return 0;
    }
    return disciplina.faltas.reduce(
        (total, falta) => total + (Number(falta) || 0),
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
    if (!tabela) return;
    tabela.innerHTML = "";

    disciplinasAtuais.forEach(disciplina => {
        const nota1 = normalizarNota(disciplina.tri1);
        const nota2 = normalizarNota(disciplina.tri2);
        const nota3 = normalizarNota(disciplina.tri3);

        const media = calcularMedia(disciplina);
        const faltas = calcularFaltas(disciplina);
        const situacao = definirSituacao(media);

        const linha = document.createElement("tr");

        const tdNome = document.createElement("td");
        tdNome.textContent = disciplina.disciplina;
        linha.appendChild(tdNome);

        const tdTri1 = document.createElement("td");
        tdTri1.textContent = formatarNota(nota1);
        linha.appendChild(tdTri1);

        const tdTri2 = document.createElement("td");
        tdTri2.textContent = formatarNota(nota2);
        linha.appendChild(tdTri2);

        const tdTri3 = document.createElement("td");
        tdTri3.textContent = formatarNota(nota3);
        linha.appendChild(tdTri3);

        const tdMedia = document.createElement("td");
        tdMedia.textContent = formatarNota(media);
        linha.appendChild(tdMedia);

        const tdFaltas = document.createElement("td");
        tdFaltas.textContent = faltas;
        linha.appendChild(tdFaltas);

        const tdSituacao = document.createElement("td");
        tdSituacao.className = classeSituacao(situacao);
        tdSituacao.textContent = situacao;
        linha.appendChild(tdSituacao);

        tabela.appendChild(linha);
    });
}


// ========================================
// CARDS DE RESUMO
// ========================================

function preencherResumo() {
    const medias = disciplinasAtuais
        .map(disciplina => calcularMedia(disciplina))
        .filter(media => media !== null);

    const mediaGeral = medias.length > 0
        ? medias.reduce((total, media) => total + media, 0) / medias.length
        : null;

    const totalFaltas = disciplinasAtuais.reduce(
        (total, disciplina) => total + calcularFaltas(disciplina),
        0
    );

    const quantidadeBom = disciplinasAtuais.filter(disciplina => {
        const media = calcularMedia(disciplina);
        return media !== null && media >= 6.0;
    }).length;

    const quantidadeAtencao = disciplinasAtuais.filter(disciplina => {
        const media = calcularMedia(disciplina);
        return media !== null && media < 6.0;
    }).length;

    const elMediaGeral = document.getElementById("media-geral");
    const elTotalFaltas = document.getElementById("total-faltas");
    const elBomDesempenho = document.getElementById("bom-desempenho");
    const elAtencao = document.getElementById("atencao");

    if (elMediaGeral) elMediaGeral.textContent = formatarNota(mediaGeral);
    if (elTotalFaltas) elTotalFaltas.textContent = totalFaltas;
    if (elBomDesempenho) elBomDesempenho.textContent = quantidadeBom;
    if (elAtencao) elAtencao.textContent = quantidadeAtencao;
}

function atualizarTela() {
    preencherTabela();
    preencherResumo();
}


// ========================================
// AUTENTICAÇÃO E CONEXÃO COM A API
// ========================================

const formLogin = document.getElementById("form-login");
const pinInput = document.getElementById("pin-input");
const mensagemLogin = document.getElementById("mensagem-login");
const secaoLogin = document.getElementById("secao-login");
const conteudoBoletim = document.getElementById("conteudo-boletim");

if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const pinDigitado = pinInput.value.trim();

        if (!pinDigitado) {
            mensagemLogin.textContent = "Digite o PIN.";
            return;
        }

        mensagemLogin.textContent = "Conectando...";

        try {
            const response = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    turma: CONFIG_ALUNO.turma,
                    numero_chamada: CONFIG_ALUNO.numeroChamada,
                    pin: pinDigitado
                })
            });

            if (response.status === 401) {
                mensagemLogin.textContent = "Turma, chamada ou PIN inválidos.";
                return;
            }

            if (response.status === 429) {
                mensagemLogin.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
                return;
            }

            if (!response.ok) {
                mensagemLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
                return;
            }

            const data = await response.json();

            pinSessao = pinDigitado;
            pinInput.value = "";

            if (data.dados && data.dados.disciplinas && Array.isArray(data.dados.disciplinas)) {
                disciplinasAtuais = data.dados.disciplinas;
            } else {
                disciplinasAtuais = JSON.parse(JSON.stringify(disciplinasPadrao));
            }

            secaoLogin.style.display = "none";
            conteudoBoletim.style.display = "block";
            atualizarTela();

        } catch (error) {
            mensagemLogin.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
        }
    });
}


// ========================================
// EDIÇÃO E SALVAMENTO NA API
// ========================================

const btnAlternarEdicao = document.getElementById("btn-alternar-edicao");
const secaoEdicao = document.getElementById("secao-edicao");
const tabelaEdicao = document.getElementById("tabela-edicao");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const mensagemEdicao = document.getElementById("mensagem-edicao");

if (btnAlternarEdicao) {
    btnAlternarEdicao.addEventListener("click", () => {
        preencherTabelaEdicao();
        secaoEdicao.style.display = "block";
        mensagemEdicao.textContent = "";
    });
}

if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
        secaoEdicao.style.display = "none";
        mensagemEdicao.textContent = "";
    });
}

function valorParaInputNota(valor) {
    if (valor === null || valor === undefined || valor === "") {
        return "";
    }
    const norm = normalizarNota(valor);
    if (norm === null) return "";
    return String(norm).replace(".", ",");
}

function preencherTabelaEdicao() {
    if (!tabelaEdicao) return;
    tabelaEdicao.innerHTML = "";

    disciplinasAtuais.forEach((disc, index) => {
        const tr = document.createElement("tr");

        const tdNome = document.createElement("td");
        tdNome.textContent = disc.disciplina;
        tr.appendChild(tdNome);

        const f1 = disc.faltas ? (disc.faltas[0] ?? 0) : 0;
        const f2 = disc.faltas ? (disc.faltas[1] ?? 0) : 0;
        const f3 = disc.faltas ? (disc.faltas[2] ?? 0) : 0;

        tr.innerHTML += `
            <td><input type="text" data-tipo="nota" data-index="${index}" data-tri="1" value="${valorParaInputNota(disc.tri1)}"></td>
            <td><input type="text" data-tipo="nota" data-index="${index}" data-tri="2" value="${valorParaInputNota(disc.tri2)}"></td>
            <td><input type="text" data-tipo="nota" data-index="${index}" data-tri="3" value="${valorParaInputNota(disc.tri3)}"></td>
            <td><input type="text" data-tipo="falta" data-index="${index}" data-tri="1" value="${f1}"></td>
            <td><input type="text" data-tipo="falta" data-index="${index}" data-tri="2" value="${f2}"></td>
            <td><input type="text" data-tipo="falta" data-index="${index}" data-tri="3" value="${f3}"></td>
        `;

        tabelaEdicao.appendChild(tr);
    });
}

function validarNotaInput(texto) {
    const t = texto.trim();
    if (t === "") return { valido: true, valor: null };

    const regex = /^(10([.,]0+)?|[0-9]([.,]\d+)?)$/;
    if (!regex.test(t)) {
        return { valido: false };
    }

    const num = Number(t.replace(",", "."));
    if (Number.isNaN(num) || num < 0 || num > 10) {
        return { valido: false };
    }

    return { valido: true, valor: num };
}

function validarFaltaInput(texto) {
    const t = texto.trim();
    if (t === "") return { valido: false };

    const regex = /^\d+$/;
    if (!regex.test(t)) {
        return { valido: false };
    }

    const num = Number(t);
    if (Number.isNaN(num) || num < 0) {
        return { valido: false };
    }

    return { valido: true, valor: num };
}

if (btnSalvar) {
    btnSalvar.addEventListener("click", async () => {
        mensagemEdicao.textContent = "";
        const inputs = tabelaEdicao.querySelectorAll("input");
        let haErros = false;

        inputs.forEach(input => input.classList.remove("campo-invalido"));

        const novasDisciplinas = JSON.parse(JSON.stringify(disciplinasAtuais));

        inputs.forEach(input => {
            const tipo = input.dataset.tipo;
            const index = Number(input.dataset.index);
            const tri = Number(input.dataset.tri);
            const valorTexto = input.value;

            if (tipo === "nota") {
                const res = validarNotaInput(valorTexto);
                if (!res.valido) {
                    input.classList.add("campo-invalido");
                    haErros = true;
                } else {
                    if (tri === 1) novasDisciplinas[index].tri1 = res.valor;
                    if (tri === 2) novasDisciplinas[index].tri2 = res.valor;
                    if (tri === 3) novasDisciplinas[index].tri3 = res.valor;
                }
            } else if (tipo === "falta") {
                const res = validarFaltaInput(valorTexto);
                if (!res.valido) {
                    input.classList.add("campo-invalido");
                    haErros = true;
                } else {
                    if (!novasDisciplinas[index].faltas) {
                        novasDisciplinas[index].faltas = [0, 0, 0];
                    }
                    novasDisciplinas[index].faltas[tri - 1] = res.valor;
                }
            }
        });

        if (haErros) {
            mensagemEdicao.textContent = "Verifique os campos destacados em vermelho.";
            return;
        }

        mensagemEdicao.textContent = "Salvando...";

        try {
            const response = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    turma: CONFIG_ALUNO.turma,
                    numero_chamada: CONFIG_ALUNO.numeroChamada,
                    pin: pinSessao,
                    dados: {
                        disciplinas: novasDisciplinas
                    }
                })
            });

            if (!response.ok) {
                mensagemEdicao.textContent = "Não foi possível salvar as alterações. Tente novamente.";
                return;
            }

            disciplinasAtuais = novasDisciplinas;
            atualizarTela();
            secaoEdicao.style.display = "none";
            mensagemEdicao.textContent = "Dados salvos com sucesso.";

        } catch (error) {
            mensagemEdicao.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
        }
    });
}