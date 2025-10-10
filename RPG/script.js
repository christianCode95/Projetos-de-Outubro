document.addEventListener('DOMContentLoaded', () => {// --- DOM Elements ---
    const playerNameEl = document.getElementById('player-name');
    const playerHealthBar = document.getElementById('player-health-bar');
    const playerHealthText = document.getElementById('player-health-text');
    const playerImage = document.getElementById('player-image');
const playerAbilitiesContainer = document.getElementById('player-abilities');
    const monsterNameEl = document.getElementById('monster-name');
    const monsterHealthBar = document.getElementById('monster-health-bar');
const monsterHealthText = document.getElementById('monster-health-text');
    const monsterImage = document.getElementById('monster-image');
    const combatLogEl = document.getElementById('combat-log');
    const gameOverModal = document.getElementById('game-over-modal');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverMessage = document.getElementById('game-over-message');
    const restartGameBtn = document.getElementById('restart-game-btn');// --- Game State Variables ---
    let player = {};
    let monster = {};
    let currentTurn = 'player'; // 'player' or 'monster'
    let gameEnded = false;
    // --- Character Definitions ---
    const playerBase = {
        name: 'Sir Galahad',
        maxHp: 100,
        currentHp: 100,
        attack: 15,
        defense: 5,
        abilities: [
            { name: 'Espadada', damage: 20, effect: null, 
                description: 'Um golpe forte de espada.' },
            { name: 'Escudo Protetor', damage: 0, 
effect: 'defense_boost', description: 'Aumenta sua defesa por 1 turno.' },
            { name: 'Ataque Rápido', damage: 10, 
effect: 'double_attack', description: 'Causa dano menor duas vezes.' }
        ],
        effects: {
            defense_boost: 0 // Counter for defense boost turns
        }
    };
    const monsterBase = {
        name: 'Goblin Bruto',
        maxHp: 80,
        currentHp: 80,
        attack: 12,
        defense: 3,
        abilities: [
            { name: 'Clava Pesada', damage: 18, effect: null },
    { name: 'Grito Ameaçador', damage: 0, effect: 'weaken_player' }
        ],
        effects: {
            weaken_player: 0 // Counter for player weaken turns
        }
    };// --- Helper Functions ---
    /**
     * Initializes or resets the game state.
     */
    function initializeGame() {
        player = JSON.parse(JSON.stringify(playerBase)); // Deep copy to reset
        monster = JSON.parse(JSON.stringify(monsterBase)); // Deep copy to reset
        currentTurn = 'player';
        gameEnded = false;
        combatLogEl.innerHTML = ''; // Clear combat log
        gameOverModal.style.display = 'none'; // Hide game over modal
        updateUI();
        addLogMessage('A batalha começou!', 'game-event');
        enablePlayerAbilities(true);
    }
    function updateUI() {// Player UI
        playerNameEl.textContent = player.name;
playerHealthBar.style.width = `${(player.currentHp / player.maxHp) * 100}%`;
playerHealthText.textContent = `${player.currentHp}/${player.maxHp} HP`;
        playerHealthBar.style.backgroundColor = 
        getHealthColor(player.currentHp, player.maxHp);
        // Monster UI
        monsterNameEl.textContent = monster.name;
monsterHealthBar.style.width =
 `${(monster.currentHp / monster.maxHp) * 100}%`;
monsterHealthText.textContent = `${monster.currentHp}/${monster.maxHp} HP`;
        monsterHealthBar.style.backgroundColor = 
        getHealthColor(monster.currentHp, monster.maxHp);
    }
    /**
     * Gets a color for the health bar based on percentage.
     * @param {number} currentHp - Current health points.
     * @param {number} maxHp - Maximum health points.
     * @returns {string} CSS color string.
     */
    function getHealthColor(currentHp, maxHp) {
        const percentage = (currentHp / maxHp) * 100;
        if (percentage > 50) return '#2ecc71'; // Green
        if (percentage > 20) return '#f1c40f'; // Yellow
        return '#e74c3c'; // Red
    }
    /**
     * Adds a message to the combat log.
     * @param {string} message - The message to add.
     * @param {string} type - 'player-turn', 'monster-turn', 'game-event'.
     */
    function addLogMessage(message, type) {
        const logEntry = document.createElement('p');
        logEntry.classList.add('log-message', type);
        logEntry.textContent = message;
        combatLogEl.appendChild(logEntry);
        combatLogEl.scrollTop = combatLogEl.scrollHeight; // Scroll to bottom
    }
    /**
     * @param {boolean} enable - True to enable, false to disable.
     */
    function enablePlayerAbilities(enable) {
playerAbilitiesContainer.querySelectorAll
('.ability-button').forEach(button => {
            button.disabled = !enable;
        });
    }
    /**
     * @returns {boolean} True if the game has ended, false otherwise.
     */
    function checkGameEnd() {
        if (player.currentHp <= 0) {
            player.currentHp = 0; // Cap at 0
            updateUI();
            endGame('Derrota!', 'Você foi derrotado pelo monstro!');
            return true;
        }
        if (monster.currentHp <= 0) {
            monster.currentHp = 0; // Cap at 0
            updateUI();
            endGame('Vitória!', 'Você derrotou o monstro!');
            return true;
        }
        return false;
    }
    /**
     * @param {string} title - The title for the game over modal.
     * @param {string} message - The message for the game over modal.
     */
    function endGame(title, message) {
        gameEnded = true;
        enablePlayerAbilities(false); // Disable all buttons
        gameOverTitle.textContent = title;
        gameOverMessage.textContent = message;
        gameOverModal.style.display = 'flex'; // Show modal
    }
    /**
     * @param {Object} ability - The ability object used by the player.
     */
    async function playerAttack(ability) {
        if (currentTurn !== 'player' || gameEnded) return;
        enablePlayerAbilities(false); // Disable buttons during turn
addLogMessage(`${player.name} usou ${ability.name}!`, 'player-turn');
        let damageDealt = ability.damage;
        let actualDamage = Math.max(0, damageDealt - monster.defense); // Damage reduction by monster defense
        if (ability.effect === 'defense_boost') {
            player.effects.defense_boost = 2; // Boost for 2 turns (current + next)
addLogMessage(`${player.name} aumentou sua defesa!`, 'player-turn');
            actualDamage = 0; // No damage from this ability
        } else if (ability.effect === 'double_attack') {
            // First hit
            monster.currentHp -= actualDamage;
addLogMessage
(`${player.name} causou ${actualDamage} de dano.`, 'player-turn');
            updateUI();
            if (checkGameEnd()) return;
            await new Promise(resolve => setTimeout(resolve, 700)); // Small delay for visual effect

            // Second hit
            addLogMessage(`${player.name} atacou novamente!`, 'player-turn');
            actualDamage = Math.max(0, ability.damage - monster.defense);
            monster.currentHp -= actualDamage;
            addLogMessage(`${player.name} causou ${actualDamage} de dano.`, 'player-turn');
        } else {
            // Normal attack
            monster.currentHp -= actualDamage;
            addLogMessage(`${player.name} causou ${actualDamage} de dano.`, 'player-turn');
        }

        updateUI();
        if (checkGameEnd()) return;

        // Apply effects before monster's turn
        applyEffects();

        // Pass turn to monster after a short delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        currentTurn = 'monster';
        monsterTurn();
    }

    /**
     * Handles monster's attack.
     */
    async function monsterTurn() {
        if (gameEnded) return;

        addLogMessage(`${monster.name}'s turn!`, 'monster-turn');
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Monster chooses a random ability
        const randomAbility = 
        monster.abilities[Math.floor(Math.random() * monster.abilities.length)];
        addLogMessage(`${monster.name} usou ${randomAbility.name}!`, 'monster-turn');
        let damageDealt = randomAbility.damage;
        let actualDamage = Math.max(0, damageDealt - player.defense); // Damage reduction by player defense
        if (player.effects.defense_boost > 0) {
            // Reduce damage if player has defense boost
            const boostedDamage = Math.floor(actualDamage * 0.5); // Example: 50% less damage
            addLogMessage(`O ${player.name} 
                defendeu parte do ataque! (-${actualDamage - boostedDamage} de dano)`
                , 'player-turn');
            actualDamage = boostedDamage;
        }
        if (randomAbility.effect === 'weaken_player') {
            player.effects.weaken_player = 2; // Weaken for 2 turns
            addLogMessage(`${monster.name} enfraqueceu o ${player.name}!`, 'monster-turn');
            actualDamage = 0; // No damage from this ability
        } else {
            // Normal monster attack
            player.currentHp -= actualDamage;
            addLogMessage(`${monster.name} causou ${actualDamage} de dano.`, 'monster-turn');
        }

        updateUI();
        if (checkGameEnd()) return;

        // Apply effects after monster's turn
        applyEffects();

        // Pass turn back to player after a short delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        currentTurn = 'player';
        enablePlayerAbilities(true); // Re-enable player buttons
    }

    /**
     * Applies and manages ongoing effects for both player and monster.
     */
    function applyEffects() {
        // Player effects
        if (player.effects.defense_boost > 0) {
            player.effects.defense_boost--;
            if (player.effects.defense_boost === 0) {
                addLogMessage(`${player.name}'s defesa voltou ao normal.`, 'game-event');
            }
        }
        if (player.effects.weaken_player > 0) {
            player.effects.weaken_player--;
            if (player.effects.weaken_player === 0) {
                addLogMessage(`${player.name} não está mais enfraquecido.`, 'game-event');
            }
        }
        // Monster effects (if any would be here)
    }

    // --- Event Listeners ---

    // Generate player ability buttons
    playerBase.abilities.forEach(ability => {
        const button = document.createElement('button');
        button.classList.add('ability-button');
        button.textContent = ability.name;
        button.title = ability.description; // Add description as tooltip
        button.addEventListener('click', () => playerAttack(ability));
        playerAbilitiesContainer.appendChild(button);
    });

    restartGameBtn.addEventListener('click', initializeGame);

    // --- Initialization ---
    initializeGame();
});