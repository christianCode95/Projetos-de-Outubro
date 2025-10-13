document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const currentLevelEl = document.getElementById('current-level');
    const currentMoneyEl = document.getElementById('current-money');
    const questionTextEl = document.getElementById('question-text');
    const optionsArea = document.getElementById('options-area');
    const optionButtons = document.querySelectorAll('.option-btn');
    const startGameBtn = document.getElementById('start-game-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');
    // --- Game Data ---
    const questions = [
        // Nível 1 (Fácil) - R$ 1.000
        {
            question: "Qual é a capital do Brasil?",
            options: ["Rio de Janeiro", "Brasília", "São Paulo", "Salvador"],
            correctAnswer: "Brasília",
            level: 1,
            moneyValue: 1000
        },
        {
            question: "Quantos dias tem uma semana?",
            options: ["5", "6", "7", "8"],
            correctAnswer: "7",
            level: 1,
            moneyValue: 2000
        },
        {
            question: "Qual animal é conhecido como o 'Rei da Selva'?",
            options: ["Tigre", "Leão", "Elefante", "Gorila"],
            correctAnswer: "Leão",
            level: 1,
            moneyValue: 3000
        },
        // Nível 2 (Médio) - R$ 5.000
        {
            question: "Qual é o maior oceano do mundo?",
            options: ["Oceano Atlântico", "Oceano Índico", 
                "Oceano Pacífico", "Oceano Ártico"],
            correctAnswer: "Oceano Pacífico",
            level: 2,
            moneyValue: 5000
        },
        {
            question: "Quem pintou a Mona Lisa?",
            options: ["Vincent van Gogh", "Pablo Picasso", 
                "Leonardo da Vinci", "Claude Monet"],
            correctAnswer: "Leonardo da Vinci",
            level: 2,
            moneyValue: 10000
        },
        {
            question: "Qual o nome da montanha mais alta do mundo?",
            options: ["K2", "Monte Everest", "Monte Fuji", "Kilimanjaro"],
            correctAnswer: "Monte Everest",
            level: 2,
            moneyValue: 15000
        },
        // Nível 3 (Difícil) - R$ 25.000
        {
            question: "Qual é o elemento químico com o símbolo 'Fe'?",
            options: ["Flúor", "Ferro", "Fósforo", "Frâncio"],
            correctAnswer: "Ferro",
            level: 3,
            moneyValue: 25000
        },
        {
            question: "Em que ano a Segunda Guerra Mundial terminou?",
            options: ["1942", "1945", "1950", "1939"],
            correctAnswer: "1945",
            level: 3,
            moneyValue: 50000
        },
        {
            question: "Qual país tem a maior população do mundo?",
            options: ["Índia", "Estados Unidos", "China", "Indonésia"],
            correctAnswer: "China",
            level: 3,
            moneyValue: 75000
        },
        // Nível 4 (Muito Difícil) - R$ 100.000
        {
            question: "Qual é a capital da Austrália?",
            options: ["Sydney", "Melbourne", "Canberra", "Perth"],
            correctAnswer: "Canberra",
            level: 4,
            moneyValue: 100000
        },
        {
            question: "Qual é o menor país do mundo?",
            options: ["Mônaco", "Nauru", "Vaticano", "San Marino"],
            correctAnswer: "Vaticano",
            level: 4,
            moneyValue: 250000
        },
        {
            question: "Quem escreveu 'Dom Quixote'?",
            options: ["William Shakespeare", 
                "Miguel de Cervantes", "Gabriel García Márquez", 
                "Machado de Assis"],
            correctAnswer: "Miguel de Cervantes",
            level: 4,
            moneyValue: 500000
        },
        // Nível 5 (Milionário!) - R$ 1.000.000
        {
question: "Qual é a velocidade da luz no vácuo (aproximadamente)?", 
options: ["300.000 km/s", "150.000 km/s", 
                "500.000 km/s", "1.000.000 km/s"],
            correctAnswer: "300.000 km/s",
            level: 5,
            moneyValue: 1000000
        }
    ];

    // --- Game State Variables ---
    let currentLevel = 1;
    let currentMoney = 0;
    let currentQuestionIndex = 0;
    let shuffledQuestions = [];
    let gameActive = false; // To control if game is running

    /**
     * Displays a message box with a given message.
     * @param {string} message - The message to display.
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }
    /**
     * Hides the message box.
     */
    function hideMessage() {
        messageBox.style.display = 'none';
    }

    /**
     * Shuffles an array using the Fisher-Yates algorithm.
     * @param {Array} array - The array to shuffle.
     * @returns {Array} The shuffled array.
     */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    /**
     * Filters questions by the current level and shuffles them.
     */
    function prepareQuestionsForLevel() {
        const levelQuestions = questions.filter
        (q => q.level === currentLevel);
        shuffledQuestions = shuffleArray(levelQuestions);
        currentQuestionIndex = 0; // Reset index for the new set of questions
    }

    /**
     * Updates the game info display (level and money).
     */
    function updateGameInfo() {
        currentLevelEl.textContent = currentLevel;
        currentMoneyEl.textContent = `R$ 
        ${currentMoney.toLocaleString('pt-BR')}`;
    }

    /**
     * Displays the current question and its options.
     */
    function displayQuestion() {
        if (currentQuestionIndex < shuffledQuestions.length) {
            const question = shuffledQuestions[currentQuestionIndex];
            questionTextEl.textContent = question.question;

            // Shuffle options for each question
            const shuffledOptions = shuffleArray([...question.options]);

            optionButtons.forEach((button, index) => {
                button.textContent = shuffledOptions[index];
                button.classList.remove('correct', 'incorrect'); // Clear previous feedback
                button.disabled = false; // Enable buttons
            });
        } else {
            // No more questions for this level, advance to next or win
            advanceLevel();
        }
    }

    /**
     * Handles the user's answer selection.
     * @param {string} selectedAnswer - The text of the selected answer.
     */
    function checkAnswer(selectedAnswer) {if (!gameActive) return; // Prevent interaction if game is not active

        const currentQuestion = shuffledQuestions[currentQuestionIndex];
        const isCorrect = (selectedAnswer === 
            currentQuestion.correctAnswer);
        // Disable all buttons to prevent multiple clicks
        optionButtons.forEach(button => button.disabled = true);

        // Provide visual feedback
        optionButtons.forEach(button => {
            if (button.textContent === currentQuestion.correctAnswer) {
                button.classList.add('correct');
            } else if (button.textContent === selectedAnswer) {
                button.classList.add('incorrect');
            }
        });
        setTimeout(() => {
            if (isCorrect) {
                currentMoney += currentQuestion.moneyValue;
                updateGameInfo();
                showMessage(`Correto! Você ganhou R$ 
                    ${currentQuestion.moneyValue.toLocaleString('pt-BR')}!`);
                currentQuestionIndex++;
            } else {
                showMessage(`Incorreto! A resposta correta era "
                    ${currentQuestion.correctAnswer}
                    ". Fim de Jogo! Você terminou com R$ 
                    ${currentMoney.toLocaleString('pt-BR')}.`);
                endGame();
                return; // Stop further execution if game ended
            }

            // After showing message, proceed to next question/level
            setTimeout(() => {
                hideMessage();
                if (gameActive) { // Check if game is still active after message
                    displayQuestion(); // Display next question or trigger level advance
                }
            }, 2000); // Wait 2 seconds before hiding message and proceeding

        }, 1500); // Wait for animation to play
    }

    /**
     * Advances the game to the next level or declares victory.
     */
    function advanceLevel() {
        currentLevel++;
        if (currentLevel > 5) { // Assuming 5 levels for the game
            showMessage
            (`Parabéns! Você se tornou um milionário! Você ganhou R$ 
                ${currentMoney.toLocaleString('pt-BR')}!`);
            endGame();
        } else {
            showMessage(`Parabéns! Avançando para o Nível 
                ${currentLevel}!`);
            prepareQuestionsForLevel(); // Get new questions for the next level
            updateGameInfo();
            setTimeout(() => {
                hideMessage();
                displayQuestion();
            }, 2000);
        }
    }

    /**
     * Ends the game, disabling options and updating button text.
     */
    function endGame() {
        gameActive = false;
        optionButtons.forEach(button => button.disabled = true);
        startGameBtn.textContent = 'Reiniciar Jogo';
        startGameBtn.classList.add('primary'); // Ensure it's primary if it was secondary
        showMessage(`Fim de Jogo! Você terminou com R$ 
            ${currentMoney.toLocaleString('pt-BR')}.`);
    }

    /**
     * Initializes or resets the game state.
     */
    function startGame() {
        currentLevel = 1;
        currentMoney = 0;
        currentQuestionIndex = 0;
        gameActive = true;
        
        updateGameInfo();
        prepareQuestionsForLevel(); // Prepare questions for level 1
        displayQuestion(); // Display the first question

        startGameBtn.textContent = 'Reiniciar Jogo';
        startGameBtn.classList.add('primary'); // Ensure it's primary
        
        // Enable buttons at the start of the game
        optionButtons.forEach(button => {
            button.classList.remove('correct', 'incorrect');
            button.disabled = false;
        });
        hideMessage(); // Hide any previous messages
    }

    // --- Event Listeners ---
    startGameBtn.addEventListener('click', startGame);

    optionButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            checkAnswer(e.target.textContent);
        });
    });

    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    // Initial setup when the page loads
    updateGameInfo(); // Display initial level and money
    optionButtons.forEach(button => button.disabled = true); // Disable options until game starts
});
