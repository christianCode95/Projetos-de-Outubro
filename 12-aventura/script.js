document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const storyTextEl = document.getElementById('story-text');
    const choicesArea = document.getElementById('choices-area');
    const inventoryListEl = document.getElementById('inventory-list');
    const emptyInventoryMessage = document.getElementById
    ('empty-inventory-message');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const saveGameBtn = document.getElementById('save-game-btn');
    const loadGameBtn = document.getElementById('load-game-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    // --- Game Data: Story Nodes ---
    // Each node represents a point in the story with text, choices, and effects.
    // Effects can include adding/removing items, or checking for required items.
    const storyNodes = {
        'start': {
            text: "Você acorda em uma clareira na Floresta Sombria. O ar é frio e uma névoa densa cobre o chão. Você não se lembra de como chegou aqui. À sua frente, há um caminho estreito que leva mais fundo na floresta e, à sua direita, um riacho borbulhante.",
            choices: [
                { text: "Seguir o caminho estreito", nextNodeId: "path_forest" },
                { text: "Explorar o riacho", nextNodeId: "explore_stream" }
            ],
            effects: []
        },
        'path_forest': {
            text: "O caminho estreito está coberto de folhas secas. Você ouve um farfalhar nos arbustos. Parece haver algo brilhante no chão à frente.",
            choices: [
                { text: "Investigar o brilho", nextNodeId: "get_key" },
                { text: "Ignorar e continuar pelo caminho", nextNodeId: "deeper_forest" }
            ],
            effects: []
        },
        'get_key': {
            text: "Você se aproxima e encontra uma chave de ferro enferrujada. Parece antiga e pesada. Você a guarda.",
            choices: [
                { text: "Continuar pelo caminho", nextNodeId: "deeper_forest" }
            ],
            effects: [{ type: 'addItem', item: 'rusty_key' }]
        },
        'deeper_forest': {
            text: "Você segue mais fundo na floresta. A névoa se torna ainda mais densa. Você se depara com uma porta de madeira antiga e trancada, incrustada em uma rocha.",
            choices: [
                { text: "Tentar abrir a porta com a chave", nextNodeId: "try_door_with_key", requires: ['rusty_key'] },
                { text: "Procurar outro caminho", nextNodeId: "lost_in_forest" }
            ],
            effects: []
        },
        'try_door_with_key': {
            text: "Você insere a chave enferrujada na fechadura. Com um rangido alto, a porta se abre, revelando uma passagem escura e úmida. Você sente um ar fresco vindo de dentro.",
            choices: [
                { text: "Entrar na passagem", nextNodeId: "cave_entrance" }
            ],
            effects: [{ type: 'removeItem', item: 'rusty_key' }] // Key is used up
        },
        'try_door_without_key': {
            text: "Você tenta abrir a porta, mas ela está firmemente trancada. Não há maçaneta, apenas uma fechadura antiga. Você precisa de uma chave.",
            choices: [
                { text: "Voltar e procurar uma chave", nextNodeId: "path_forest" },
                { text: "Procurar outro caminho", nextNodeId: "lost_in_forest" }
            ],
            effects: []
        },
        'explore_stream': {
            text: "Você segue o riacho. A água é cristalina e fria. Você vê alguns peixes pequenos nadando. Mais adiante, o riacho se alarga e forma uma pequena lagoa. Você nota algo brilhando no fundo.",
            choices: [
                { text: "Tentar pegar o objeto brilhante", nextNodeId: "get_gem" },
                { text: "Voltar para a clareira", nextNodeId: "start" }
            ],
            effects: []
        },
        'get_gem': {
            text: "Você mergulha a mão na água gelada e consegue pegar uma gema cintilante. Ela irradia uma luz suave e quente. Você a guarda.",
            choices: [
                { text: "Voltar para a clareira", nextNodeId: "start" }
            ],
            effects: [{ type: 'addItem', item: 'shiny_gem' }]
        },
        'lost_in_forest': {
            text: "Você vagueia pela floresta, a névoa o desorienta. Horas se passam, e você percebe que está completamente perdido. O cansaço o domina e a escuridão se instala.",
            choices: [
                { text: "Fim de Jogo (Perdido)", nextNodeId: "game_over_lost" }
            ],
            effects: []
        },
        'cave_entrance': {
            text: "Você entra na passagem escura. O cheiro de terra úmida e mofo preenche o ar. Após alguns passos, você vê uma luz fraca no fim do túnel. Você emerge em uma caverna espaçosa, com cristais brilhantes e um altar antigo no centro.",
            choices: [
                { text: "Examinar o altar", nextNodeId: "examine_altar" },
                { text: "Tentar encontrar uma saída", nextNodeId: "cave_exit" }
            ],
            effects: []
        },
        'examine_altar': {
            text: "O altar é feito de pedra escura e tem entalhes estranhos. Há um pequeno recesso no centro, que parece feito para algo do tamanho de uma gema.",
            choices: [
                { text: "Colocar a gema no recesso", nextNodeId: "place_gem", requires: ['shiny_gem'] },
                { text: "Deixar o altar e procurar saída", nextNodeId: "cave_exit" }
            ],
            effects: []
        },
        'place_gem': {
            text: "Você coloca a gema cintilante no recesso do altar. Uma luz intensa irrompe da gema, iluminando toda a caverna. O chão treme e uma passagem secreta se abre atrás do altar, revelando um brilho dourado.",
            choices: [
                { text: "Entrar na passagem secreta", nextNodeId: "treasure_room" }
            ],
            effects: [{ type: 'removeItem', item: 'shiny_gem' }] // Gem is used up
        },
        'cave_exit': {
            text: "Você explora a caverna e encontra uma saída escondida que leva de volta à superfície, em um local seguro, fora da Floresta Sombria. Você escapou!",
            choices: [
                { text: "Fim de Jogo (Vitória!)", nextNodeId: "game_over_win" }
            ],
            effects: []
        },
        'treasure_room': {
            text: "Você entra na passagem secreta e se depara com uma sala cheia de tesouros! Moedas de ouro, joias e artefatos antigos brilham à luz da gema. Você encontrou a fortuna!",
            choices: [
                { text: "Fim de Jogo (Vitória e Fortuna!)", nextNodeId: "game_over_win_treasure" }
            ],
            effects: []
        },
        'game_over_lost': {
            text: "Fim de Jogo. Você se perdeu na Floresta Sombria e nunca mais foi visto.",
            choices: [],
            effects: []
        },
        'game_over_win': {
            text: "Fim de Jogo. Você escapou da Floresta Sombria! Uma sensação de alívio o preenche.",
            choices: [],
            effects: []
        },
        'game_over_win_treasure': {
            text: "Fim de Jogo. Você escapou da Floresta Sombria e se tornou incrivelmente rico! Sua aventura termina com glória!",
            choices: [],
            effects: []
        }
    };

    // --- Game Data: Items ---
    const items = {
        'rusty_key': 'Chave Enferrujada',
        'shiny_gem': 'Gema Cintilante'
    };

    // --- Game State Variables ---
    let currentStoryNodeId = 'start';
    let inventory = []; // Array of item IDs
    let gameActive = false; // To control if game is running

    // --- Helper Functions ---

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
     * Renders the current story node (text and choices).
     */
    function renderStoryNode() {
        const node = storyNodes[currentStoryNodeId];
        if (!node) {
            console.error("Nó da história não encontrado:", currentStoryNodeId);
            showMessage("Erro: Nó da história não encontrado. Reinicie o jogo.");
            return;
        }

        storyTextEl.textContent = node.text;
        choicesArea.innerHTML = ''; // Clear previous choices

        if (node.choices && node.choices.length > 0) {
            node.choices.forEach((choice, index) => {
                const choiceBtn = document.createElement('button');
                choiceBtn.classList.add('choice-btn');
                choiceBtn.textContent = choice.text;
                choiceBtn.dataset.choiceIndex = index;

                // Check if choice requires specific items
                let isDisabled = false;
                if (choice.requires && choice.requires.length > 0) {
                    const missingItems = choice.requires.filter(requiredItem => !inventory.includes(requiredItem));
                    if (missingItems.length > 0) {
                        isDisabled = true;
                        // Optionally, add a tooltip or change text to indicate missing items
                        choiceBtn.title = `Requer: ${missingItems.map(item => items[item] || item).join(', ')}`;
                    }
                }
                choiceBtn.disabled = isDisabled;

                choiceBtn.addEventListener('click', () => makeChoice(index));
                choicesArea.appendChild(choiceBtn);
            });
        } else {
            // No choices means it's an ending node
            const restartButton = document.createElement('button');
            restartButton.classList.add('action-button', 'primary');
            restartButton.textContent = 'Jogar Novamente';
            restartButton.addEventListener('click', restartGame);
            choicesArea.appendChild(restartButton);
            gameActive = false; // Game ends
        }
        
        // Apply effects if any
        if (node.effects && node.effects.length > 0) {
            node.effects.forEach(effect => {
                if (effect.type === 'addItem') {
                    addItem(effect.item);
                } else if (effect.type === 'removeItem') {
                    removeItem(effect.item);
                }
            });
        }
        updateInventoryDisplay(); // Always update inventory after node rendering
    }

    /**
     * Processes the player's choice and moves to the next story node.
     * @param {number} choiceIndex - The index of the chosen option.
     */
    function makeChoice(choiceIndex) {
        if (!gameActive) return;

        const node = storyNodes[currentStoryNodeId];
        if (!node || !node.choices || !node.choices[choiceIndex]) {
            console.error("Escolha inválida.");
            return;
        }

        const chosen = node.choices[choiceIndex];

        // Re-check requirements before making choice (in case state changed externally)
        if (chosen.requires && chosen.requires.length > 0) {
            const missingItems = chosen.requires.filter(requiredItem => !inventory.includes(requiredItem));
            if (missingItems.length > 0) {
                showMessage(`Você não tem os itens necessários para esta escolha: ${missingItems.map(item => items[item] || item).join(', ')}`);
                return; // Prevent choice if requirements are not met
            }
        }

        currentStoryNodeId = chosen.nextNodeId;
        renderStoryNode();
        saveGame(); // Save game state after each choice
    }

    /**
     * Adds an item to the player's inventory.
     * @param {string} itemId - The ID of the item to add.
     */
    function addItem(itemId) {
        if (!inventory.includes(itemId)) {
            inventory.push(itemId);
            showMessage(`Você encontrou: ${items[itemId] || itemId}!`);
            updateInventoryDisplay();
        }
    }

    /**
     * Removes an item from the player's inventory.
     * @param {string} itemId - The ID of the item to remove.
     */
    function removeItem(itemId) {
        const index = inventory.indexOf(itemId);
        if (index > -1) {
            inventory.splice(index, 1);
            showMessage(`Você usou: ${items[itemId] || itemId}.`);
            updateInventoryDisplay();
        }
    }

    /**
     * Updates the inventory display in the UI.
     */
    function updateInventoryDisplay() {
        inventoryListEl.innerHTML = ''; // Clear existing items
        if (inventory.length === 0) {
            emptyInventoryMessage.style.display = 'block';
        } else {
            emptyInventoryMessage.style.display = 'none';
            inventory.forEach(itemId => {
                const itemEl = document.createElement('li');
                itemEl.classList.add('inventory-item');
                itemEl.textContent = items[itemId] || itemId; // Display readable name or ID
                inventoryListEl.appendChild(itemEl);
            });
        }
    }

    /**
     * Saves the current game state to localStorage.
     */
    function saveGame() {
        const gameState = {
            currentStoryNodeId: currentStoryNodeId,
            inventory: inventory
        };
        localStorage.setItem('textAdventureSave', JSON.stringify(gameState));
        showMessage('Jogo salvo com sucesso!');
    }

    /**
     * Loads the game state from localStorage.
     */
    function loadGame() {
        const savedState = localStorage.getItem('textAdventureSave');
        if (savedState) {
            if (confirm('Tem certeza que deseja carregar o jogo salvo? O progresso atual será perdido.')) {
                const gameState = JSON.parse(savedState);
                currentStoryNodeId = gameState.currentStoryNodeId;
                inventory = gameState.inventory;
                gameActive = true; // Resume game
                renderStoryNode();
                updateInventoryDisplay();
                showMessage('Jogo carregado com sucesso!');
            }
        } else {
            showMessage('Nenhum jogo salvo encontrado.');
        }
    }

    /**
     * Resets the game to its initial state.
     */
    function restartGame() {
        if (confirm('Tem certeza que deseja reiniciar o jogo? Todo o progresso será perdido.')) {
            currentStoryNodeId = 'start';
            inventory = [];
            gameActive = true; // Start game
            renderStoryNode();
            updateInventoryDisplay();
            showMessage('Jogo reiniciado!');
        }
    }

    // --- Event Listeners ---
    restartGameBtn.addEventListener('click', restartGame);
    saveGameBtn.addEventListener('click', saveGame);
    loadGameBtn.addEventListener('click', loadGame);
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    // --- Initialization ---
    // Try to load game on start, otherwise start new game
    const initialLoad = localStorage.getItem('textAdventureSave');
    if (initialLoad) {
        loadGame(); // Attempt to load without confirmation first, then confirm if user wants to play
    } else {
        restartGame(); // Start a new game if no save exists
    }
});
