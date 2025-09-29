// ========================================
// CORREÇÕES PARA iOS - TEMA ESCURO
// ========================================

// Forçar tema escuro e prevenir comportamentos padrão do iOS
function forceDarkTheme() {
    console.log('Aplicando tema escuro forçado...');
    
    // Aplicar background diretamente no body e html
    document.body.style.background = 'linear-gradient(135deg, #05010a 0%, #0f0515 30%, #0a0f1f 70%, #05010a 100%)';
    document.body.style.backgroundAttachment = 'fixed';
    document.documentElement.style.background = '#05010a';
}

// Corrigir altura da viewport para iOS
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Aplicar correções específicas para Safari
function applySafariFixes() {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isSafari || isIOS) {
        console.log('Aplicando correções para Safari/iOS...');
        
        // Forçar repaint para garantir que o tema escuro seja aplicado
        document.body.style.opacity = '0.99';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 50);
    }
}

// Função para copiar texto com animação hacker
function copyWithHackAnimation(text, message) {
    // Ativar animação hacker
    const hackAnimation = document.getElementById('hackAnimation');
    const hackText = document.getElementById('hackText');
    const binaryRain = document.getElementById('binaryRain');
    
    hackText.innerHTML = '<span class="prompt">root@cybersec:~$ </span><span class="command">copy "' + text.substring(0, 15) + '..."</span>';
    hackAnimation.classList.add('active');
    
    // Criar chuva binária
    binaryRain.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const digit = document.createElement('div');
        digit.className = 'binary-digit';
        digit.textContent = Math.random() > 0.5 ? '1' : '0';
        digit.style.left = Math.random() * 100 + '%';
        digit.style.animationDelay = Math.random() * 5 + 's';
        binaryRain.appendChild(digit);
    }
    
    // Simular processo de cópia hacker
    setTimeout(() => {
        // Copiar para a área de transferência
        navigator.clipboard.writeText(text).then(() => {
            // Finalizar animação
            hackText.innerHTML = '<span class="prompt">root@cybersec:~$ </span><span class="command">copy successful!</span>';
            
            setTimeout(() => {
                hackAnimation.classList.remove('active');
                showToast(message);
            }, 1000);
        }).catch(err => {
            hackText.innerHTML = '<span class="prompt">root@cybersec:~$ </span><span class="command" style="color:#ff4757">copy failed!</span>';
            setTimeout(() => {
                hackAnimation.classList.remove('active');
                showToast('Falha ao copiar. Tente novamente.');
            }, 1500);
        });
    }, 1500);
}

// Função para mostrar toast de notificação
function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="toast-message">${message}</div>
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
    }, 3000);
}

function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        toast.remove();
    }, 300);
}

// Matrix Rain Effect
const canvas = document.getElementById('matrixRain');
const ctx = canvas.getContext('2d');

let matrixChars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
matrixChars = matrixChars.split('');

let fontSize = 14;
let columns = 0;
const drops = [];

function setupMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Ajustar tamanho da fonte com base na largura da tela
    fontSize = window.innerWidth < 768 ? 12 : 14;
    
    columns = Math.floor(canvas.width / fontSize);
    
    // Reset drops
    drops.length = 0;
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
    }
}

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ff2a6d';
    ctx.font = `${fontSize}px monospace`;
    
    for (let i = 0; i < drops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        
        drops[i]++;
    }
}

// Contador animado para estatísticas
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 segundos
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

//// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Aplicar correções de tema primeiro
    forceDarkTheme();
    applySafariFixes();
    setVH();
    
    // Configurar Matrix Rain
    setupMatrix();
    setInterval(drawMatrix, 35);
    
    // Configurar eventos de cópia
    document.querySelectorAll('.copyable').forEach(item => {
        item.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            copyWithHackAnimation(textToCopy, 'Copiado para a área de transferência!');
        });
    });
    
    // Simular carregamento
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        animateCounter();
    }, 3000);
    
    console.log('Página carregada com sucesso! Tema escuro forçado.');
});
    
    // Simular carregamento
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        animateCounter();
    }, 3000);
    
    console.log('Página carregada com sucesso!');
});

// Ajustar canvas quando a janela for redimensionada
window.addEventListener('resize', function() {
    setupMatrix();
});
// Ajustar canvas e VH quando a janela for redimensionada
window.addEventListener('resize', function() {
    setupMatrix();
    setVH();
});

window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        setVH();
        setupMatrix();
    }, 300);
});