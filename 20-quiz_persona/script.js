document.addEventListener('DOMContentLoaded', () => {// --- Elementos do DOM ---
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const submitQuizBtn = document.getElementById('submit-quiz-btn');
    const resultModal = document.getElementById('result-modal');
    const resultTitle = document.getElementById('result-title');
    const resultImage = document.getElementById('result-image');
    const resultDescription = document.getElementById('result-description');
    const restartQuizBtn = document.getElementById('restart-quiz-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBoxBtn = document.getElementById('close-message-btn');
    // --- Dados do Quiz ---
        const quizData = [
        {
            question: "Qual tipo de ambiente você prefere para trabalhar?",
            options: [
                { text: "Um escritório movimentado e colaborativo.", 
                    scores: { extrovertido: 2, criativo: 1, lider: 1 } },
                { text: "Um espaço tranquilo e focado, com poucas distrações.", 
                    scores: { introvertido: 2, analitico: 1 } },
                { text: "Um local flexível onde posso me movimentar e explorar.", 
                    scores: { aventureiro: 2, criativo: 2 } },
                { text: "Um ambiente estruturado com regras claras e tarefas definidas.", 
                    scores: { organizado: 2, analitico: 1 } }
            ]
        },
        {
            question: "Como você lida com problemas inesperados?",
            options: [
                { text: "Busco soluções inovadoras e fora da caixa.", 
                    scores: { criativo: 2, aventureiro: 1 } },
                { text: "Analiso os fatos cuidadosamente antes de agir.", 
                    scores: { analitico: 2, organizado: 1 } },
                { text: "Peço ajuda e trabalho em equipe para resolver.", 
                    scores: { extrovertido: 2, lider: 1 } },
                { text: "Prefiro resolver sozinho, confiando nas minhas habilidades.", 
                    scores: { introvertido: 1, analitico: 1 } }
            ]
        },
        {
            question: "Qual atividade de lazer te atrai mais?",
            options: [
                { text: "Participar de eventos sociais e festas.",
                     scores: { extrovertido: 2, aventureiro: 1 } },
                { text: "Ler um bom livro ou assistir a um documentário.", 
                    scores: { introvertido: 2, analitico: 1 } },
                { text: "Explorar novos lugares ou praticar esportes radicais.",
                     scores: { aventureiro: 2, criativo: 1 } },
                { text: "Organizar e planejar algo (uma viagem, um evento).",
                     scores: { organizado: 2, lider: 1 } }
            ]
        },
        {
            question: "Qual característica você mais valoriza em outras pessoas?",
            options: [
                { text: "Originalidade e imaginação.",
                     scores: { criativo: 2 } },
                { text: "Lógica e racionalidade.",
                     scores: { analitico: 2 } },
                { text: "Carisma e habilidades de comunicação.", 
                    scores: { extrovertido: 2 } },
                { text: "Disciplina e responsabilidade.", 
                    scores: { organizado: 2 } }
            ]
        },
        {
            question: "Se você pudesse escolher um superpoder, qual seria?",
            options: [
                { text: "Voar (liberdade e exploração).", 
                    scores: { aventureiro: 2, criativo: 1 } },
                { text: "Ler mentes (entender as pessoas).",
                     scores: { analitico: 1, introvertido: 1 } },
                { text: "Superforça (proteger e liderar).",
                     scores: { lider: 2, extrovertido: 1 } },
                { text: "Controle do tempo (organização e planejamento).",
                     scores: { organizado: 2, analitico: 1 } }
            ]
        }
    ];
    const results = [
        {
            name: "O Explorador Corajoso",
            description: "Você é uma pessoa cheia de energia, 
            curiosa e sempre pronta para novas aventuras. Gosta de
             desafios e de desbravar o desconhecido. 
             Sua mente criativa te leva a caminhos inusitados.",
            image: "https://placehold.co/400x300/8e44ad/ffffff?text=Explorador",
            traits: { aventureiro: 3, criativo: 2 }
        },
        {
            name: "O Pensador Analítico",
            description: "Com uma mente lógica e observadora,
             você prefere analisar os detalhes e buscar a verdade nos fatos. 
             É metódico e valoriza a precisão. Soluções bem fundamentadas são seu forte.",
            image: "https://placehold.co/400x300/3498db/ffffff?text=Analitico",
            traits: { analitico: 3, introvertido: 2 }
        },
        {
            name: "O Líder Carismático",
            description: "Você tem um talento natural para se comunicar 
            e inspirar as pessoas. É extrovertido, gosta de estar rodeado 
            de gente e não tem medo de assumir a frente em qualquer situação.
             Um verdadeiro catalisador de equipes.",
            image: "https://placehold.co/400x300/2ecc71/ffffff?text=Lider",
            traits: { extrovertido: 3, lider: 2 }
        },
        {
            name: "O Artista Inovador",
            description: "Sua criatividade não tem limites!
             Você vê o mundo de uma forma única e adora expressar suas ideias d
             e maneiras originais. Inovação e imaginação são suas marcas registradas.",
            image: "https://placehold.co/400x300/f1c40f/ffffff?text=Artista",
            traits: { criativo: 3, aventureiro: 1 }
        },
        {
            name: "O Organizador Mestre",
            description: "Você é uma pessoa extremamente organizada e
             metódica. Gosta de planejar tudo nos mínimos detalhes e garante q
             ue as coisas funcionem sem problemas. A ordem é seu lema.",
            image: "https://placehold.co/400x300/e67e22/ffffff?text=Organizador",
            traits: { organizado: 3, analitico: 1 }
        }
    ];
    let currentQuestionIndex = 0; // Índice da pergunta atual
    let userScores = { // Pontuações do usuário para cada característica
        extrovertido: 0,
        introvertido: 0,
        criativo: 0,
        analitico: 0,
        aventureiro: 0,
        lider: 0,
        organizado: 0
    };
    let selectedOption = null; // A opção atualmente selecionada pelo usuário
    /**
     * @param {string} message - A mensagem a ser exibida.
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    function hideMessage() {
        messageBox.style.display = 'none';
    }
    function renderQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        optionsContainer.innerHTML = ''; // Limpa opções anteriores
        selectedOption = null; // Reseta a opção selecionada para a nova pergunta
        nextQuestionBtn.disabled = true; // Desabilita o botão "Próxima" até uma opção ser selecionada
        if (currentQuestionIndex === quizData.length - 1) {
            nextQuestionBtn.style.display = 'none';
            submitQuizBtn.style.display = 'block';
        } else {
            nextQuestionBtn.style.display = 'block';
            submitQuizBtn.style.display = 'none';
        }
        currentQuestion.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.classList.add('option-button');
            optionButton.textContent = option.text;
            optionButton.dataset.optionIndex = index; // Armazena o índice da opção
            optionButton.addEventListener('click', 
                () => selectOption(optionButton, option.scores));
            optionsContainer.appendChild(optionButton);
        });
    }
    function selectOption(clickedButton, scores) {
        // Remove a classe 'selected' de todas as opções
        document.querySelectorAll('.option-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        clickedButton.classList.add('selected');
        selectedOption = scores; // Armazena as pontuações da opção selecionada
        nextQuestionBtn.disabled = false; // Habilita o botão "Próxima"
        submitQuizBtn.disabled = false; // Habilita o botão "Ver Resultado" (se for a última pergunta)
    }
    function goToNextQuestion() {
        if (selectedOption === null) {
            showMessage('Por favor, selecione uma opção antes de continuar.');
            return;
        }
        for (const trait in selectedOption) {
            if (userScores.hasOwnProperty(trait)) {
                userScores[trait] += selectedOption[trait];
            }
        }
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            renderQuestion();
        } else {
            showResult();
        }
    }
    function showResult() {
        let maxScore = -1;
        let dominantTrait = '';
        for (const trait in userScores) {
            if (userScores[trait] > maxScore) {
                maxScore = userScores[trait];
                dominantTrait = trait;
            }
        }
        let finalResult = results[0]; // Fallback para o primeiro resultado
        let bestMatchScore = -1;
        results.forEach(result => {
            let matchScore = 0;
            for (const trait in result.traits) {
                if (userScores.hasOwnProperty(trait)) {
                    matchScore += userScores[trait] * result.traits[trait];
                }
            }
            if (matchScore > bestMatchScore) {
                bestMatchScore = matchScore;
                finalResult = result;
            }
        });
        resultTitle.textContent = finalResult.name;
        resultImage.src = finalResult.image;
        resultDescription.textContent = finalResult.description;
        quizScreen.classList.remove('active');
        resultModal.style.display = 'flex'; // Exibe o modal
    }
    function restartQuiz() {
        currentQuestionIndex = 0;
        userScores = {
            extrovertido: 0,
            introvertido: 0,
            criativo: 0,
            analitico: 0,
            aventureiro: 0,
            lider: 0,
            organizado: 0
        };
        selectedOption = null;
        resultModal.style.display = 'none'; // Oculta o modal de resultado
        startScreen.classList.add('active'); // Volta para a tela inicial
        quizScreen.classList.remove('active'); // Garante que a tela do quiz esteja oculta
        nextQuestionBtn.style.display = 'block'; // Garante que o botão "Próxima" esteja visível para o novo quiz
        submitQuizBtn.style.display = 'none'; // Garante que o botão "Ver Resultado" esteja oculto
    }
    startQuizBtn.addEventListener('click', () => {
        startScreen.classList.remove('active');
        quizScreen.classList.add('active');
        renderQuestion(); // Começa a primeira pergunta
    });
    nextQuestionBtn.addEventListener('click', goToNextQuestion);
    submitQuizBtn.addEventListener('click', () => {
        if (selectedOption === null) {
            showMessage('Por favor, selecione uma opção antes de ver o resultado.');
            return;
        }
        // Acumula as pontuações da última opção selecionada
        for (const trait in selectedOption) {
            if (userScores.hasOwnProperty(trait)) {
                userScores[trait] += selectedOption[trait];
            }
        }
        showResult();
    });
    // Botão "Jogar Novamente" no modal de resultado
    restartQuizBtn.addEventListener('click', restartQuiz);
    // Botão "OK" do Modal de Mensagens
    closeMessageBoxBtn.addEventListener('click', hideMessage);
    // Fechar modal de mensagens ao clicar fora do conteúdo
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });
});
