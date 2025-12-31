const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const content = document.getElementById('content');
const overlay = document.getElementById('overlay');

canvas.width = innerWidth;
canvas.height = innerHeight;

let started = false;
let sparkles = [];
let particles = [];

// Gentle twinkling sparkles
for (let i = 0; i < 150; i++) {
    sparkles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.1 + 0.02,
        alpha: 0,
        twinkleSpeed: Math.random() * 0.01 + 0.005
    });
}

function drawSparkles() {
    sparkles.forEach(s => {
        s.y += s.speed;
        s.alpha = Math.sin(Date.now() * s.twinkleSpeed) * 0.5 + 0.5;
        
        if (s.y > canvas.height) {
            s.y = 0;
            s.x = Math.random() * canvas.width;
        }
        
        ctx.save();
        ctx.globalAlpha = s.alpha * 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2);
        gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
        gradient.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#fff';
        ctx.fill();
        ctx.restore();
    });
}

function createMagicParticles() {
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const p = document.createElement('div');
            p.className = 'golden-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 4 + 5) + 's';
            overlay.appendChild(p);
            setTimeout(() => p.remove(), 9000);
        }, i * 100);
    }
}

function animate() {
    ctx.fillStyle = 'rgba(26, 0, 51, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawSparkles();
    
    if (started && Math.random() < 0.08) {
        // Gentle fireworks bursts
        const x = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
        const y = canvas.height * 0.1 + Math.random() * canvas.height * 0.3;
        
        for (let i = 0; i < 20; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 1,
                life: 1,
                size: Math.random() * 3 + 1
            });
        }
    }
    
    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 0.98;
        p.life -= 0.02;
        p.size *= 0.99;
        
        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }
        
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.life})`;
        ctx.shadowBlur = 15 * p.life;
        ctx.shadowColor = '#fff';
        ctx.fill();
        ctx.restore();
    }
    
    requestAnimationFrame(animate);
}

startBtn.addEventListener('click', () => {
    started = true;
    startBtn.classList.add('hidden');
    content.classList.remove('hidden');
    createMagicParticles();
    
    // Continuous gentle magic
    setInterval(() => {
        if (started) createMagicParticles();
    }, 6000);
});

window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

animate();
