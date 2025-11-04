document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const textToSpeakInput = document.getElementById('text-to-speak');
    const voiceSelect = document.getElementById('voice-select');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValueSpan = document.getElementById('volume-value');
    const pitchSlider = document.getElementById('pitch-slider');
    const pitchValueSpan = document.getElementById('pitch-value');
    const rateSlider = document.getElementById('rate-slider');
    const rateValueSpan = document.getElementById('rate-value');
    const speakBtn = document.getElementById('speak-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const stopBtn = document.getElementById('stop-btn');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn');

    // --- Variáveis da API de Fala ---
    const synth = window.speechSynthesis; // Objeto SpeechSynthesis
    let utterance = new SpeechSynthesisUtterance(); // Objeto de fala
    let voices = []; // Array para armazenar as vozes disponíveis

    // --- Funções Auxiliares ---

    /**
     * Exibe uma caixa de mensagem modal.
     * @param {string} message - A mensagem a ser exibida.
     */
    function showMessage(message) {
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }

    /**
     * Oculta a caixa de mensagem modal.
     */
    function hideMessage() {
        messageBox.style.display = 'none';
    }

    /**
     * Popula o seletor de vozes com as vozes disponíveis no navegador.
     */
    function populateVoiceList() {
        voices = synth.getVoices().sort((a, b) => {
            const aname = a.name.toUpperCase();
            const bname = b.name.toUpperCase();
            if (aname < bname) return -1;
            if (aname == bname) return 0;
            return +1;
        });

        voiceSelect.innerHTML = ''; // Limpa as opções existentes

        if (voices.length === 0) {
            const option = document.createElement('option');
            option.textContent = 'Nenhuma voz disponível';
            voiceSelect.appendChild(option);
            speakBtn.disabled = true;
            showMessage('Nenhuma voz de fala encontrada no seu navegador. Por favor, verifique as configurações do seu sistema.');
            return;
        }

        voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = voice.name;
            option.dataset.lang = voice.lang;
            option.dataset.name = voice.name;
            voiceSelect.appendChild(option);

            // Seleciona uma voz padrão (ex: a primeira voz em português, ou a primeira disponível)
            if (voice.lang === 'pt-BR' && utterance.voice === null) {
                voiceSelect.value = voice.name;
                utterance.voice = voice;
            } else if (index === 0 && utterance.voice === null) { // Fallback para a primeira voz se não houver pt-BR
                 voiceSelect.value = voice.name;
                 utterance.voice = voice;
            }
        });

        // Se nenhuma voz foi selecionada automaticamente, seleciona a primeira da lista
        if (utterance.voice === null && voices.length > 0) {
            utterance.voice = voices[0];
            voiceSelect.value = voices[0].name;
        }

        speakBtn.disabled = false; // Habilita o botão de falar
    }

    /**
     * Inicia a leitura do texto.
     */
    function speakText() {
        if (synth.speaking) {
            showMessage('Já estou falando. Por favor, pare a fala atual antes de iniciar uma nova.');
            return;
        }

        const text = textToSpeakInput.value.trim();
        if (text === '') {
            showMessage('Por favor, digite algum texto para eu falar.');
            return;
        }

        if (voices.length === 0) {
            showMessage('Nenhuma voz disponível para falar.');
            return;
        }

        utterance.text = text;
        utterance.volume = parseFloat(volumeSlider.value);
        utterance.pitch = parseFloat(pitchSlider.value);
        utterance.rate = parseFloat(rateSlider.value);

        // Define a voz selecionada
        const selectedVoiceName = voiceSelect.value;
        utterance.voice = voices.find(voice => voice.name === selectedVoiceName);

        if (!utterance.voice) {
            showMessage('Voz selecionada não encontrada. Usando voz padrão.');
            utterance.voice = voices[0]; // Fallback para a primeira voz
        }

        synth.speak(utterance);
        updateButtonStates(true); // Habilita botões de pausa/parada
    }

    /**
     * Pausa a leitura atual.
     */
    function pauseSpeech() {
        if (synth.speaking && !synth.paused) {
            synth.pause();
            updateButtonStates(true, true); // Habilita retomar
            showMessage('Fala pausada.');
        } else if (synth.paused) {
            showMessage('A fala já está pausada.');
        } else {
            showMessage('Nenhuma fala ativa para pausar.');
        }
    }

    /**
     * Retoma a leitura pausada.
     */
    function resumeSpeech() {
        if (synth.paused) {
            synth.resume();
            updateButtonStates(true); // Volta ao estado de falando
            showMessage('Fala retomada.');
        } else if (synth.speaking) {
            showMessage('A fala já está ativa.');
        } else {
            showMessage('Nenhuma fala pausada para retomar.');
        }
    }

    /**
     * Para a leitura atual.
     */
    function stopSpeech() {
        if (synth.speaking || synth.paused) {
            synth.cancel(); // Cancela qualquer fala em andamento ou pausada
            updateButtonStates(false); // Desabilita botões de pausa/retomar/parar
            showMessage('Fala parada.');
        } else {
            showMessage('Nenhuma fala ativa para parar.');
        }
    }

    /**
     * Atualiza o estado dos botões de reprodução.
     * @param {boolean} speaking - True se a fala estiver ativa.
     * @param {boolean} paused - True se a fala estiver pausada.
     */
    function updateButtonStates(speaking, paused = false) {
        speakBtn.disabled = speaking;
        pauseBtn.disabled = !speaking || paused;
        resumeBtn.disabled = !paused;
        stopBtn.disabled = !speaking && !paused;
    }

    // --- Event Listeners ---

    // Evento quando as vozes são carregadas
    synth.addEventListener('voiceschanged', populateVoiceList);

    // Seleção de Voz
    voiceSelect.addEventListener('change', () => {
        const selectedVoiceName = voiceSelect.value;
        utterance.voice = voices.find(voice => voice.name === selectedVoiceName);
    });

    // Ajuste de Volume
    volumeSlider.addEventListener('input', (e) => {
        utterance.volume = parseFloat(e.target.value);
        volumeValueSpan.textContent = `${Math.round(e.target.value * 100)}%`;
    });

    // Ajuste de Tom (Pitch)
    pitchSlider.addEventListener('input', (e) => {
        utterance.pitch = parseFloat(e.target.value);
        pitchValueSpan.textContent = e.target.value;
    });

    // Ajuste de Velocidade (Rate)
    rateSlider.addEventListener('input', (e) => {
        utterance.rate = parseFloat(e.target.value);
        rateValueSpan.textContent = e.target.value;
    });

    // Botões de Reprodução
    speakBtn.addEventListener('click', speakText);
    pauseBtn.addEventListener('click', pauseSpeech);
    resumeBtn.addEventListener('click', resumeSpeech);
    stopBtn.addEventListener('click', stopSpeech);

    // Eventos do utterance para atualizar o estado dos botões
    utterance.onstart = () => updateButtonStates(true);
    utterance.onend = () => updateButtonStates(false);
    utterance.onerror = (event) => {
        console.error('SpeechSynthesisUtterance.onerror', event);
        showMessage(`Erro na fala: ${event.error}`);
        updateButtonStates(false);
    };

    // Botão "OK" do Modal
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) => {
        if (e.target === messageBox) {
            hideMessage();
        }
    });

    // --- Inicialização ---
    populateVoiceList(); // Tenta popular a lista de vozes ao carregar
    updateButtonStates(false); // Define o estado inicial dos botões
});
