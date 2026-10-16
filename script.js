/* ================================================= */
/* AI WEB DESIGN ACADEMY - JAVASCRIPT INTERACTIVE    */
/* Developer: Aokira                                 */
/* ================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // 1. WEB AUDIO API SOUND EFFECTS (Tanpa file eksternal, aman & langsung bunyi)
    let soundEnabled = true;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playBeep(frequency = 580, type = 'sine', duration = 0.05) {
        if (!soundEnabled) return;
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = type;
            osc.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Abaikan jika browser membatasi audio sebelum interaksi
        }
    }

    // 2. STATE & LOCALSTORAGE MANAGEMENT
    const STORAGE_KEY = 'ai_web_design_academy_progress_v2';
    
    let appState = {
        currentView: 'pageWelcome',
        currentStep: 1
    };

    function loadProgress() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                appState = { ...appState, ...parsed };
            } catch (e) {
                console.error("Gagal memuat progres:", e);
            }
        }
    }

    function saveProgress() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        updateProgressUI();
    }

    // 3. DOM ELEMENTS
    const views = {
        welcome: document.getElementById('pageWelcome'),
        tutorial: document.getElementById('pageTutorial'),
        finish: document.getElementById('pageFinish')
    };

    const startBtn = document.getElementById('startBtn');
    const resetProgressBtn = document.getElementById('resetProgressBtn');
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundIcon = document.getElementById('soundIcon');
    
    const copyPromptBtn = document.getElementById('copyPromptBtn');
    const promptTextContent = document.getElementById('promptTextContent');
    const toastNotification = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');
    
    const stepsNavItems = document.querySelectorAll('.step-nav-item');
    const tutorialStepCards = document.querySelectorAll('.tutorial-step-card');
    const nextStepBtns = document.querySelectorAll('.next-step');
    const prevStepBtns = document.querySelectorAll('.prev-step');
    const finishTutorialBtn = document.querySelector('.finish-tutorial-btn');
    
    const repeatTutorialBtn = document.getElementById('repeatTutorialBtn');
    const backHomeBtn = document.getElementById('backHomeBtn');
    
    const miniBarFill = document.getElementById('miniBarFill');
    const progressPercent = document.getElementById('progressPercent');

    // 4. NAVIGATION CONTROLLER
    function switchView(viewName) {
        Object.values(views).forEach(v => {
            if (v) v.classList.remove('active');
        });

        if (viewName === 'welcome' && views.welcome) {
            views.welcome.classList.add('active');
            appState.currentView = 'pageWelcome';
        } else if (viewName === 'tutorial' && views.tutorial) {
            views.tutorial.classList.add('active');
            appState.currentView = 'pageTutorial';
            showStep(appState.currentStep);
        } else if (viewName === 'finish' && views.finish) {
            views.finish.classList.add('active');
            appState.currentView = 'pageFinish';
            triggerConfettiEffect();
        }

        saveProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showStep(stepNumber) {
        if (stepNumber < 1) stepNumber = 1;
        if (stepNumber > 8) stepNumber = 8;
        appState.currentStep = stepNumber;

        stepsNavItems.forEach(item => {
            const sNum = parseInt(item.getAttribute('data-step'));
            if (sNum === stepNumber) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        tutorialStepCards.forEach(card => {
            const cNum = parseInt(card.getAttribute('data-step-content'));
            if (cNum === stepNumber) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        saveProgress();
    }

    function updateProgressUI() {
        let percent = 0;
        if (appState.currentView === 'pageWelcome') {
            percent = 0;
        } else if (appState.currentView === 'pageTutorial') {
            percent = Math.round((appState.currentStep / 8) * 90);
        } else if (appState.currentView === 'pageFinish') {
            percent = 100;
        }

        if (miniBarFill) miniBarFill.style.width = `${percent}%`;
        if (progressPercent) progressPercent.textContent = `${percent}%`;
    }

    // 5. EVENT LISTENERS
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            playBeep(700, 'sine', 0.08);
            switchView('tutorial');
            showStep(1);
        });
    }

    if (resetProgressBtn) {
        resetProgressBtn.addEventListener('click', () => {
            playBeep(400, 'sawtooth', 0.1);
            if (confirm('Yakin ingin mereset progres belajar dari awal?')) {
                localStorage.removeItem(STORAGE_KEY);
                appState = { currentView: 'pageWelcome', currentStep: 1 };
                switchView('welcome');
                updateProgressUI();
                showToast('Progres berhasil direset!');
            }
        });
    }

    if (soundToggleBtn && soundIcon) {
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundIcon.className = 'fa-solid fa-volume-high';
                playBeep(880, 'sine', 0.1);
                showToast('Sound Effect Aktif');
            } else {
                soundIcon.className = 'fa-solid fa-volume-xmark';
                showToast('Sound Effect Dimatikan');
            }
        });
    }

    stepsNavItems.forEach(item => {
        item.addEventListener('click', () => {
            playBeep(600, 'sine', 0.04);
            const targetStep = parseInt(item.getAttribute('data-step'));
            showStep(targetStep);
        });
    });

    nextStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playBeep(750, 'sine', 0.06);
            if (appState.currentStep < 8) {
                showStep(appState.currentStep + 1);
            }
        });
    });

    prevStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            playBeep(500, 'sine', 0.06);
            if (appState.currentStep > 1) {
                showStep(appState.currentStep - 1);
            } else {
                switchView('welcome');
            }
        });
    });

    if (finishTutorialBtn) {
        finishTutorialBtn.addEventListener('click', () => {
            playBeep(950, 'triangle', 0.15);
            switchView('finish');
        });
    }

    if (repeatTutorialBtn) {
        repeatTutorialBtn.addEventListener('click', () => {
            playBeep(700, 'sine', 0.06);
            switchView('tutorial');
            showStep(1);
        });
    }

    if (backHomeBtn) {
        backHomeBtn.addEventListener('click', () => {
            playBeep(600, 'sine', 0.06);
            switchView('welcome');
        });
    }

    // Tombol Salin Prompt
    if (copyPromptBtn && promptTextContent) {
        copyPromptBtn.addEventListener('click', async () => {
            playBeep(800, 'sine', 0.08);
            const textToCopy = promptTextContent.textContent;
            
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(textToCopy);
                    showToast('Prompt berhasil disalin!');
                } else {
                    fallbackCopyText(textToCopy);
                }
            } catch (err) {
                fallbackCopyText(textToCopy);
            }
        });
    }

    function fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showToast('Prompt berhasil disalin!');
            } else {
                showToast('Gagal menyalin, salin secara manual.');
            }
        } catch (err) {
            showToast('Gagal menyalin teks.');
        }
        document.body.removeChild(textArea);
    }

    function showToast(message) {
        if (!toastNotification || !toastMessage) return;
        toastMessage.textContent = message;
        toastNotification.classList.add('show');
        setTimeout(() => {
            toastNotification.classList.remove('show');
        }, 2500);
    }

    // 6. CANVAS ANIMASI BACKGROUND (Partikel Mengambang & Hujan Kode Dinamis)
    function initCanvasBackground() {
        const canvas = document.getElementById('cyberCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Partikel Mengambang
        const particles = [];
        const particleCount = window.innerWidth < 600 ? 25 : 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                color: Math.random() > 0.5 ? '#00F5FF' : '#00A3FF'
            });
        }

        // Karakter Hujan Kode
        const chars = '01<>{}[]#/*HTML_CSS_JS_AI*';
        const fontSize = 12;
        const columns = Math.floor(width / 25);
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -50);
        }

        function animate() {
            ctx.fillStyle = 'rgba(5, 7, 13, 0.2)';
            ctx.fillRect(0, 0, width, height);

            // Render Hujan Kode
            ctx.fillStyle = 'rgba(0, 245, 255, 0.15)';
            ctx.font = `${fontSize}px Fira Code, monospace`;
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * 25, drops[i] * fontSize);
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            // Render & Update Partikel
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function triggerConfettiEffect() {
        const confettiBox = document.getElementById('confettiBox');
        if (!confettiBox) return;
        confettiBox.innerHTML = '';

        const colors = ['#00A3FF', '#00F5FF', '#8B5CF6', '#00FF9C', '#F97316'];
        for (let i = 0; i < 35; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = `${Math.random() * 8 + 4}px`;
            particle.style.height = `${Math.random() * 8 + 4}px`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.top = '50%';
            particle.style.left = '50%';
            particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            particle.style.pointerEvents = 'none';

            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 180 + 40;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance;

            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
            ], {
                duration: Math.random() * 800 + 800,
                easing: 'cubic-bezier(0, .9, .57, 1)',
                fill: 'forwards'
            });

            confettiBox.appendChild(particle);
        }
    }

    // 7. INITIALIZATION
    loadProgress();
    initCanvasBackground();
    
    if (appState.currentView === 'pageTutorial') {
        switchView('tutorial');
        showStep(appState.currentStep);
    } else if (appState.currentView === 'pageFinish') {
        switchView('finish');
    } else {
        switchView('welcome');
    }
    
    updateProgressUI();
});
