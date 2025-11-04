document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startGameBtn = document.getElementById('start-game-btn');
    const suspectsList = document.getElementById('suspects-list');
    const cluesList = document.getElementById('clues-list');
    const emptyCluesMessage = cluesList.querySelector('.empty-message');
    const deductionSuspectSelect = document.getElementById
    ('deduction-suspect-select');
    const submitDeductionBtn = document.getElementById
    ('submit-deduction-btn');
    const interrogationModal = document.getElementById
    ('interrogation-modal');
    const interrogationSuspectName = document.getElementById
    ('interrogation-suspect-name');
    const questionListDiv = document.getElementById('question-list');
    const closeInterrogationModalBtn = interrogationModal.querySelector
    ('.close-button');
    const resultModal = document.getElementById('result-modal');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const playAgainBtn = document.getElementById('play-again-btn');
    // Elementos da nova caixa de mensagem personalizada
    const customMessageBox = document.getElementById('custom-message-box');
    const customMessageText = document.getElementById('custom-message-text');
    const customMessageOkBtn = document.getElementById
    ('custom-message-ok-btn');
    // --- Game Data (The Case) ---
    const caseData = {
        solution: 'sophia', // O culpado real (CORRIGIDO: agora 'sophia' em minúsculas para corresponder ao ID)
        suspects: [
            {
                id: 'john',
                name: 'John, o Mordomo',
                questions: [
                    {
                        id: 'q1_john',
                        text: 'Onde você estava na noite do roubo?',
clue: 'John: "Eu estava polindo a prataria na cozinha, como de costume. 
Tenho um álibi perfeito."',
                        collected: false
                    },
                    {
                        id: 'q2_john',
                        text: 'Você viu alguém suspeito?',
 clue: 'John: "Notei uma sombra estranha perto da janela da sala de estar, 
 mas achei que era apenas um gato."',
                        collected: false
                        // This might be a misleading clue
                    }
                ]
            },
            {
                id: 'sophia',
                name: 'Sophia, a Jardineira',
                questions: [
                    {
                        id: 'q1_sophia',
                        text: 'Qual era a sua atividade durante o roubo?',
clue: 'Sophia: "Eu estava regando as orquídeas na estufa. 
Adoro o silêncio da noite."',
                        collected: false
                    },
                    {
                        id: 'q2_sophia',
                        text: 'Você tem algo a declarar sobre o diamante?',
 clue: 'Sophia: "O Sr. Montgomery me devia dinheiro. 
                    Eu estava com raiva, mas não roubaria. 
                    Vi uma luva preta no jardim."',
                        collected: false
                        // This is a crucial clue!
                    }
                ]
            },
            {
                id: 'mr_smith',
                name: 'Sr. Smith, o Colecionador',
                questions: [
                    {
                        id: 'q1_smith',
                        text: 'Você esteve na mansão hoje?',
 clue: 'Sr. Smith: "Sim, visitei o Sr. Montgomery mais cedo para 
 discutir a compra de uma peça de arte, mas fui embora antes do 
anoitecer."',
                        collected: false
                    },
                    {
                        id: 'q2_smith',
            text: 'Você tem algum interesse particular em diamantes?',
clue: 'Sr. Smith: "Sou um colecionador, claro, mas diamantes não 
são minha especialidade. Minha paixão são as esculturas antigas."',
                        collected: false
                    }
                ]
            }
        ],
        cluesCollected: [] // Stores IDs of collected clues
    };
    let currentSuspectId = null; // ID of the suspect currently being interrogated
    /**
     * @param {string} message - A mensagem a ser exibida.
     */
    function showMessage(message) {
        console.log("Exibindo mensagem personalizada:", message); // LOG DE DEBUG
        customMessageText.textContent = message;
        customMessageBox.style.display = 'flex';
    }
    function hideMessage() {
        console.log("Ocultando mensagem personalizada."); // LOG DE DEBUG
        customMessageBox.style.display = 'none';
    }
    function initializeGame() {
        // Reset game data
        caseData.cluesCollected = [];
        caseData.suspects.forEach(suspect => {
            suspect.questions.forEach(q => q.collected = false);
        });
        currentSuspectId = null;// Render suspects
        renderSuspects();// Render empty clues list
        renderClues();// Populate deduction select
        populateDeductionSelect(); // Show start screen
        startScreen.classList.add('active');
        gameScreen.classList.remove('active');
        resultModal.style.display = 'none';
        interrogationModal.style.display = 'none';
        customMessageBox.style.display = 'none'; // Ensure custom message box is hidden
    }
    function renderSuspects() {
        suspectsList.innerHTML = '';
        caseData.suspects.forEach(suspect => {
            const li = document.createElement('li');
            li.classList.add('suspect-item');
            li.textContent = suspect.name;
            li.dataset.suspectId = suspect.id;
            li.addEventListener('click', () => 
                startInterrogation(suspect.id));
            suspectsList.appendChild(li);
        });
    }
    function renderClues() {
        cluesList.innerHTML = '';
        if (caseData.cluesCollected.length === 0) {
            emptyCluesMessage.style.display = 'block';
        } else {
            emptyCluesMessage.style.display = 'none';
            caseData.cluesCollected.forEach(clueId => {
                // Find the clue text from the original data
                let clueText = '';
                for (const suspect of caseData.suspects) {
const foundClue = suspect.questions.find(q => q.id === clueId);
                    if (foundClue) {
                        clueText = foundClue.clue;
                        break;
                    }
                }
                const li = document.createElement('li');
                li.classList.add('clue-item');
                li.textContent = clueText;
                cluesList.appendChild(li);
            });
        }
    }
    function populateDeductionSelect() {
        deductionSuspectSelect.innerHTML = 
        '<option value="">Selecione o Ladrão</option>';
        caseData.suspects.forEach(suspect => {
            const option = document.createElement('option');
            option.value = suspect.id;
            option.textContent = suspect.name;
            deductionSuspectSelect.appendChild(option);
        });
    }
    /**
     * @param {string} suspectId - The ID of the suspect to interrogate.
     */
    function startInterrogation(suspectId) {
        currentSuspectId = suspectId;
        const suspect = caseData.suspects.find(s => s.id === suspectId);
        if (!suspect) return;
        interrogationSuspectName.textContent = 
        `Interrogando: ${suspect.name}`;
        questionListDiv.innerHTML = '';
        suspect.questions.forEach(question => {
            const button = document.createElement('button');
            button.classList.add('question-button');
            button.textContent = question.text;
            button.dataset.questionId = question.id;
            button.disabled = question.collected; // Disable if already asked
            button.addEventListener('click', () => 
                askQuestion(question.id));
            questionListDiv.appendChild(button);
        });
        interrogationModal.style.display = 'flex';
    }
    /**
     * @param {string} questionId - The ID of the question asked.
     */
    function askQuestion(questionId) {
        const suspect = caseData.suspects.find(s => s.id === 
            currentSuspectId);
        if (!suspect) return;
        const question = suspect.questions.find(q => q.id === questionId);
        if (!question || question.collected) return;
        question.collected = true; // Mark question as collected
        caseData.cluesCollected.push(question.id); // Add clue to collected list
        renderClues(); // Update clues list in UI
        startInterrogation(currentSuspectId); // Re-render questions to disable the asked one
    }
    function submitDeduction() {
        console.log("Botão de dedução clicado!"); // LOG DE DEBUG
        const selectedSuspectId = deductionSuspectSelect.value;
        console.log("ID do Suspeito Selecionado:", selectedSuspectId); // LOG DE DEBUG
        console.log("Solução do Caso:", caseData.solution); // LOG DE DEBUG
        if (!selectedSuspectId) {
            showMessage
            ('Por favor, selecione um suspeito antes de deduzir!');
            return;
        }
        if (selectedSuspectId === caseData.solution) {
            console.log("Dedução: Correta!"); // LOG DE DEBUG
            showResult
('Vitória!', 'Parabéns, detetive! Você desvendou o caso e pegou o ladrão!');
            resultModal.classList.add('win');
            resultModal.classList.remove('lose');
        } else {
            console.log("Dedução: Incorreta!"); // LOG DE DEBUG
            const correctSuspect = caseData.suspects.find(s => 
                s.id === caseData.solution);
            showResult
('Derrota!', `Que pena, detetive! Você errou. 
    O verdadeiro ladrão era ${correctSuspect.name}.`);
            resultModal.classList.add('lose');
            resultModal.classList.remove('win');
        }
        console.log("Definindo display do resultModal para flex."); // LOG DE DEBUG
        resultModal.style.display = 'flex';
    }
    /**
     * @param {string} title - Title of the result (e.g., "Victory!").
     * @param {string} message - Message explaining the result.
     */
    function showResult(title, message) {
        resultTitle.textContent = title;
        resultMessage.textContent = message;
    }// --- Event Listeners ---
    startGameBtn.addEventListener('click', () => {
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
    });
    submitDeductionBtn.addEventListener('click', submitDeduction);
    closeInterrogationModalBtn.addEventListener('click', () => {
        interrogationModal.style.display = 'none';
    });
    playAgainBtn.addEventListener('click', initializeGame);
    interrogationModal.addEventListener('click', (e) => {
        if (e.target === interrogationModal) {
            interrogationModal.style.display = 'none';
        }
    });
    resultModal.addEventListener('click', (e) => {
        if (e.target === resultModal) {
            resultModal.style.display = 'none';
        }
    });// Event listeners para a nova caixa de mensagem
    customMessageOkBtn.addEventListener('click', hideMessage);
    customMessageBox.addEventListener('click', (e) => {
        if (e.target === customMessageBox) {
            hideMessage();
        }
    });// --- Initialization ---
    initializeGame();
});
