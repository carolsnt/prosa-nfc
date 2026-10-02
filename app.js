/**
 * Cartão digital de Ana Caroline Santos.
 * Este arquivo inicializa os efeitos visuais e os controles da página.
 */

// Valores usados por mais de uma função ficam reunidos aqui para facilitar ajustes.
const CONFIG = {
    matrix: {
        speed: 35,
        mobileFontSize: 12,
        desktopFontSize: 14,
        chars: 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    animation: {
        copyDuration: 1500,
        toastDuration: 3000,
        counterDuration: 2000
    }
};

// As referências são preenchidas uma vez após o HTML carregar e reaproveitadas.
const DOM = {
    hackAnimation: null,
    hackText: null,
    binaryRain: null,
    toastContainer: null,
    matrixCanvas: null,
    loadingScreen: null
};

// Estado compartilhado entre eventos: evita cópias simultâneas e guarda o timer do Matrix.
const STATE = {
    isCopying: false,
    matrixInterval: null
};

/**
 * Coordena a animação e a cópia real como etapas separadas.
 * O estado bloqueia cliques duplicados enquanto a primeira cópia está em andamento.
 */
function copyWithHackAnimation(text, message) {
    if (STATE.isCopying) return;
    
    STATE.isCopying = true;
    
    // O overlay cobre a página; bloquear o scroll impede o conteúdo de se mover por trás.
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    // O terminal mostra uma versão curta; a cópia abaixo ainda usa o texto completo.
    const hackAnimation = DOM.hackAnimation;
    const hackText = DOM.hackText;
    const binaryRain = DOM.binaryRain;
    
    const truncatedText = text.length > 15 ? text.substring(0, 15) + '...' : text;
    renderHackText(hackText, `copy "${truncatedText}"`);
    hackAnimation.classList.add('active');
    
    // Criar os elementos fora da página antes de inseri-los em lote.
    createBinaryRain(binaryRain);
    
    // O atraso sincroniza o resultado da Clipboard API com a animação do terminal.
    setTimeout(() => {
        copyToClipboard(text)
            .then(() => {
                handleCopySuccess(hackText, hackAnimation, message);
            })
            .catch(err => {
                console.error('Erro ao copiar:', err);
                handleCopyError(hackText, hackAnimation);
            })
            .finally(() => {
                // `finally` roda tanto no sucesso quanto no erro e sempre libera novos cliques.
                STATE.isCopying = false;
            });
    }, CONFIG.animation.copyDuration);
}

/**
 * Atualiza o terminal sem interpretar o texto como HTML.
 * `textContent` faz com que caracteres como < e > apareçam literalmente.
 */
function renderHackText(container, commandText, isError = false) {
    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = 'root@cybersec:~$ ';

    const command = document.createElement('span');
    command.className = 'command';
    command.textContent = commandText;
    if (isError) command.style.color = '#ff4757';

    container.replaceChildren(prompt, command);
}

/**
 * Usa a Clipboard API do navegador, disponível em contextos seguros como HTTPS e localhost.
 * Como ela retorna uma Promise, quem chama esta função pode tratar sucesso e falha.
 */
async function copyToClipboard(text) {
    if (!navigator.clipboard?.writeText) {
        throw new Error('A cópia requer um contexto seguro com suporte à Clipboard API.');
    }

    return navigator.clipboard.writeText(text);
}

/**
 * Monta 50 dígitos decorativos. Cada dígito recebe três valores aleatórios:
 * caractere, posição horizontal e atraso da animação.
 */
function createBinaryRain(container) {
    container.replaceChildren();
    const fragment = document.createDocumentFragment();
    // Uma única chamada gera 50 × 3 números; dividir por 2^32 transforma-os em valores entre 0 e 1.
    const randomValues = crypto.getRandomValues(new Uint32Array(150));
    
    for (let i = 0; i < 50; i++) {
        const randomOffset = i * 3;
        const digit = document.createElement('div');
        digit.className = 'binary-digit';
        digit.textContent = randomValues[randomOffset] / 0x100000000 > 0.5 ? '1' : '0';
        digit.style.left = `${randomValues[randomOffset + 1] / 0x100000000 * 100}%`;
        digit.style.animationDelay = `${randomValues[randomOffset + 2] / 0x100000000 * 5}s`;
        fragment.appendChild(digit);
    }
    
    container.appendChild(fragment);
}

/** Mostra o resultado positivo e restaura o scroll que foi bloqueado no início. */
function handleCopySuccess(hackText, hackAnimation, message) {
    renderHackText(hackText, 'copy successful!');
    
    setTimeout(() => {
        hackAnimation.classList.remove('active');
        // Restaurar os estilos vazios devolve ao navegador o comportamento padrão de scroll.
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        showToast(message);
    }, 1000);
}

/** Mostra a falha e também restaura o scroll para a página não ficar travada. */
function handleCopyError(hackText, hackAnimation) {
    renderHackText(hackText, 'copy failed!', true);
    
    setTimeout(() => {
        hackAnimation.classList.remove('active');
        // O caminho de erro precisa desfazer o mesmo bloqueio aplicado no início.
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        showToast('Falha ao copiar. Tente novamente.');
    }, 1500);
}

/** Cria uma notificação temporária usando elementos DOM e texto simples. */
function showToast(message) {
    const toastContainer = DOM.toastContainer;
    const toast = document.createElement('div');
    toast.className = 'toast';
    const iconContainer = document.createElement('div');
    iconContainer.className = 'toast-icon';
    const icon = document.createElement('i');
    icon.className = 'fas fa-check-circle';
    icon.setAttribute('aria-hidden', 'true');
    iconContainer.append(icon);

    // O texto vem de uma variável; textContent evita que seja executado como marcação HTML.
    const toastMessage = document.createElement('div');
    toastMessage.className = 'toast-message';
    toastMessage.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'toast-close';
    closeButton.setAttribute('aria-label', 'Fechar notificação');
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fas fa-times';
    closeIcon.setAttribute('aria-hidden', 'true');
    closeButton.append(closeIcon);

    toast.append(iconContainer, toastMessage, closeButton);
    
    toastContainer.appendChild(toast);
    
    // Esperar o próximo quadro permite ao navegador aplicar o estado inicial antes da transição.
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // O botão remove a notificação antes do tempo automático, se a pessoa preferir.
    const toastCloseButton = toast.querySelector('.toast-close');
    toastCloseButton.addEventListener('click', () => {
        hideToast(toast);
    });
    
    // O tempo é centralizado em CONFIG para poder ser ajustado em um só lugar.
    setTimeout(() => {
        hideToast(toast);
    }, CONFIG.animation.toastDuration);
}

/** Inicia a transição de saída e remove o elemento quando ela termina. */
function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 300);
}

