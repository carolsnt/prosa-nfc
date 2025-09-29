/**
 * Cartão Digital - Ana Caroline Santos
 * Segurança da Informação - Prosa Tech Cybersec
 * Versão: 2.0.0
 */

// Configurações globais
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

// Cache de elementos DOM
const DOM = {
    hackAnimation: null,
    hackText: null,
    binaryRain: null,
    toastContainer: null,
    matrixCanvas: null,
    loadingScreen: null
};

// Estado da aplicação
const STATE = {
    isCopying: false,
    matrixInterval: null
};

/**
 * Função para copiar texto com animação hacker
 */
function copyWithHackAnimation(text, message) {
    if (STATE.isCopying) return;
    
    STATE.isCopying = true;
    
    // Ativar animação hacker
    const hackAnimation = DOM.hackAnimation;
    const hackText = DOM.hackText;
    const binaryRain = DOM.binaryRain;
    
    const truncatedText = text.length > 15 ? text.substring(0, 15) + '...' : text;
    hackText.innerHTML = `<span class="prompt">root@cybersec:~$ </span><span class="command">copy "${truncatedText}"</span>`;
    hackAnimation.classList.add('active');
    
    // Criar chuva binária otimizada
    createBinaryRain(binaryRain);
    
    // Simular processo de cópia hacker
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
                STATE.isCopying = false;
            });
    }, CONFIG.animation.copyDuration);
}

/**
 * Copia texto para a área de transferência
 */
async function copyToClipboard(text) {
    // Fallback para navegadores mais antigos
    if (!navigator.clipboard) {
        return fallbackCopyToClipboard(text);
    }
    
    return navigator.clipboard.writeText(text);
}

/**
 * Fallback para copiar texto
 */
function fallbackCopyToClipboard(text) {
    return new Promise((resolve, reject) => {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            if (successful) {
                resolve();
            } else {
                reject(new Error('Falha ao copiar'));
            }
        } catch (err) {
            document.body.removeChild(textArea);
            reject(err);
        }
    });
}

/**
 * Cria efeito de chuva binária
 */
function createBinaryRain(container) {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < 50; i++) {
        const digit = document.createElement('div');
        digit.className = 'binary-digit';
        digit.textContent = Math.random() > 0.5 ? '1' : '0';
        digit.style.left = Math.random() * 100 + '%';
        digit.style.animationDelay = Math.random() * 5 + 's';
        fragment.appendChild(digit);
    }
    
    container.appendChild(fragment);
}

/**
 * Manipula sucesso na cópia
 */
function handleCopySuccess(hackText, hackAnimation, message) {
    hackText.innerHTML = '<span class="prompt">root@cybersec:~$ </span><span class="command">copy successful!</span>';
    
    setTimeout(() => {
        hackAnimation.classList.remove('active');
        showToast(message);
    }, 1000);
}

/**
 * Manipula erro na cópia
 */
function handleCopyError(hackText, hackAnimation) {
    hackText.innerHTML = '<span class="prompt">root@cybersec:~$ </span><span class="command" style="color:#ff4757">copy failed!</span>';
    
    setTimeout(() => {
        hackAnimation.classList.remove('active');
        showToast('Falha ao copiar. Tente novamente.');
    }, 1500);
}

/**
 * Função para mostrar toast de notificação
 */
function showToast(message) {
    const toastContainer = DOM.toastContainer;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="toast-message">${escapeHTML(message)}</div>
        <button class="toast-close" aria-label="Fechar notificação">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Configurar botão de fechar
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        hideToast(toast);
    });
    
    // Auto-remover após 3 segundos
    setTimeout(() => {
        hideToast(toast);
    }, CONFIG.animation.toastDuration);
}

/**
 * Esconde e remove toast
 */
function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 300);
}

/**
 * Escape HTML para prevenir XSS
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Matrix Rain Effect
const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

let matrixChars = CONFIG.matrix.chars.split('');
let fontSize = CONFIG.matrix.desktopFontSize;
let columns = 0;
const drops = [];

/**
 * Configura o canvas do Matrix Rain
 */
function setupMatrix() {
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Ajustar tamanho da fonte com base na largura da tela
    fontSize = window.innerWidth < 768 ? CONFIG.matrix.mobileFontSize : CONFIG.matrix.desktopFontSize;
    
    columns = Math.floor(canvas.width / fontSize);
    
    // Reset drops
    drops.length = 0;
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
}

/**
 * Desenha o efeito Matrix Rain
 */
function drawMatrix() {
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff2a6d';
    ctx.font = `${fontSize}px monospace`;
    
    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        ctx.fillText(text, x, y);
        
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        drops[i]++;
    }
}

/**
 * Contador animado para estatísticas
 */
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = CONFIG.animation.counterDuration;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function para animação mais suave
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    });
}

/**
 * Inicializa os elementos DOM
 */
function initDOMElements() {
    DOM.hackAnimation = document.getElementById('hackAnimation');
    DOM.hackText = document.getElementById('hackText');
    DOM.binaryRain = document.getElementById('binaryRain');
    DOM.toastContainer = document.getElementById('toastContainer');
    DOM.matrixCanvas = document.getElementById('matrixRain');
    DOM.loadingScreen = document.getElementById('loadingScreen');
}

/**
 * Configura os event listeners de cópia
 */
function initCopyListeners() {
    document.querySelectorAll('.copyable').forEach(item => {
        item.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            if (textToCopy) {
                copyWithHackAnimation(textToCopy, 'Copiado para a área de transferência!');
            }
        });
    });
}

/**
 * Simula o carregamento da página
 */
function simulateLoading() {
    setTimeout(() => {
        if (DOM.loadingScreen) {
            DOM.loadingScreen.classList.add('hidden');
        }
        animateCounter();
    }, 3000);
}

/**
 * Debounce para otimizar resize
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

/**
 * Inicialização quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando aplicação...');
    
    // Inicializar elementos DOM
    initDOMElements();
    
    // Configurar Matrix Rain
    setupMatrix();
    if (DOM.matrixCanvas) {
        STATE.matrixInterval = setInterval(drawMatrix, CONFIG.matrix.speed);
    }
    
    // Configurar eventos de cópia
    initCopyListeners();
    
    // Simular carregamento
    simulateLoading();
    
    console.log('✅ Aplicação carregada com sucesso!');
});

/**
 * Ajustar canvas quando a janela for redimensionada
 */
window.addEventListener('resize', debounce(function() {
    setupMatrix();
}, 250));

/**
 * Cleanup quando a página for descarregada
 */
window.addEventListener('beforeunload', function() {
    if (STATE.matrixInterval) {
        clearInterval(STATE.matrixInterval);
    }
});

/**
 * Prevenir comportamento padrão em links
 */
document.addEventListener('click', function(e) {
    if (e.target.matches('.copyable')) {
        e.preventDefault();
    }
});