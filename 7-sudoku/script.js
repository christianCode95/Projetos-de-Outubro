document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const sudokuBoard = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const resetGameBtn = document.getElementById('reset-game-btn');
    const checkBoardBtn = document.getElementById('check-board-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');
    // --- Puzzles 4x4 Pré-definidos ---
    // Use 0 para células vazias
    const puzzles = [
        [
            [0, 0, 4, 0],
            [3, 0, 0, 1],
            [0, 1, 0, 0],
            [0, 4, 0, 2]
        ],
        [
            [1, 0, 0, 4],
            [0, 4, 1, 0],
            [0, 2, 3, 0],
            [4, 0, 0, 1]
        ],
        [
            [0, 2, 0, 0],
            [0, 0, 4, 0],
            [4, 0, 0, 2],
            [0, 1, 0, 0]
        ],
        [
            [0, 0, 0, 1],
            [2, 0, 0, 0],
            [0, 0, 0, 3],
            [4, 0, 0, 0]
        ]
    ];
    // --- Estado do Jogo ---
    let currentPuzzle = []; // O estado atual do puzzle, incluindo entradas do usuário
    let initialPuzzle = []; // O puzzle original (células fixas)
    let selectedCell = null; // A célula atualmente focada (para highlight)
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
    /**
     * @param {Array<Array<number>>} puzzleData - Os dados do puzzle a serem carregados.
     */
    function initializeGame(puzzleData) {
        sudokuBoard.innerHTML = ''; // Limpa o tabuleiro existente
        initialPuzzle = JSON.parse(JSON.stringify(puzzleData)); // Copia o puzzle inicial
        currentPuzzle = JSON.parse(JSON.stringify(puzzleData)); // Copia para o estado atual
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const cell = document.createElement('div');
                cell.classList.add('sudoku-cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '1';
                input.max = '4';
                input.maxLength = '1'; // Permite apenas 1 dígito
 input.value = currentPuzzle[r][c] !== 0 ? currentPuzzle[r][c] : '';
                if (initialPuzzle[r][c] !== 0) {
                    input.readOnly = true; // Células fixas não são editáveis
                    cell.classList.add('fixed');
                } else {
                    input.addEventListener('input', handleCellInput);
                    input.addEventListener('focus', handleCellFocus);
                    input.addEventListener('blur', handleCellBlur);
                }
                cell.appendChild(input);
                sudokuBoard.appendChild(cell);
            }
        }
        validateBoard(false); // Valida o tabuleiro inicial sem mostrar mensagens
    }
    /**
     * Manipula a entrada do usuário em uma célula do Sudoku.
     * @param {Event} e - O evento de entrada.
     */
    function handleCellInput(e) {
        const input = e.target;
        const row = parseInt(input.closest('.sudoku-cell').dataset.row);
        const col = parseInt(input.closest('.sudoku-cell').dataset.col);
        let value = parseInt(input.value);// Garante que o valor esteja entre 1 e 4
        if (isNaN(value) || value < 1 || value > 4) {
            input.value = '';
            value = 0;
        }
        currentPuzzle[row][col] = value;
        validateBoard(false); // Valida dinamicamente sem mostrar mensagens
    }
    /**
     * Manipula o foco em uma célula do Sudoku para destaque.
     * @param {Event} e - O evento de foco.
     */
    function handleCellFocus(e) {
        if (selectedCell) {
            selectedCell.classList.remove('highlighted');
        }
        selectedCell = e.target.closest('.sudoku-cell');
        selectedCell.classList.add('highlighted');
    }
    /**
     * Manipula a perda de foco de uma célula do Sudoku para remover destaque.
     * @param {Event} e - O evento de perda de foco.
     */
    function handleCellBlur(e) {
        if (selectedCell) {
            selectedCell.classList.remove('highlighted');
            selectedCell = null;
        }
    }
    /**
     * Valida o tabuleiro do Sudoku para verificar regras.
     * @param {boolean} showMessages - Se deve exibir mensagens de sucesso/erro.
     * @returns {boolean} True se o tabuleiro for válido, false caso contrário.
     */
    function validateBoard(showMessages) {
        let isValid = true;
        const cells = sudokuBoard.querySelectorAll('.sudoku-cell');
        // Remove todas as classes 'invalid' antes de revalidar
        cells.forEach(cell => cell.classList.remove('invalid'));

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const value = currentPuzzle[r][c];
                const cellEl = cells[r * 4 + c];
                if (value === 0) continue; // Ignora células vazias para validação de duplicatas
                // Verifica linha
                for (let k = 0; k < 4; k++) {
                    if (k !== c && currentPuzzle[r][k] === value) {
                        cellEl.classList.add('invalid');
                        cells[r * 4 + k].classList.add('invalid');
                        isValid = false;
                    }
                }
                // Verifica coluna
                for (let k = 0; k < 4; k++) {
                    if (k !== r && currentPuzzle[k][c] === value) {
                        cellEl.classList.add('invalid');
                        cells[k * 4 + c].classList.add('invalid');
                        isValid = false;
                    }
                }
                // Verifica bloco 2x2
                const startRow = Math.floor(r / 2) * 2;
                const startCol = Math.floor(c / 2) * 2;
                for (let br = startRow; br < startRow + 2; br++) {
                    for (let bc = startCol; bc < startCol + 2; bc++) {
                        if (br !== r || bc !== c) {
                            if (currentPuzzle[br][bc] === value) {
                                cellEl.classList.add('invalid');
                         cells[br * 4 + bc].classList.add('invalid');
                                isValid = false;
                            }
                        }
                    }
                }
            }
        }
        if (showMessages) {
            if (isValid) {
                if (checkWin()) {
                    showMessage('Parabéns! Você resolveu o Sudoku!');
                } else {
                    showMessage('O tabuleiro é válido até agora. Continue!');
                }
            } else {
 showMessage('Há erros no tabuleiro. Verifique as células em vermelho.');
            }
        }
        return isValid;
    }
    /**
     * @returns {boolean} True se o puzzle estiver resolvido, false caso contrário.
     */
    function checkWin() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (currentPuzzle[r][c] === 0) {
                    return false; // Ainda há células vazias
                }
            }
        }
        return validateBoard(false);
    }
    function startNewGame() {
        const randomIndex = Math.floor(Math.random() * puzzles.length);
        initializeGame(puzzles[randomIndex]);
        showMessage('Novo jogo iniciado! Boa sorte!');
    }
    function resetGame() {
        initializeGame(initialPuzzle); // Re-inicializa com o puzzle original
        showMessage('Jogo reiniciado para o estado inicial.');
    }
    newGameBtn.addEventListener('click', startNewGame);
    resetGameBtn.addEventListener('click', resetGame);
    checkBoardBtn.addEventListener('click', () => validateBoard(true));
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });
    startNewGame(); // Inicia um novo jogo ao carregar a página
});