// Canvas: a cena é desenhada em pixels, sem criar um elemento HTML para cada caractere.
const canvas = document.getElementById('matrixRain');
const ctx = canvas ? canvas.getContext('2d') : null;

let matrixChars = CONFIG.matrix.chars.split('');
let fontSize = CONFIG.matrix.desktopFontSize;
let columns = 0;
const drops = [];

/** Ajusta o canvas à janela e posiciona o início de cada coluna de caracteres. */
function setupMatrix() {
    if (!canvas || !ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Uma fonte menor em telas estreitas mantém mais colunas visíveis no celular.
    fontSize = window.innerWidth < 768 ? CONFIG.matrix.mobileFontSize : CONFIG.matrix.desktopFontSize;
    
    columns = Math.floor(canvas.width / fontSize);
    
    // Redimensionar a tela exige recalcular onde cada coluna começa.
    drops.length = 0;
    const randomValues = crypto.getRandomValues(new Uint32Array(columns));
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(randomValues[i] / 0x100000000 * canvas.height / fontSize);
    }
}

/** Desenha um quadro do Matrix; esta função é chamada repetidamente pelo timer. */
function drawMatrix() {
    if (!canvas || !ctx) return;
    
    // O preto semitransparente não apaga o quadro anterior de uma vez: ele cria o rastro.
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff5c95';
    ctx.shadowColor = 'rgba(255, 42, 109, 0.85)';
    ctx.shadowBlur = 6;
    ctx.font = `${fontSize}px monospace`;
    const randomValues = crypto.getRandomValues(new Uint32Array(drops.length * 2));
    
    // Cada índice representa uma coluna; `drops[i]` indica a linha atual dessa coluna.
    for (let i = 0; i < drops.length; i++) {
        const randomOffset = i * 2;
        const text = matrixChars[randomValues[randomOffset] % matrixChars.length];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillText(text, x, y);
        
        // Ao chegar ao fim do canvas, a coluna volta ao topo com uma pequena chance aleatória.
        if (y > canvas.height && randomValues[randomOffset + 1] / 0x100000000 > 0.975) {
            drops[i] = 0;
        }
        
        drops[i]++;
    }

    ctx.shadowBlur = 0;
}

/** Anima os números das estatísticas do zero até o valor guardado em `data-count`. */
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = Number.parseInt(counter.dataset.count, 10);
        const duration = CONFIG.animation.counterDuration;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-out-quart começa rápido e desacelera perto do valor final.
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            counter.textContent = current;
            
            if (progress < 1) {
                // O navegador agenda o próximo passo antes de pintar o próximo quadro.
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    });
}

