// script.js CORRIGIDO
console.log("Iniciando script...");
document.addEventListener('DOMContentLoaded', () =>{
    console.log('DOM completamente carregado');
    if(typeof showMessage !== 'function'){
        console.error('ERRO: A função showMessage não está definida!');

        window.showMessage = function(message){
            console.log('Mensagem:', message);
            try{
                alert(message);
            } catch(e) {
                console.error('Erro ao exibir mensagem:', e);
            }
        };
    }
    const codeDataInput = document.getElementById('code-data');
    const toolButtons = document.querySelectorAll('.tool-button');
    const generateCodeBtn = document.getElementById('generate-code-btn');
    const saveCodeBtn = document.getElementById('save-code-btn');
    const clearCanvasBtn = document.getElementById('clear-canvas-btn');
    const codeCanvas = document.getElementById('code-canvas');
    const canvasMessage = document.getElementById('canvas-message');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');
    const closeMessageBtn = document.getElementById('close-message-btn'); // ID corrigido no HTML
                                                                        // Se o botão não tiver ID, use querySelector('.modal-content .action-button')
    let selectedCodeType = 'qrcode'; // 🟢 CORREÇÃO: Alinhado com o estado 'active' do HTML

    const BARCODE_WIDTH = 800;
    const BARCODE_HEIGHT = 200;
    const QR_CODE_SIZE = 300;
    let ctx;
    if(codeCanvas){
        try{
            ctx = codeCanvas.getContext('2d', { willReadFrequently: true});
            if(!ctx){
                console.error('Não foi possível obter o contexto 2D do canvas');
            } else{
                ctx.imageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;

                console.log('Contexto 2D inicializado com sucesso')
            }
        } catch(error){
            console.error('Erro ao inicializar o contexto 2D:', error);
        }
    }
    /**
     * @param {string} message
     */
    function showMessage(message){
        messageText.textContent = message;
        messageBox.style.display = 'flex';
    }
    function hideMessage(){
        messageBox.style.display = 'none';
    }
    function clearCanvas(){
        if(!codeCanvas){
            console.warn('Tentativa de limpar um canvas que não existe');
            return;
        }
        try{
            if(!ctx){
                ctx = codeCanvas.getContext('2d');
                if(!ctx){
                    console.error('Não foi possível obter o contexto 2D do canvas');
                    return;
                }
            }
            ctx.clearRect(0,0, codeCanvas.width, codeCanvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0,0,codeCanvas.width, codeCanvas.height);
            codeCanvas.style.display = 'none';
            if(canvasMessage){
                canvasMessage.style.display = 'block';
            }
            console.log('Canvas limpo com sucesso');
        } catch(error){
            console.log('Erro ao limpar o canvas:', error);
        }
    }
    async function generateCode(){
        const data = codeDataInput.value.trim();
        console.log('Iniciando geração de código. Tipo:', selectedCodeType, 'Dados', data);

        if(!data){
            showMessage('Por favor, insira os dados para gerar o código.');
            return;
        }
        clearCanvas();
        codeCanvas.style.display = 'block';
        if(canvasMessage){
            canvasMessage.style.display = 'none';
        }
        if(selectedCodeType === 'barcode'){
            codeCanvas.width = BARCODE_WIDTH;
            codeCanvas.height = BARCODE_HEIGHT;
            try{
                console.log('Gerando código de barras...');

                JsBarcode(codeCanvas, data, {
                    format: 'CODE128',
                    displayValue: true,
                    fontSize: 18,
                    height: BARCODE_HEIGHT * 0.7,
                    width: 2,
                    margin: 10,
                    lineColor: "#000000"
                });
                showMessage('Código de Barras gerado com sucesso!');
            } catch(error){
                showMessage(`Erro ao gerar Código de Barras: ${error.message}. Verifique os dados.`);
                clearCanvas();
            }
        } else if(selectedCodeType === 'qrcode'){
            try{
                console.log('Iniciando geração de QR Code...');

                const size = QR_CODE_SIZE;
                codeCanvas.width = size;
                codeCanvas.height = size;
                if(typeof QRCode === 'undefined'){
                    throw new Error('Biblioteca QRCode não carregada!');
                }
                try{
                    const ctx = codeCanvas.getContext('2d');
                    if(!ctx){
                        throw new Error('Não foi possível obter o contexto 2D');
                    }
                    const container = document.createElement('div');
                    container.style.position = 'fixed';
                    container.style.left = '-9999px';
                    document.body.appendChild(container);
                    const qr = new QRCode(container, {
                        text: data,
                        width: size,
                        height: size,
                        coloDark: '#000000',
                        colorLight: '#ffffff', // 🟢 CORREÇÃO: Usando ':' ao invés de '='
                        correctLevel: QRCode.CorrectLevel.H
                    });
                    setTimeout(() =>{
                        const img = container.querySelector('img');
                        if(img){
                            ctx.clearRect(0,0, size,size);
                            ctx.fillStyle = '#ffffff';
                            ctx.fillRect(0,0,size,size);
                            ctx.drawImage(img, 0,0,size,size);
                            showMessage('QR Code gerado com sucesso!');
                        } else{
                            throw new Error('Não foi possível gerar o QR Code');
                        }
                        document.body.removeChild(container);
                    }, 100);
                } catch(error){
                    console.error('Error ao gerar QR Code:', error);
                    showMessage('Erro ao gerar QR Code: ' + (error.message || 'Erro desconhecido'));
                    clearCanvas();
                }
            } catch (error){
                console.error('Erro ao gerar QR Code:', error);
                showMessage('Erro ao gerar QR Code: ' + (error.message || 'Erro desconhecido'));
                clearCanvas();
            }
        }
    }
    async function saveCode(){
        try{
            if(!codeCanvas || codeCanvas.width === 0 || codeCanvas.height === 0 || codeCanvas.style.display === 'none' || codeCanvas.offsetHeight === 0 || codeCanvas.offsetWidth === 0){
                showMessage('O código não está pronto. Por favor, gere um código primeiro.');
                return;
            }
            const dataURL = codeCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = `${selectedCodeType}_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            setTimeout(() =>{
                if(document.body.contains(link)){
                    document.body.removeChild(link);
                }
            }, 100);

            console.log('Imagem salva com sucesso:', link.download);
            showMessage('Imagem salva com sucesso!');
        } catch(error){
            console.error('Erro ao salvar a imagem:', error);
            showMessage('Erro ao salvar a imagem:' + (error.message || 'Erro desconhecido'));
        }
    }
    // A função generateWithDataURL não está sendo usada no generateCode, 
    // mas foi mantida por estar no script original.
    function generateWithDataURL(data, size){
        console.log('Gerando QR Code...');

        try{
            // Verifica se a biblioteca qrcode-js/qrcode.min.js está sendo usada 
            // ou se é uma versão diferente que suporta toCanvas (como qrcode.js do LazarSoft).
            // O index.html está usando 'davidshimjs/qrcodejs', que NÃO tem toCanvas.
            // Para evitar erro, este bloco deveria ser removido ou o index.html atualizado.
            // Mantido com aviso para não alterar a estrutura original do seu código.

            if(typeof QRCode.toCanvas === 'undefined'){
                console.warn('Função QRCode.toCanvas não disponível. Pulando este bloco.');
                return;
            }

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = size;
            tempCanvas.height = size;

            QRCode.toCanvas(tempCanvas, data, {
                width: size,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            }, function(error) {
                if(error) {
                    console.error('Erro ao gerar QR Code:', error);
                    showMessage('Erro ao gerar QR Code. Tente novamente.');
                    clearCanvas();
                    return;
                }
                const ctx = codeCanvas.getContext('2d');
                if(!ctx){
                    console.error('Não foi possível obter o context 2D');
                    return;
                }
                ctx.clearRect(0,0,size,size);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0,0,size,size);
                ctx.drawImage(tempCanvas, 0,0,size,size);
                console.log('QR Code gerado com sucesso!');
                showMessage('QR Code gerado com sucesso!');
            });
        } catch(e){
            console.error('Erro ao gerar QR Code:', e);
            showMessage('Erro ao gerar QR Code. Tente novamente.');
            clearCanvas();
        }
    }
    toolButtons.forEach(button => {
        button.addEventListener('click', () =>{
            toolButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedCodeType = button.dataset.codeType;
            showMessage(`Tipo de código selecionado: ${button.textContent.trim()}`);
            clearCanvas();
        });
    });
    generateCodeBtn.addEventListener('click', generateCode);
    saveCodeBtn.addEventListener('click', saveCode);

    clearCanvasBtn.addEventListener('click', clearCanvas);
    closeMessageBtn.addEventListener('click', hideMessage);
    messageBox.addEventListener('click', (e) =>{
        if(e.target === messageBox){
            hideMessage();
        }
    });
    generateCode()
});