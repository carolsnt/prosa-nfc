// Configuration

const links = {
    portfolio: 'https://prosatechcybersec.vercel.app/',
    youtube: 'https://www.youtube.com/channel/UCFCjY5HL585eF3O5-5pQ_4g',
    linkedin: 'https://www.linkedin.com/in/carolsnt/',
    github: 'https://github.com/carolsnt',
    instagram: 'https://www.instagram.com/prosa.tech',
    whatsapp: 'https://wa.me/5511958203077?text=Olá%20Carol!%20Vim%20pelo%20seu%20cartão%20NFC%20!'
};


// Matrix Rain Effect
function initMatrixRain() {
    const canvas = document.getElementById('matrixRain');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 20, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toastText');
    
    toastText.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(() => {
        showToast(`${text} copiado!`);
        return true;
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        showToast('Erro ao copiar');
        return false;
    });
}

function addRippleEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

function triggerEasterEgg() {
    const card = document.querySelector('.card');
    card.style.animation = 'none';
    card.style.border = '2px solid';
    card.style.borderImage = 'linear-gradient(45deg, #ff2d92, #00d4ff, #8b5cf6, #10b981) 1';
    card.style.borderImageSlice = '1';
    
    createConfetti();
    showToast('🎉 Easter Egg Ativado! Parabéns!', 5000);
}

function createConfetti() {
    const colors = ['#ff2d92', '#00d4ff', '#ffffff', '#ff5eb8'];
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '1000';
        confetti.style.animation = `fall ${2 + Math.random() * 2}s linear forwards`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    initMatrixRain();
    
    document.querySelectorAll('.link-card').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            addRippleEffect(this, e);
            
            const platform = this.dataset.platform;
            const url = links[platform];
            
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = '';
                if (url) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                    showToast(`Abrindo ${platform}...`);
                }
            }, 150);
        });

        link.addEventListener('mouseenter', function() {
            this.style.setProperty('--hover-scale', '1.02');
        });

        link.addEventListener('mouseleave', function() {
            this.style.setProperty('--hover-scale', '1');
        });
    });

    document.querySelectorAll('[data-copy]').forEach(item => {
        item.addEventListener('click', function(e) {
            addRippleEffect(this, e);
            const textToCopy = this.dataset.copy;
            copyToClipboard(textToCopy);
        });
    });

    let avatarClickCount = 0;
    document.getElementById('avatar').addEventListener('click', function(e) {
        addRippleEffect(this, e);
        avatarClickCount++;
        
        this.style.transform = `scale(1.1) rotateY(${avatarClickCount * 90}deg)`;
        
        setTimeout(() => {
            this.style.transform = '';
        }, 300);

        if (avatarClickCount >= 5) {
            triggerEasterEgg();
            avatarClickCount = 0;
        }

        setTimeout(() => {
            avatarClickCount = 0;
        }, 3000);
    });

    if (window.location.search.includes('nfc=true') || document.referrer === '') {
        showToast('🎯 Conectado via NFC!', 4000);
    }

    let views = parseInt(localStorage.getItem('cardViews') || '0') + 1;
    localStorage.setItem('cardViews', views.toString());
    console.log(`👀 Visualização #${views}`);
});