/** Guarda referências aos elementos usados por vários eventos e animações. */
function initDOMElements() {
    DOM.hackAnimation = document.getElementById('hackAnimation');
    DOM.hackText = document.getElementById('hackText');
    DOM.binaryRain = document.getElementById('binaryRain');
    DOM.toastContainer = document.getElementById('toastContainer');
    DOM.matrixCanvas = document.getElementById('matrixRain');
    DOM.loadingScreen = document.getElementById('loadingScreen');
}

/** Liga cada botão de contato ao valor armazenado em seu atributo `data-copy`. */
function initCopyListeners() {
    document.querySelectorAll('.copyable').forEach(item => {
        item.addEventListener('click', function() {
            const textToCopy = this.dataset.copy;
            if (textToCopy) {
                copyWithHackAnimation(textToCopy, 'Copiado para a área de transferência!');
            }
        });
    });
}

/** Esconde a tela de entrada após 3,5 s e então inicia os contadores. */
function simulateLoading() {
    setTimeout(() => {
        if (DOM.loadingScreen) {
            DOM.loadingScreen.classList.add('hidden');
        }
        animateCounter();
    }, 3500);
}

/**
 * Adia uma função até os eventos pararem de chegar por `wait` milissegundos.
 * Isso evita recalcular o canvas dezenas de vezes durante um único redimensionamento.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/** Bloqueia o toque de rolagem somente enquanto o overlay ocupa a tela. */
function preventIOSScroll() {
    document.addEventListener('touchmove', function(e) {
        if (DOM.hackAnimation?.classList.contains('active')) {
            e.preventDefault();
        }
    }, { passive: false });
}

/** Conecta arraste, inércia e botões ao mesmo ângulo 3D da moeda. */
function initProfileCoin() {
    const profileCoin = document.querySelector('.profile-coin');
    if (!profileCoin) return;

    const coinInner = profileCoin.querySelector('.profile-coin-inner');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rotation = 0;
    let startX = 0;
    let startRotation = 0;
    let previousX = 0;
    let previousTime = 0;
    let angularVelocity = 0;
    let activePointerId = null;
    let hasDragged = false;
    let ignoreNextClick = false;
    let animationFrame = null;

    function readCurrentRotation() {
        const transform = getComputedStyle(coinInner).transform;
        if (transform === 'none') return 0;

        const matrix = new DOMMatrixReadOnly(transform);
        // A matriz guarda a rotação em radianos; atan2 recupera o ângulo Y e a conversão o leva a graus.
        return Math.atan2(-matrix.m13, matrix.m11) * 180 / Math.PI;
    }

    function renderRotation(value) {
        rotation = value;
        coinInner.style.setProperty('--coin-angle', `${rotation}deg`);
        // O cosseno distingue as metades do giro: negativo significa que o verso está voltado para frente.
        profileCoin.classList.toggle('is-back-visible', Math.cos(rotation * Math.PI / 180) < 0);
    }

    function updateAccessibleState() {
        // O estado visual também atualiza o nome e o estado do botão para leitores de tela.
        const showingBack = Math.cos(rotation * Math.PI / 180) < 0;
        profileCoin.setAttribute('aria-pressed', String(showingBack));
        profileCoin.setAttribute('aria-label', showingBack ? 'Mostrar foto da frente' : 'Mostrar logo do verso');
    }

    function rotateBy(degrees) {
        // Um clique manual interrompe a inércia antes de iniciar um novo giro controlado.
        if (animationFrame !== null) cancelAnimationFrame(animationFrame);
        animationFrame = null;
        rotation = readCurrentRotation();
        profileCoin.classList.add('is-controlled', 'is-fast');
        profileCoin.classList.remove('is-spinning', 'is-dragging');
        angularVelocity = 0;
        renderRotation(rotation + degrees);
        updateAccessibleState();
    }

    function spinWithInertia(frameTime) {
        const elapsed = Math.min(frameTime - previousTime, 32);
        previousTime = frameTime;
        renderRotation(rotation + angularVelocity * elapsed);
        // Multiplicar a velocidade por um fator menor que 1 faz a moeda desacelerar aos poucos.
        angularVelocity *= Math.pow(0.985, elapsed / 16);

        if (Math.abs(angularVelocity) > 0.02) {
            animationFrame = requestAnimationFrame(spinWithInertia);
        } else {
            animationFrame = null;
            profileCoin.classList.remove('is-spinning');
            updateAccessibleState();
        }
    }

    function finishDrag(event) {
        if (activePointerId !== event.pointerId) return;

        activePointerId = null;
        profileCoin.classList.remove('is-dragging');
        // O navegador também dispara click ao soltar; ignorá-lo evita um flip extra após o arraste.
        ignoreNextClick = hasDragged;

        if (hasDragged && !reduceMotion && Math.abs(angularVelocity) > 0.02) {
            profileCoin.classList.add('is-spinning');
            previousTime = performance.now();
            animationFrame = requestAnimationFrame(spinWithInertia);
        } else {
            updateAccessibleState();
        }
    }

    profileCoin.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        if (animationFrame !== null) cancelAnimationFrame(animationFrame);

        animationFrame = null;
        ignoreNextClick = false;
        hasDragged = false;
        activePointerId = event.pointerId;
        rotation = readCurrentRotation();
        // Guardar a posição e o ângulo iniciais permite calcular o deslocamento relativo do dedo.
        startRotation = rotation;
        startX = event.clientX;
        previousX = event.clientX;
        previousTime = performance.now();
        angularVelocity = 0;

        profileCoin.classList.add('is-controlled', 'is-dragging');
        profileCoin.classList.remove('is-fast', 'is-spinning');
        renderRotation(rotation);
        profileCoin.setPointerCapture(event.pointerId);
    });

    profileCoin.addEventListener('pointermove', event => {
        if (activePointerId !== event.pointerId) return;

        const deltaX = event.clientX - startX;
        const now = performance.now();
        const elapsed = now - previousTime;
        // Um limite de 5 px diferencia arraste de toque simples; os pesos suavizam a velocidade.
        if (Math.abs(deltaX) > 5) hasDragged = true;

        if (hasDragged) {
            renderRotation(startRotation + deltaX * 1.1);
            if (elapsed > 0) {
                const instantVelocity = (event.clientX - previousX) * 1.1 / elapsed;
                angularVelocity = Math.max(-1.2, Math.min(1.2, angularVelocity * 0.65 + instantVelocity * 0.35));
            }
        }

        previousX = event.clientX;
        previousTime = now;
    });

    profileCoin.addEventListener('pointerup', finishDrag);
    profileCoin.addEventListener('pointercancel', finishDrag);

    profileCoin.addEventListener('click', () => {
        if (ignoreNextClick) {
            ignoreNextClick = false;
            return;
        }

        rotateBy(180);
    });

    document.querySelectorAll('[data-coin-rotation]').forEach(control => {
        control.addEventListener('click', () => {
            rotateBy(Number(control.dataset.coinRotation));
        });
    });

    coinInner.addEventListener('transitionend', event => {
        if (event.propertyName === 'transform') profileCoin.classList.remove('is-fast');
    });
}

