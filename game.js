(() => {
    const { Engine, Runner, Bodies, Body, Composite, Events } = Matter;

    /* ─── i18n ─── */
    const STRINGS = {
        ru: {
            title: 'ФРУКТОВАЯ ОРБИТА',
            subtitle: 'Совмещайте одинаковые фрукты!',
            howto: 'Наведите / тапните вокруг круга и отпустите, чтобы запустить фрукт. Два одинаковых сливаются в следующий. Не дайте фруктам долго выходить за пунктир.',
            play: 'ИГРАТЬ',
            shop: 'МАГАЗИН',
            shopHint: 'Монеты за очки. Скины для каждого фрукта.',
            back: 'НАЗАД',
            score: 'ОЧКИ',
            best: 'РЕКОРД',
            coins: 'МОНЕТЫ',
            coinsWord: 'монет',
            next: 'СЛЕДУЮЩИЙ',
            gameOver: 'ИГРА ОКОНЧЕНА',
            yourScore: 'Ваш счёт',
            again: 'ЗАНОВО',
            continueAd: 'ПРОДОЛЖИТЬ (реклама)',
            x2reward: 'x2 МОНЕТЫ (реклама)',
            toMenu: 'В МЕНЮ',
            paused: 'ПАУЗА',
            resume: 'ПРОДОЛЖИТЬ',
            exitToMenu: 'В МЕНЮ',
            pauseHint: 'Выход в меню: монеты ×0.5 от текущих очков',
            buy: 'КУПИТЬ',
            equip: 'НАДЕТЬ',
            equipped: 'НАДЕТО',
            owned: 'КУПЛЕНО',
            notEnough: 'Не хватает монет',
            bought: 'Куплено!',
            equippedToast: 'Скин надет',
            free: 'Бесплатно',
            shopAdReward: '▶ РЕКЛАМА · +15 МОНЕТ',
            shopAdGot: '+15 монет!',
            skinClassic: 'Классика',
            skinGold: 'Золотой',
            skinIce: 'Ледяной',
            skinNeon: 'Неон',
            skinShadow: 'Тень',
            skinCandy: 'Конфетка',
            fruit_cherry: 'Вишня',
            fruit_strawberry: 'Клубника',
            fruit_grape: 'Виноград',
            fruit_mandarin: 'Мандарин',
            fruit_persimmon: 'Хурма',
            fruit_apple: 'Яблоко',
            fruit_pear: 'Груша',
            fruit_peach: 'Персик',
            fruit_pineapple: 'Ананас',
            fruit_melon: 'Дыня',
            fruit_watermelon: 'Арбуз'
        },
        en: {
            title: 'FRUIT ORBIT',
            subtitle: 'Merge matching fruits!',
            howto: 'Aim around the circle and tap to launch a fruit. Two of the same merge into the next. Don’t let fruits stay outside the dashed line too long.',
            play: 'PLAY',
            shop: 'SHOP',
            shopHint: 'Coins from score. Skins for each fruit.',
            back: 'BACK',
            score: 'SCORE',
            best: 'BEST',
            coins: 'COINS',
            coinsWord: 'coins',
            next: 'NEXT',
            gameOver: 'GAME OVER',
            yourScore: 'Your score',
            again: 'AGAIN',
            continueAd: 'CONTINUE (ad)',
            x2reward: 'x2 COINS (ad)',
            toMenu: 'MENU',
            paused: 'PAUSED',
            resume: 'RESUME',
            exitToMenu: 'TO MENU',
            pauseHint: 'Quit to menu: coins ×0.5 from current score',
            buy: 'BUY',
            equip: 'EQUIP',
            equipped: 'EQUIPPED',
            owned: 'OWNED',
            notEnough: 'Not enough coins',
            bought: 'Purchased!',
            equippedToast: 'Skin equipped',
            free: 'Free',
            shopAdReward: '▶ AD · +15 COINS',
            shopAdGot: '+15 coins!',
            skinClassic: 'Classic',
            skinGold: 'Gold',
            skinIce: 'Ice',
            skinNeon: 'Neon',
            skinShadow: 'Shadow',
            skinCandy: 'Candy',
            fruit_cherry: 'Cherry',
            fruit_strawberry: 'Strawberry',
            fruit_grape: 'Grape',
            fruit_mandarin: 'Mandarin',
            fruit_persimmon: 'Persimmon',
            fruit_apple: 'Apple',
            fruit_pear: 'Pear',
            fruit_peach: 'Peach',
            fruit_pineapple: 'Pineapple',
            fruit_melon: 'Melon',
            fruit_watermelon: 'Watermelon'
        }
    };

    let lang = 'ru';
    function t(key) {
        return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.ru[key] || key;
    }

    function applyI18n() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (key) el.textContent = t(key);
        });
        document.title = t('title');
        document.documentElement.lang = lang;
    }

    /* ─── Fruits ─── */
    const FRUITS = [
        { name: 'cherry', radius: 14, color: '#e53935', points: 1, drawScale: 2.8, yOffset: -0.08 },
        { name: 'strawberry', radius: 20, color: '#e91e63', points: 2, drawScale: 2.7, yOffset: -0.05 },
        { name: 'grape', radius: 26, color: '#7b1fa2', points: 4, drawScale: 2.5, yOffset: -0.04 },
        { name: 'mandarin', radius: 30, color: '#f57c00', points: 8, drawScale: 2.8, yOffset: -0.08 },
        { name: 'persimmon', radius: 36, color: '#e64a19', points: 16, drawScale: 2.8, yOffset: -0.06 },
        { name: 'apple', radius: 40, color: '#c62828', points: 32, drawScale: 2.8, yOffset: -0.08 },
        { name: 'pear', radius: 44, color: '#9e9d24', points: 64, drawScale: 2.7, yOffset: -0.12 },
        { name: 'peach', radius: 48, color: '#ff8a65', points: 128, drawScale: 2.7, yOffset: -0.06 },
        { name: 'pineapple', radius: 54, color: '#f9a825', points: 256, drawScale: 2.8, yOffset: -0.08 },
        { name: 'melon', radius: 58, color: '#388e3c', points: 512, drawScale: 2.6, yOffset: -0.05 },
        { name: 'watermelon', radius: 66, color: '#2e7d32', points: 1024, drawScale: 2.5, yOffset: -0.02 }
    ];

    /* Skin styles applied via canvas filter + optional glow */
    const SKIN_CATALOG = [
        { id: 'classic', nameKey: 'skinClassic', price: 0, filter: null, glow: null },
        { id: 'gold', nameKey: 'skinGold', price: 120, filter: 'sepia(1) saturate(4) hue-rotate(5deg) brightness(1.15)', glow: '#ffd54f' },
        { id: 'ice', nameKey: 'skinIce', price: 220, filter: 'hue-rotate(170deg) saturate(0.85) brightness(1.25) contrast(1.05)', glow: '#81d4fa' },
        { id: 'neon', nameKey: 'skinNeon', price: 380, filter: 'saturate(2.2) brightness(1.2) contrast(1.15) hue-rotate(-10deg)', glow: '#e040fb' },
        { id: 'shadow', nameKey: 'skinShadow', price: 300, filter: 'grayscale(0.25) brightness(0.72) contrast(1.25) saturate(0.9)', glow: '#5c0632' },
        { id: 'candy', nameKey: 'skinCandy', price: 520, filter: 'hue-rotate(300deg) saturate(1.8) brightness(1.15)', glow: '#ff80ab' }
    ];

    /* Economy: coins are scarce — full wardrobe takes many runs + ads */
    const COIN_SCORE_DIVISOR = 50; /* was 10 — ~5× fewer coins from score */
    const SHOP_AD_COINS = 15;

    /* Price scales with fruit tier so bigger fruits cost more */
    function skinPrice(fruitIndex, basePrice) {
        if (basePrice === 0) return 0;
        return Math.round(basePrice * (1 + fruitIndex * 0.45));
    }

    function coinsFromScore(sc, half) {
        var n = Math.floor(Math.max(0, sc) / COIN_SCORE_DIVISOR);
        if (half) n = Math.floor(n / 2);
        return n;
    }

    const FRUIT_IMAGES = {};
    let loadCount = 0;

    function loadFruitImages(callback) {
        FRUITS.forEach(function (f) {
            var img = new Image();
            img.onload = function () {
                FRUIT_IMAGES[f.name] = img;
                loadCount++;
                if (loadCount === FRUITS.length) callback();
            };
            img.onerror = function () {
                loadCount++;
                if (loadCount === FRUITS.length) callback();
            };
            img.src = 'fruits/' + f.name + '.svg';
        });
    }

    /* ─── State ─── */
    let engine = null;
    let runner = null;
    let canvas, ctx;
    let W, H, centerX, centerY, playRadius;
    let score = 0, bestScore = 0;
    let coins = 0;
    let pendingCoins = 0;
    let rewardClaimed = false;
    let runCoinsFinalized = false;
    let continueUsed = false;
    let shopAdBusy = false;
    let isPaused = false;
    let currentFruitIndex = 0, nextFruitIndex = 0;
    let aimAngle = -Math.PI / 2;
    let canShoot = true;
    let gameOver = false;
    let gameStarted = false;
    let gameplayActive = false;
    let overTimer = null;
    let comboCount = 0;
    let lastComboTime = 0;
    let ysdk = null;
    let player = null;
    let particles = [];
    let rafId = null;
    let gamesPlayed = 0;
    let soundEnabled = true;
    let audioSuspendedByPlatform = false;
    let selectedShopFruit = 0;
    let shopToastTimer = null;
    let fruitScale = 1;

    /* ownedSkins[fruitName] = [skinId, ...] ; equipped[fruitName] = skinId */
    let ownedSkins = {};
    let equippedSkins = {};

    function defaultProgress() {
        ownedSkins = {};
        equippedSkins = {};
        FRUITS.forEach(function (f) {
            ownedSkins[f.name] = ['classic'];
            equippedSkins[f.name] = 'classic';
        });
        coins = 0;
        bestScore = 0;
        soundEnabled = true;
    }

    defaultProgress();

    let audioCtx = null;

    function getAudioCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    function canPlaySound() {
        return soundEnabled && !audioSuspendedByPlatform;
    }

    function playMergeSound() {
        if (!canPlaySound()) return;
        try {
            var ac = getAudioCtx();
            if (ac.state === 'suspended') ac.resume();
            var osc = ac.createOscillator();
            var gain = ac.createGain();
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.type = 'sine';
            var now = ac.currentTime;
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) { /* ignore */ }
    }

    function playDropSound() {
        if (!canPlaySound()) return;
        try {
            var ac = getAudioCtx();
            if (ac.state === 'suspended') ac.resume();
            var osc = ac.createOscillator();
            var gain = ac.createGain();
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.type = 'triangle';
            var now = ac.currentTime;
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) { /* ignore */ }
    }

    function suspendAudio() {
        audioSuspendedByPlatform = true;
        try {
            if (audioCtx && audioCtx.state === 'running') audioCtx.suspend();
        } catch (e) { /* ignore */ }
    }

    function resumeAudio() {
        audioSuspendedByPlatform = false;
        if (!soundEnabled) return;
        try {
            if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
        } catch (e) { /* ignore */ }
    }

    function updateMuteUI() {
        var on = document.getElementById('mute-icon-on');
        var off = document.getElementById('mute-icon-off');
        if (!on || !off) return;
        if (soundEnabled) {
            on.classList.remove('hidden');
            off.classList.add('hidden');
        } else {
            on.classList.add('hidden');
            off.classList.remove('hidden');
        }
    }

    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    function resize() {
        var vv = window.visualViewport;
        W = Math.round((vv && vv.width) || window.innerWidth);
        H = Math.round((vv && vv.height) || window.innerHeight);
        canvas.width = W;
        canvas.height = H;
        centerX = W / 2;
        centerY = H / 2;
        /* Mobile: use width as anchor so the circle fills the screen better */
        var isPortrait = H > W;
        var baseScale = isPortrait ? 0.42 : 0.38;
        if (H < 560) baseScale = isPortrait ? 0.40 : 0.34;
        else if (H < 700) baseScale = isPortrait ? 0.41 : 0.36;
        playRadius = (isPortrait ? W : Math.min(W, H)) * baseScale;
        /* Scale down fruits on narrow screens so they don't crowd the field */
        fruitScale = Math.min(1, Math.max(0.6, playRadius / 180));
        if ((!gameStarted || gameOver) && engine == null) {
            ctx.clearRect(0, 0, W, H);
            drawBackground();
            drawPlayfield();
        }
    }

    function getSkinDef(skinId) {
        for (var i = 0; i < SKIN_CATALOG.length; i++) {
            if (SKIN_CATALOG[i].id === skinId) return SKIN_CATALOG[i];
        }
        return SKIN_CATALOG[0];
    }

    function getEquippedSkin(fruitName) {
        return equippedSkins[fruitName] || 'classic';
    }

    function isOwned(fruitName, skinId) {
        var list = ownedSkins[fruitName] || ['classic'];
        return list.indexOf(skinId) !== -1;
    }

    function createFruitBody(index, x, y) {
        var fruit = FRUITS[index];
        var r = fruit.radius * fruitScale;
        var body = Bodies.circle(x, y, r, {
            restitution: 0.2,
            friction: 0.5,
            density: 0.002,
            frictionAir: 0.01
        });
        body.fruitIndex = index;
        body.skinId = getEquippedSkin(fruit.name);
        return body;
    }

    function mergeFruits(bodyA, bodyB) {
        if (bodyA.fruitIndex !== bodyB.fruitIndex) return false;
        if (bodyA.fruitIndex >= FRUITS.length - 1) return false;
        var newIdx = bodyA.fruitIndex + 1;
        var mx = (bodyA.position.x + bodyB.position.x) / 2;
        var my = (bodyA.position.y + bodyB.position.y) / 2;
        Composite.remove(engine.world, bodyA);
        Composite.remove(engine.world, bodyB);
        var newBody = createFruitBody(newIdx, mx, my);
        Body.setVelocity(newBody, { x: 0, y: 0 });
        Composite.add(engine.world, newBody);
        addScore(FRUITS[newIdx].points, mx, my);
        spawnMergeParticles(mx, my, FRUITS[newIdx].color);
        playMergeSound();
        return true;
    }

    function initEngine() {
        engine = Engine.create({ gravity: { x: 0, y: 0 } });

        Events.on(engine, 'collisionStart', function (event) {
            for (var i = 0; i < event.pairs.length; i++) {
                var pair = event.pairs[i];
                if (pair.bodyA.fruitIndex !== undefined && pair.bodyB.fruitIndex !== undefined) {
                    mergeFruits(pair.bodyA, pair.bodyB);
                }
            }
        });

        var wallOptions = { isStatic: true, restitution: 0.3, friction: 0.1 };
        Composite.add(engine.world, [
            Bodies.rectangle(-50, H / 2, 100, H * 2, wallOptions),
            Bodies.rectangle(W + 50, H / 2, 100, H * 2, wallOptions),
            Bodies.rectangle(W / 2, -50, W * 2, 100, wallOptions),
            Bodies.rectangle(W / 2, H + 50, W * 2, 100, wallOptions)
        ]);

        if (runner) Runner.stop(runner);
        runner = Runner.create();
        Runner.run(runner, engine);
    }

    function getDistance(body) {
        var dx = body.position.x - centerX;
        var dy = body.position.y - centerY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function applyCenterGravity() {
        if (!engine) return;
        var bodies = Composite.allBodies(engine.world).filter(function (b) { return !b.isStatic; });
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            var dx = centerX - body.position.x;
            var dy = centerY - body.position.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 1) {
                var force = 0.0008 * body.mass;
                Body.applyForce(body, body.position, {
                    x: (dx / dist) * force,
                    y: (dy / dist) * force
                });
            }
            var maxDist = playRadius - (body.circleRadius || 20);
            if (dist > maxDist) {
                var angle = Math.atan2(dy, dx);
                Body.setPosition(body, {
                    x: centerX + Math.cos(angle) * maxDist,
                    y: centerY + Math.sin(angle) * maxDist
                });
                var vel = body.velocity;
                var radialVel = (dx * vel.x + dy * vel.y) / dist;
                if (radialVel > 0) {
                    Body.setVelocity(body, {
                        x: vel.x - (dx / dist) * radialVel * 1.5,
                        y: vel.y - (dy / dist) * radialVel * 1.5
                    });
                }
            }
        }
    }

    function checkGameOver() {
        if (gameOver || !engine) return;
        var bodies = Composite.allBodies(engine.world).filter(function (b) { return !b.isStatic; });
        if (bodies.length === 0) return;
        var threshold = playRadius * 0.65;
        var anyOver = false;
        for (var i = 0; i < bodies.length; i++) {
            if (getDistance(bodies[i]) > threshold) { anyOver = true; break; }
        }
        if (anyOver) {
            if (!overTimer) {
                overTimer = setTimeout(function () { if (!gameOver) endGame(); }, 3000);
            }
        } else if (overTimer) {
            clearTimeout(overTimer);
            overTimer = null;
        }
    }

    function shootFruit() {
        if (!canShoot || gameOver || isPaused || !gameStarted || !engine) return;
        canShoot = false;
        var spawnDist = playRadius * 0.92;
        var x = centerX + Math.cos(aimAngle) * spawnDist;
        var y = centerY + Math.sin(aimAngle) * spawnDist;
        var body = createFruitBody(currentFruitIndex, x, y);
        var speed = 6;
        Body.setVelocity(body, {
            x: Math.cos(aimAngle + Math.PI) * speed,
            y: Math.sin(aimAngle + Math.PI) * speed
        });
        Composite.add(engine.world, body);
        playDropSound();
        currentFruitIndex = nextFruitIndex;
        nextFruitIndex = Math.floor(Math.random() * 4);
        updateNextPreview();
        setTimeout(function () { canShoot = true; }, 150);
    }

    function addScore(points, x, y) {
        var now = Date.now();
        if (now - lastComboTime < 800) { comboCount++; } else { comboCount = 1; }
        lastComboTime = now;
        var multiplier = Math.max(1, comboCount * 0.5);
        var gained = Math.floor(points * multiplier);
        score += gained;
        document.getElementById('current-score').textContent = score;
        if (score > bestScore) {
            bestScore = score;
            document.getElementById('best-score').textContent = bestScore;
            saveProgress();
        }
        if (comboCount > 1) showCombo(multiplier, x, y);
    }

    function showCombo(multiplier, x, y) {
        var el = document.getElementById('combo-text');
        el.textContent = 'COMBO x' + multiplier.toFixed(1);
        el.classList.remove('hidden');
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.opacity = '1';
        el.style.transform = 'translate(-50%, -50%) scale(1)';
        setTimeout(function () {
            el.style.opacity = '0';
            el.style.transform = 'translate(-50%, -50%) scale(1.45)';
            setTimeout(function () { el.classList.add('hidden'); }, 400);
        }, 600);
    }

    function spawnMergeParticles(x, y, color) {
        for (var i = 0; i < 12; i++) {
            var angle = (Math.PI * 2 / 12) * i;
            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * (2 + Math.random() * 4),
                vy: Math.sin(angle) * (2 + Math.random() * 4),
                life: 1, color: color, size: 3 + Math.random() * 4
            });
        }
    }

    function updateParticles() {
        particles = particles.filter(function (p) {
            p.x += p.vx; p.y += p.vy;
            p.vx *= 0.96; p.vy *= 0.96;
            p.life -= 0.035;
            return p.life > 0;
        });
    }

    function drawParticles() {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function drawPlayfield() {
        ctx.save();
        var grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, playRadius);
        grad.addColorStop(0, 'rgba(255, 240, 245, 0.15)');
        grad.addColorStop(1, 'rgba(255, 182, 193, 0.04)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, playRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(244, 143, 177, 0.5)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 8]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, playRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = 'rgba(255, 138, 128, 0.35)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, playRadius * 0.65, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        for (var i = 0; i < 12; i++) {
            var a = (Math.PI * 2 / 12) * i;
            ctx.fillStyle = 'rgba(244, 143, 177, 0.35)';
            ctx.beginPath();
            ctx.arc(centerX + Math.cos(a) * playRadius, centerY + Math.sin(a) * playRadius, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function drawFruitSprite(fruit, skinId, cx, cy, alpha) {
        var img = FRUIT_IMAGES[fruit.name];
        var skin = getSkinDef(skinId || 'classic');
        var s = (fruit.drawScale || 2.2) * fruitScale;
        var size = fruit.radius * s;
        var yOff = fruit.yOffset ? size * fruit.yOffset : 0;
        ctx.save();
        ctx.globalAlpha = alpha == null ? 1 : alpha;
        if (skin.glow) {
            ctx.shadowColor = skin.glow;
            ctx.shadowBlur = 14;
        } else {
            ctx.shadowColor = 'rgba(0,0,0,0.15)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetY = 3;
        }
        if (skin.filter) ctx.filter = skin.filter;
        if (img) {
            ctx.drawImage(img, cx - size / 2, cy - size / 2 + yOff, size, size);
        } else {
            ctx.fillStyle = fruit.color;
            ctx.beginPath();
            ctx.arc(cx, cy, fruit.radius * fruitScale, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function drawAimLine() {
        if (!canShoot || gameOver || !gameStarted) return;
        var spawnDist = playRadius * 0.92;
        var sx = centerX + Math.cos(aimAngle) * spawnDist;
        var sy = centerY + Math.sin(aimAngle) * spawnDist;
        ctx.save();
        ctx.strokeStyle = 'rgba(244, 143, 177, 0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        var lineLen = playRadius * 0.5;
        ctx.lineTo(sx + Math.cos(aimAngle + Math.PI) * lineLen, sy + Math.sin(aimAngle + Math.PI) * lineLen);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        var fruit = FRUITS[currentFruitIndex];
        drawFruitSprite(fruit, getEquippedSkin(fruit.name), sx, sy, 0.85);
    }

    function drawFruits() {
        if (!engine) return;
        var bodies = Composite.allBodies(engine.world).filter(function (b) { return !b.isStatic; });
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            if (body.fruitIndex === undefined) continue;
            var fruit = FRUITS[body.fruitIndex];
            var skinId = body.skinId || getEquippedSkin(fruit.name);
            var img = FRUIT_IMAGES[fruit.name];
            var skin = getSkinDef(skinId);
            var s = (fruit.drawScale || 2.2) * fruitScale;
            var size = fruit.radius * s;
            var yOff = fruit.yOffset ? size * fruit.yOffset : 0;
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle);
            if (skin.glow) {
                ctx.shadowColor = skin.glow;
                ctx.shadowBlur = 14;
            } else {
                ctx.shadowColor = 'rgba(0,0,0,0.15)';
                ctx.shadowBlur = 8;
                ctx.shadowOffsetY = 3;
            }
            if (skin.filter) ctx.filter = skin.filter;
            if (img) {
                ctx.drawImage(img, -size / 2, -size / 2 + yOff, size, size);
            } else {
                ctx.fillStyle = fruit.color;
                ctx.beginPath();
                ctx.arc(0, 0, fruit.radius * fruitScale, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function drawBackground() {
        var grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#fff2f6');
        grad.addColorStop(0.3, '#ffd1dc');
        grad.addColorStop(0.6, '#fffde6');
        grad.addColorStop(1, '#eafaf1');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
    }

    function gameLoop() {
        if (gameOver || isPaused) return;
        applyCenterGravity();
        checkGameOver();
        updateParticles();
        ctx.clearRect(0, 0, W, H);
        drawBackground();
        drawPlayfield();
        drawAimLine();
        drawFruits();
        drawParticles();
        rafId = requestAnimationFrame(gameLoop);
    }

    /* ─── GameplayAPI helpers ─── */
    function gameplayStart() {
        if (gameplayActive) return;
        gameplayActive = true;
        if (ysdk && ysdk.features && ysdk.features.GameplayAPI) {
            try { ysdk.features.GameplayAPI.start(); } catch (e) { /* ignore */ }
        }
    }

    function gameplayStop() {
        if (!gameplayActive) return;
        gameplayActive = false;
        if (ysdk && ysdk.features && ysdk.features.GameplayAPI) {
            try { ysdk.features.GameplayAPI.stop(); } catch (e) { /* ignore */ }
        }
    }

    function pauseGameplayForPlatform() {
        if (runner) Runner.stop(runner);
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        suspendAudio();
        gameplayStop();
    }

    function resumeGameplayFromPlatform() {
        resumeAudio();
        if (gameStarted && !gameOver && !isPaused && engine) {
            if (runner) Runner.run(runner, engine);
            if (!rafId) gameLoop();
            gameplayStart();
        }
    }

    function startGame() {
        document.getElementById('start-overlay').classList.add('hidden');
        document.getElementById('game-over-overlay').classList.add('hidden');
        document.getElementById('pause-overlay').classList.add('hidden');
        document.getElementById('shop-overlay').classList.add('hidden');
        score = 0;
        pendingCoins = 0;
        rewardClaimed = false;
        runCoinsFinalized = false;
        continueUsed = false;
        isPaused = false;
        comboCount = 0;
        lastComboTime = 0;
        gameOver = false;
        gameStarted = true;
        overTimer = null;
        canShoot = true;
        particles = [];
        if (rafId) cancelAnimationFrame(rafId);
        document.getElementById('current-score').textContent = '0';
        var multBtn = document.getElementById('multiply-btn');
        multBtn.disabled = false;
        multBtn.textContent = t('x2reward');
        var contBtn = document.getElementById('continue-btn');
        contBtn.disabled = false;
        contBtn.classList.remove('hidden');
        contBtn.textContent = t('continueAd');
        initEngine();
        currentFruitIndex = Math.floor(Math.random() * 4);
        nextFruitIndex = Math.floor(Math.random() * 4);
        updateNextPreview();
        gameplayStart();
        gameLoop();
    }

    function clearWorld() {
        if (overTimer) { clearTimeout(overTimer); overTimer = null; }
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (runner) { Runner.stop(runner); runner = null; }
        if (engine) { Engine.clear(engine); engine = null; }
    }

    /**
     * Award run coins once.
     * @param {{ half?: boolean }} [opts] half = quit from pause (×0.5)
     */
    function finalizeRunCoins(opts) {
        if (runCoinsFinalized) return;
        runCoinsFinalized = true;
        var half = !!(opts && opts.half);
        pendingCoins = coinsFromScore(score, half);
        if (rewardClaimed && !half) pendingCoins *= 2;
        coins += pendingCoins;
        var earnedEl = document.getElementById('coins-earned');
        if (earnedEl) earnedEl.textContent = pendingCoins;
        updateCoinsUI();
        saveProgress();
    }

    function goToMenu(options) {
        options = options || {};
        /* awardCoins: true on game-over exit; half on pause quit */
        if (options.awardCoins) {
            finalizeRunCoins({ half: !!options.half });
        }
        isPaused = false;
        gameplayStop();
        gameOver = true;
        gameStarted = false;
        clearWorld();
        ctx.clearRect(0, 0, W, H);
        drawBackground();
        drawPlayfield();
        document.getElementById('game-over-overlay').classList.add('hidden');
        document.getElementById('pause-overlay').classList.add('hidden');
        document.getElementById('shop-overlay').classList.add('hidden');
        document.getElementById('start-overlay').classList.remove('hidden');
        updateCoinsUI();

        if (options.countGame) {
            gamesPlayed++;
            saveProgress();
            if (gamesPlayed % 3 === 0) {
                showInterstitial();
            }
        }
    }

    function openPause() {
        if (!gameStarted || gameOver || isPaused) return;
        isPaused = true;
        if (overTimer) { clearTimeout(overTimer); overTimer = null; }
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (runner) Runner.stop(runner);
        gameplayStop();
        /* freeze last frame under overlay */
        document.getElementById('pause-overlay').classList.remove('hidden');
    }

    function resumeFromPause() {
        if (!isPaused || !engine) return;
        isPaused = false;
        document.getElementById('pause-overlay').classList.add('hidden');
        gameStarted = true;
        gameOver = false;
        canShoot = true;
        if (runner) Runner.run(runner, engine);
        else {
            runner = Runner.create();
            Runner.run(runner, engine);
        }
        gameplayStart();
        if (!rafId) gameLoop();
    }

    function exitFromPause() {
        if (!isPaused) return;
        goToMenu({ awardCoins: true, half: true, countGame: true });
    }

    function endGame() {
        isPaused = false;
        document.getElementById('pause-overlay').classList.add('hidden');
        gameOver = true;
        gameStarted = false;
        if (overTimer) { clearTimeout(overTimer); overTimer = null; }
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        if (runner) Runner.stop(runner);
        gameplayStop();

        /* Preview only — coins are granted on leave / restart */
        var preview = coinsFromScore(score, false);
        if (rewardClaimed) preview *= 2;
        pendingCoins = preview;
        document.getElementById('final-score').textContent = score;
        document.getElementById('coins-earned').textContent = pendingCoins;
        var multBtn = document.getElementById('multiply-btn');
        multBtn.disabled = pendingCoins <= 0 || rewardClaimed;
        multBtn.textContent = t('x2reward');

        var contBtn = document.getElementById('continue-btn');
        if (continueUsed) {
            contBtn.classList.add('hidden');
            contBtn.disabled = true;
        } else {
            contBtn.classList.remove('hidden');
            contBtn.disabled = false;
            contBtn.textContent = t('continueAd');
        }

        document.getElementById('game-over-overlay').classList.remove('hidden');
        /* Keep best score saved even if player force-closes */
        if (score > bestScore) {
            bestScore = score;
            document.getElementById('best-score').textContent = bestScore;
            saveProgress();
        }
    }

    function applyDoubleCoins() {
        if (rewardClaimed || runCoinsFinalized) return;
        var base = coinsFromScore(score, false);
        if (base <= 0) return;
        rewardClaimed = true;
        pendingCoins = base * 2;
        document.getElementById('coins-earned').textContent = pendingCoins;
        document.getElementById('multiply-btn').disabled = true;
    }

    /** Pull dangerous outer fruits inward so the run can continue. */
    function rescuePlayfield() {
        if (!engine) return;
        var safe = playRadius * 0.48;
        var bodies = Composite.allBodies(engine.world).filter(function (b) { return !b.isStatic; });
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            var dx = body.position.x - centerX;
            var dy = body.position.y - centerY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > safe) {
                var a = Math.atan2(dy, dx);
                var target = Math.max(safe * 0.7, body.circleRadius || 14);
                Body.setPosition(body, {
                    x: centerX + Math.cos(a) * target,
                    y: centerY + Math.sin(a) * target
                });
                Body.setVelocity(body, { x: 0, y: 0 });
                Body.setAngularVelocity(body, 0);
            }
        }
    }

    function continueGame() {
        if (continueUsed || !engine) return;
        continueUsed = true;
        isPaused = false;
        document.getElementById('game-over-overlay').classList.add('hidden');
        document.getElementById('pause-overlay').classList.add('hidden');
        document.getElementById('continue-btn').classList.add('hidden');
        rescuePlayfield();
        if (overTimer) { clearTimeout(overTimer); overTimer = null; }
        gameOver = false;
        gameStarted = true;
        canShoot = true;
        if (runner) Runner.run(runner, engine);
        else {
            runner = Runner.create();
            Runner.run(runner, engine);
        }
        gameplayStart();
        if (!rafId) gameLoop();
    }

    function restartFromGameOver() {
        finalizeRunCoins({ half: false });
        gamesPlayed++;
        saveProgress();
        if (gamesPlayed % 3 === 0) {
            showInterstitial();
        }
        startGame();
    }

    function scrollFruitTabIntoView() {
        var tabs = document.getElementById('fruit-tabs');
        if (!tabs) return;
        var active = tabs.querySelector('.fruit-tab.active');
        if (active && typeof active.scrollIntoView === 'function') {
            active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    function shiftShopFruit(delta) {
        var next = selectedShopFruit + delta;
        if (next < 0 || next >= FRUITS.length) return;
        selectedShopFruit = next;
        renderShop();
        scrollFruitTabIntoView();
    }

    function updateNextPreview() {
        var preview = document.getElementById('next-fruit-preview');
        var fruit = FRUITS[nextFruitIndex];
        var img = FRUIT_IMAGES[fruit.name];
        var skin = getSkinDef(getEquippedSkin(fruit.name));
        preview.innerHTML = '';
        if (img) {
            var imgEl = document.createElement('img');
            imgEl.src = img.src;
            imgEl.alt = fruit.name;
            if (skin.filter) imgEl.style.filter = skin.filter;
            preview.appendChild(imgEl);
        } else {
            var div = document.createElement('div');
            div.style.cssText = 'width:40px;height:40px;border-radius:50%;background:' + fruit.color + ';box-shadow:0 3px 8px rgba(0,0,0,0.2);';
            preview.appendChild(div);
        }
    }

    function updateCoinsUI() {
        var c = String(coins);
        var hud = document.getElementById('hud-coins');
        var menu = document.getElementById('menu-coins');
        var shop = document.getElementById('shop-coins');
        if (hud) hud.textContent = c;
        if (menu) menu.textContent = c;
        if (shop) shop.textContent = c;
        document.getElementById('best-score').textContent = bestScore;
    }

    /* ─── Persistence ─── */
    function progressPayload() {
        return {
            bestScore: bestScore,
            coins: coins,
            ownedSkins: ownedSkins,
            equippedSkins: equippedSkins,
            soundEnabled: soundEnabled,
            gamesPlayed: gamesPlayed
        };
    }

    function applyProgress(data) {
        if (!data || typeof data !== 'object') return;
        if (typeof data.bestScore === 'number') bestScore = data.bestScore;
        if (typeof data.coins === 'number') coins = data.coins;
        if (typeof data.gamesPlayed === 'number') gamesPlayed = data.gamesPlayed;
        if (typeof data.soundEnabled === 'boolean') soundEnabled = data.soundEnabled;
        if (data.ownedSkins && typeof data.ownedSkins === 'object') {
            FRUITS.forEach(function (f) {
                var list = data.ownedSkins[f.name];
                if (Array.isArray(list) && list.length) {
                    ownedSkins[f.name] = list.slice();
                    if (ownedSkins[f.name].indexOf('classic') === -1) ownedSkins[f.name].unshift('classic');
                }
            });
        }
        if (data.equippedSkins && typeof data.equippedSkins === 'object') {
            FRUITS.forEach(function (f) {
                var id = data.equippedSkins[f.name];
                if (id && isOwned(f.name, id)) equippedSkins[f.name] = id;
            });
        }
        updateCoinsUI();
        updateMuteUI();
    }

    function saveProgressLocal() {
        try {
            localStorage.setItem('fruit_orbit_save', JSON.stringify(progressPayload()));
        } catch (e) { /* ignore */ }
    }

    function loadProgressLocal() {
        try {
            var raw = localStorage.getItem('fruit_orbit_save');
            if (raw) applyProgress(JSON.parse(raw));
            else {
                var legacy = localStorage.getItem('suika_best');
                if (legacy) bestScore = parseInt(legacy, 10) || 0;
            }
        } catch (e) { /* ignore */ }
    }

    function saveProgress() {
        saveProgressLocal();
        if (player && typeof player.setData === 'function') {
            try {
                player.setData(progressPayload()).catch(function () { /* ignore */ });
            } catch (e) { /* ignore */ }
        }
    }

    /* ─── Shop ─── */
    function showShopToast(msg) {
        var el = document.getElementById('shop-toast');
        el.textContent = msg;
        el.classList.remove('hidden');
        if (shopToastTimer) clearTimeout(shopToastTimer);
        shopToastTimer = setTimeout(function () { el.classList.add('hidden'); }, 1600);
    }

    function openShop() {
        document.getElementById('start-overlay').classList.add('hidden');
        document.getElementById('shop-overlay').classList.remove('hidden');
        selectedShopFruit = 0;
        renderShop();
        updateCoinsUI();
    }

    function closeShop() {
        document.getElementById('shop-overlay').classList.add('hidden');
        document.getElementById('start-overlay').classList.remove('hidden');
    }

    function renderShop() {
        var tabs = document.getElementById('fruit-tabs');
        var list = document.getElementById('skin-list');
        tabs.innerHTML = '';
        list.innerHTML = '';

        var prevBtn = document.getElementById('fruit-tab-prev');
        var nextBtn = document.getElementById('fruit-tab-next');
        if (prevBtn) prevBtn.disabled = selectedShopFruit <= 0;
        if (nextBtn) nextBtn.disabled = selectedShopFruit >= FRUITS.length - 1;

        FRUITS.forEach(function (fruit, idx) {
            var tab = document.createElement('button');
            tab.type = 'button';
            tab.className = 'fruit-tab' + (idx === selectedShopFruit ? ' active' : '');
            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-selected', idx === selectedShopFruit ? 'true' : 'false');
            var img = FRUIT_IMAGES[fruit.name];
            if (img) {
                var im = document.createElement('img');
                im.src = img.src;
                im.alt = t('fruit_' + fruit.name);
                var eq = getSkinDef(getEquippedSkin(fruit.name));
                if (eq.filter) im.style.filter = eq.filter;
                tab.appendChild(im);
            } else {
                tab.textContent = fruit.name.charAt(0).toUpperCase();
            }
            tab.title = t('fruit_' + fruit.name);
            tab.addEventListener('click', function (e) {
                e.preventDefault();
                selectedShopFruit = idx;
                renderShop();
                scrollFruitTabIntoView();
            });
            tabs.appendChild(tab);
        });

        /* ensure active tab is visible after re-render */
        requestAnimationFrame(scrollFruitTabIntoView);

        var fruit = FRUITS[selectedShopFruit];
        var title = document.createElement('div');
        title.className = 'skin-fruit-title';
        title.textContent = t('fruit_' + fruit.name);
        list.appendChild(title);

        SKIN_CATALOG.forEach(function (skin) {
            var price = skinPrice(selectedShopFruit, skin.price);
            var owned = isOwned(fruit.name, skin.id);
            var equipped = getEquippedSkin(fruit.name) === skin.id;

            var card = document.createElement('div');
            card.className = 'skin-card' + (equipped ? ' equipped' : '') + (owned ? ' owned' : '');

            var preview = document.createElement('div');
            preview.className = 'skin-preview';
            if (FRUIT_IMAGES[fruit.name]) {
                var pimg = document.createElement('img');
                pimg.src = FRUIT_IMAGES[fruit.name].src;
                pimg.alt = t(skin.nameKey);
                if (skin.filter) pimg.style.filter = skin.filter;
                preview.appendChild(pimg);
            }
            card.appendChild(preview);

            var info = document.createElement('div');
            info.className = 'skin-info';
            var nameEl = document.createElement('div');
            nameEl.className = 'skin-name';
            nameEl.textContent = t(skin.nameKey);
            info.appendChild(nameEl);

            var priceEl = document.createElement('div');
            priceEl.className = 'skin-price';
            if (price === 0) priceEl.textContent = t('free');
            else if (owned) priceEl.textContent = t('owned');
            else priceEl.textContent = '🪙 ' + price;
            info.appendChild(priceEl);
            card.appendChild(info);

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'skin-action-btn';
            if (equipped) {
                btn.textContent = t('equipped');
                btn.disabled = true;
                btn.classList.add('is-equipped');
            } else if (owned) {
                btn.textContent = t('equip');
                btn.classList.add('is-equip');
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    equippedSkins[fruit.name] = skin.id;
                    saveProgress();
                    showShopToast(t('equippedToast'));
                    renderShop();
                    updateNextPreview();
                });
            } else {
                btn.textContent = t('buy') + ' · ' + price;
                btn.classList.add('is-buy');
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (coins < price) {
                        showShopToast(t('notEnough'));
                        return;
                    }
                    coins -= price;
                    if (!ownedSkins[fruit.name]) ownedSkins[fruit.name] = ['classic'];
                    if (ownedSkins[fruit.name].indexOf(skin.id) === -1) {
                        ownedSkins[fruit.name].push(skin.id);
                    }
                    equippedSkins[fruit.name] = skin.id;
                    saveProgress();
                    updateCoinsUI();
                    showShopToast(t('bought'));
                    renderShop();
                    updateNextPreview();
                });
            }
            card.appendChild(btn);
            list.appendChild(card);
        });
    }

    /* ─── Ads ─── */
    function showInterstitial() {
        if (!ysdk || !ysdk.adv || typeof ysdk.adv.showFullscreen !== 'function') return;
        pauseGameplayForPlatform();
        try {
            ysdk.adv.showFullscreen({
                callbacks: {
                    onClose: function () {
                        resumeAudio();
                    },
                    onError: function () {
                        resumeAudio();
                    }
                }
            });
        } catch (e) {
            resumeAudio();
        }
    }

    function showRewarded(onReward, onDone) {
        function done() {
            if (typeof onDone === 'function') onDone();
        }
        if (!ysdk || !ysdk.adv || typeof ysdk.adv.showRewardedVideo !== 'function') {
            /* Local/dev fallback without SDK */
            if (typeof onReward === 'function') onReward();
            done();
            return;
        }
        pauseGameplayForPlatform();
        try {
            ysdk.adv.showRewardedVideo({
                callbacks: {
                    onOpen: function () {
                        suspendAudio();
                    },
                    onRewarded: function () {
                        if (typeof onReward === 'function') onReward();
                    },
                    onClose: function () {
                        resumeAudio();
                        done();
                    },
                    onError: function () {
                        resumeAudio();
                        done();
                    }
                }
            });
        } catch (e) {
            resumeAudio();
            done();
        }
    }

    function showRewardedForDoubleCoins() {
        if (rewardClaimed || runCoinsFinalized) return;
        showRewarded(applyDoubleCoins);
    }

    function showRewardedForContinue() {
        if (continueUsed) return;
        showRewarded(continueGame);
    }

    function showRewardedForShopCoins() {
        if (shopAdBusy) return;
        shopAdBusy = true;
        var btn = document.getElementById('shop-ad-btn');
        if (btn) btn.disabled = true;
        showRewarded(function () {
            coins += SHOP_AD_COINS;
            updateCoinsUI();
            saveProgress();
            showShopToast(t('shopAdGot'));
        }, function () {
            shopAdBusy = false;
            if (btn) {
                btn.disabled = false;
                btn.textContent = t('shopAdReward');
            }
        });
    }

    /* ─── Input ─── */
    function setupInput() {
        function canvasCoords(clientX, clientY) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: (clientX - rect.left) * (canvas.width / rect.width),
                y: (clientY - rect.top) * (canvas.height / rect.height)
            };
        }

        function getAngle(cx, cy) { return Math.atan2(cy - centerY, cx - centerX); }

        function aimFromClient(clientX, clientY) {
            var c = canvasCoords(clientX, clientY);
            aimAngle = getAngle(c.x, c.y);
        }

        canvas.addEventListener('mousemove', function (e) {
            if (!gameStarted || isPaused || gameOver) return;
            aimFromClient(e.clientX, e.clientY);
        });
        canvas.addEventListener('click', function (e) {
            if (!gameStarted || isPaused || gameOver) return;
            aimFromClient(e.clientX, e.clientY);
            shootFruit();
        });
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            if (!gameStarted || isPaused || gameOver) return;
            aimFromClient(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        canvas.addEventListener('touchend', function (e) {
            e.preventDefault();
            if (!gameStarted || isPaused || gameOver) return;
            if (e.changedTouches && e.changedTouches[0]) {
                aimFromClient(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            }
            shootFruit();
        }, { passive: false });

        /* Prevent context menu / text selection on long press */
        document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
        document.addEventListener('selectstart', function (e) { e.preventDefault(); });
    }

    /* ─── Yandex SDK ─── */
    function initYandexSDK(done) {
        if (typeof YaGames === 'undefined') {
            done();
            return;
        }
        YaGames.init().then(function (sdk) {
            ysdk = sdk;

            try {
                var sdkLang = ysdk.environment && ysdk.environment.i18n && ysdk.environment.i18n.lang;
                if (sdkLang && String(sdkLang).toLowerCase().indexOf('en') === 0) lang = 'en';
                else lang = 'ru';
            } catch (e) {
                lang = 'ru';
            }
            applyI18n();

            if (typeof ysdk.on === 'function') {
                ysdk.on('game_api_pause', function () {
                    pauseGameplayForPlatform();
                });
                ysdk.on('game_api_resume', function () {
                    resumeGameplayFromPlatform();
                });
            }

            ysdk.getPlayer({ scopes: false }).then(function (p) {
                player = p;
                return player.getData();
            }).then(function (data) {
                if (data && (data.bestScore != null || data.coins != null || data.ownedSkins)) {
                    applyProgress(data);
                }
            }).catch(function () { /* guest / no cloud — local ok */ })
                .finally(function () { done(); });
        }).catch(function () {
            done();
        });
    }

    function markGameReady() {
        if (ysdk && ysdk.features && ysdk.features.LoadingAPI) {
            try { ysdk.features.LoadingAPI.ready(); } catch (e) { /* ignore */ }
        }
    }

    function init() {
        resize();
        loadProgressLocal();
        updateCoinsUI();
        updateMuteUI();
        applyI18n();
        setupInput();
        window.addEventListener('resize', resize);

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                suspendAudio();
                if (gameStarted && !gameOver && !isPaused) {
                    if (runner) Runner.stop(runner);
                    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
                    gameplayStop();
                }
            } else {
                resumeAudio();
                /* Don't auto-unpause user pause menu */
                if (gameStarted && !gameOver && !isPaused && engine) {
                    if (runner) Runner.run(runner, engine);
                    if (!rafId) gameLoop();
                    gameplayStart();
                }
            }
        });

        document.getElementById('play-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            startGame();
        });
        document.getElementById('restart-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            restartFromGameOver();
        });
        document.getElementById('continue-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showRewardedForContinue();
        });
        document.getElementById('multiply-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showRewardedForDoubleCoins();
        });
        document.getElementById('go-menu-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            goToMenu({ awardCoins: true, half: false, countGame: true });
        });
        document.getElementById('menu-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openPause();
        });
        document.getElementById('pause-resume-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            resumeFromPause();
        });
        document.getElementById('pause-exit-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            exitFromPause();
        });
        document.getElementById('shop-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openShop();
        });
        document.getElementById('shop-close-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeShop();
        });
        document.getElementById('shop-ad-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            showRewardedForShopCoins();
        });
        document.getElementById('fruit-tab-prev').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            shiftShopFruit(-1);
        });
        document.getElementById('fruit-tab-next').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            shiftShopFruit(1);
        });
        var fruitTabsEl = document.getElementById('fruit-tabs');
        if (fruitTabsEl) {
            fruitTabsEl.addEventListener('wheel', function (e) {
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    e.preventDefault();
                    fruitTabsEl.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        }
        document.getElementById('mute-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            soundEnabled = !soundEnabled;
            updateMuteUI();
            if (soundEnabled) resumeAudio();
            else suspendAudio();
            saveProgress();
        });

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', resize);
        }

        loadFruitImages(function () {
            updateNextPreview();
            initYandexSDK(function () {
                updateCoinsUI();
                updateMuteUI();
                applyI18n();
                var shopAd = document.getElementById('shop-ad-btn');
                if (shopAd) shopAd.textContent = t('shopAdReward');
                ctx.clearRect(0, 0, W, H);
                drawBackground();
                drawPlayfield();
                /* Menu is visible — player can start → LoadingAPI.ready() */
                markGameReady();
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