/** Ponto de entrada: prepara referências e inicia cada recurso depois que o HTML existe. */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicação...');
    
    // Inicializar elementos DOM
    initDOMElements();
    initProfileCoin();
    
    // Configurar Matrix Rain
    setupMatrix();
    if (DOM.matrixCanvas && ctx) {
        STATE.matrixInterval = setInterval(drawMatrix, CONFIG.matrix.speed);
    }
    
    // Configurar eventos de cópia
    initCopyListeners();
    
    // Prevenir problemas de scroll no iOS
    preventIOSScroll();
    
    // Simular carregamento
    simulateLoading();
    
    console.log('✅ Aplicação carregada com sucesso!');
});

/** Recalcula o canvas após o usuário terminar de redimensionar a janela. */
window.addEventListener('resize', debounce(function() {
    setupMatrix();
}, 250));

/** Libera o timer do Matrix quando a página vai fechar ou navegar para outra rota. */
window.addEventListener('beforeunload', function() {
    if (STATE.matrixInterval) {
        clearInterval(STATE.matrixInterval);
    }
});

/** Evita a ação padrão do botão de cópia; a ação real é feita pelo listener específico. */
document.addEventListener('click', function(e) {
    if (e.target.closest('.copyable')) {
        e.preventDefault();
    }
});

/** Mantém um listener passivo de toque, que não bloqueia a rolagem do navegador. */
document.addEventListener('touchstart', function() {}, { passive: true });

/** Reajusta o canvas após girar o celular; o debounce evita recálculos repetidos. */
window.addEventListener('orientationchange', debounce(function() {
    setupMatrix();
}, 300));

/** Permite reconhecer a execução instalada como PWA para ajustes futuros. */
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 Executando como PWA');
}

/** Exemplo opcional: descomente este bloco se o projeto ganhar um arquivo de Service Worker. */
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker registrado'))
            .catch(err => console.log('❌ Erro ao registrar Service Worker:', err));
    });
}
*/