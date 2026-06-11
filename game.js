(() => {
    const { Engine, Runner, Bodies, Body, Composite, Events } = Matter;

    const FRUITS = [
        { name: 'cherry', radius: 14, color: '#e53935', points: 1, drawScale: 2.8, yOffset: -0.08 },
        { name: 'strawberry', radius: 20, color: '#e91e63', points: 2, drawScale: 2.7, yOffset: -0.05 },
        { name: 'grape', radius: 26, color: '#7b1fa2', points: 4, drawScale: 2.5, yOffset: -0.04 },
        { name: 'mandarin', radius: 30, color: '#f57c00', points: 8, drawScale: 2.8, yOffset: -0.08 },
        { name: 'persimmon', radius: 36, color: '#e64a19', points: 16, drawScale: 2.8, yOffset: -0.06 },
        { name: 'apple', radius: 40, color: '#c62828', points: 32, drawScale: 2.8, yOffset: -0.08 },
        { name: 'pear', radius: 44, color: '#9e9d24', points: 64, drawScale: 2.7, yOffset: -0.12 },
        { name: 'peach', radius: 48, color: '#ff8a65', points: 128, drawScale: 2.7, yOffset: -0.06 },
        { name: 'pineapple', radius: 54, color: '#f9a825', points: 256, drawScale: 3.1, yOffset: -0.18 },
        { name: 'melon', radius: 58, color: '#388e3c', points: 512, drawScale: 2.6, yOffset: -0.05 },
        { name: 'watermelon', radius: 66, color: '#2e7d32', points: 1024, drawScale: 2.5, yOffset: -0.02 }
    ];

    const FRUIT_IMAGES = {};
    let loadCount = 0;

    function loadFruitImages(callback) {
        FRUITS.forEach((f) => {
            const img = new Image();
            img.onload = () => { FRUIT_IMAGES[f.name] = img; loadCount++; if (loadCount === FRUITS.length) callback(); };
            img.onerror = () => { loadCount++; if (loadCount === FRUITS.length) callback(); };
            img.src = 'fruits/' + f.name + '.svg';
        });
    }

    let engine = null;
    let runner = null;
    let canvas, ctx;
    let W, H, centerX, centerY, playRadius;
    let score = 0, bestScore = 0;
    let currentFruitIndex = 0, nextFruitIndex = 0;
    let aimAngle = -Math.PI / 2;
    let canShoot = true;
    let gameOver = false;
    let gameStarted = false;
    let overTimer = null;
    let comboCount = 0;
    let lastComboTime = 0;
    let ysdk = null;
    let particles = [];
    let rafId = null;

    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        centerX = W / 2;
        centerY = H / 2;
        playRadius = Math.min(W, H) * 0.38;
    }

    function createFruitBody(index, x, y) {
        const fruit = FRUITS[index];
        const body = Bodies.circle(x, y, fruit.radius, {
            restitution: 0.2,
            friction: 0.5,
            density: 0.002,
            frictionAir: 0.01
        });
        body.fruitIndex = index;
        return body;
    }

    function mergeFruits(bodyA, bodyB) {
        if (bodyA.fruitIndex !== bodyB.fruitIndex) return false;
        if (bodyA.fruitIndex >= FRUITS.length - 1) return false;
        const newIdx = bodyA.fruitIndex + 1;
        const mx = (bodyA.position.x + bodyB.position.x) / 2;
        const my = (bodyA.position.y + bodyB.position.y) / 2;
        Composite.remove(engine.world, bodyA);
        Composite.remove(engine.world, bodyB);
        const newBody = createFruitBody(newIdx, mx, my);
        Body.setVelocity(newBody, { x: 0, y: 0 });
        Composite.add(engine.world, newBody);
        addScore(FRUITS[newIdx].points, mx, my);
        spawnMergeParticles(mx, my, FRUITS[newIdx].color);
        return true;
    }

    function initEngine() {
        engine = Engine.create({ gravity: { x: 0, y: 0 } });

        Events.on(engine, 'collisionStart', function (event) {
            for (let i = 0; i < event.pairs.length; i++) {
                const pair = event.pairs[i];
                if (pair.bodyA.fruitIndex !== undefined && pair.bodyB.fruitIndex !== undefined) {
                    mergeFruits(pair.bodyA, pair.bodyB);
                }
            }
        });

        const wallOptions = { isStatic: true, restitution: 0.3, friction: 0.1 };
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
        const dx = body.position.x - centerX;
        const dy = body.position.y - centerY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function applyCenterGravity() {
        const bodies = Composite.allBodies(engine.world).filter(function (b) { return !b.isStatic; });
        for (let i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            const dx = centerX - body.position.x;
            const dy = centerY - body.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > 1) {
                const force = 0.0008 * body.mass;
                Body.applyForce(body, body.position, {
                    x: (dx / dist) * force,
                    y: (dy / dist) * force
                });
            }
            const maxDist = playRadius - (body.circleRadius || 20);
            if (dist > maxDist) {
                const angle = Math.atan2(dy, dx);
                Body.setPosition(body, {
                    x: centerX + Math.cos(angle) * maxDist,
                    y: centerY + Math.sin(angle) * maxDist
                });
                const vel = body.velocity;
                const radialVel = (dx * vel.x + dy * vel.y) / dist;
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
        if (gameOver) return;
        const bodies = Composite.allBodies(engine.world).filter(function (b) { return !b.isStatic; });
        if (bodies.length === 0) return;
        const threshold = playRadius * 0.65;
        let anyOver = false;
        for (let i = 0; i < bodies.length; i++) {
            if (getDistance(bodies[i]) > threshold) { anyOver = true; break; }
        }
        if (anyOver) {
            if (!overTimer) {
                overTimer = setTimeout(function () { if (!gameOver) endGame(); }, 3000);
            }
        } else {
            if (overTimer) { clearTimeout(overTimer); overTimer = null; }
        }
    }

    function shootFruit() {
        if (!canShoot || gameOver || !gameStarted) return;
        canShoot = false;
        const spawnDist = playRadius * 0.92;
        const x = centerX + Math.cos(aimAngle) * spawnDist;
        const y = centerY + Math.sin(aimAngle) * spawnDist;
        const body = createFruitBody(currentFruitIndex, x, y);
        const speed = 6;
        Body.setVelocity(body, {
            x: Math.cos(aimAngle + Math.PI) * speed,
            y: Math.sin(aimAngle + Math.PI) * speed
        });
        Composite.add(engine.world, body);
        currentFruitIndex = nextFruitIndex;
        nextFruitIndex = Math.floor(Math.random() * 4);
        updateNextPreview();
        setTimeout(function () { canShoot = true; }, 100);
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
            saveBestScore();
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
        el.style.transform = 'scale(1)';
        setTimeout(function () {
            el.style.opacity = '0';
            el.style.transform = 'scale(1.5)';
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

        var fruit = FRUITS[currentFruitIndex];
        var img = FRUIT_IMAGES[fruit.name];
        ctx.globalAlpha = 0.85;
        if (img) {
            // Применяем те же коэффициенты масштаба и смещения для превью
            var scale = fruit.drawScale || 2.2;
            var size = fruit.radius * scale;
            var yOff = fruit.yOffset ? size * fruit.yOffset : 0;

            ctx.drawImage(img, sx - size / 2, sy - size / 2 + yOff, size, size);
        } else {
            ctx.fillStyle = fruit.color;
            ctx.beginPath();
            ctx.arc(sx, sy, fruit.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    function drawFruits() {
        var bodies = Composite.allBodies(engine.world).filter(function (b) { return !b.isStatic; });
        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            if (body.fruitIndex === undefined) continue;
            var fruit = FRUITS[body.fruitIndex];
            var img = FRUIT_IMAGES[fruit.name];
            ctx.save();
            ctx.translate(body.position.x, body.position.y);
            ctx.rotate(body.angle);
            if (img) {
                // Рассчитываем размер на основе индивидуального масштаба фрукта
                var scale = fruit.drawScale || 2.2;
                var size = fruit.radius * scale;
                // Рассчитываем смещение вверх, чтобы компенсировать хвостик
                var yOff = fruit.yOffset ? size * fruit.yOffset : 0;

                ctx.shadowColor = 'rgba(0,0,0,0.15)';
                ctx.shadowBlur = 8;
                ctx.shadowOffsetY = 3;

                // Рисуем картинку со смещением yOff
                ctx.drawImage(img, -size / 2, -size / 2 + yOff, size, size);

                ctx.shadowColor = 'transparent';
            } else {
                ctx.fillStyle = fruit.color;
                ctx.beginPath();
                ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(255,255,255,0.35)';
                ctx.beginPath();
                ctx.arc(-fruit.radius * 0.25, -fruit.radius * 0.25, fruit.radius * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function gameLoop() {
        if (gameOver) return;
        applyCenterGravity();
        checkGameOver();
        updateParticles();
        ctx.clearRect(0, 0, W, H);
        drawPlayfield();
        drawAimLine();
        drawFruits();
        drawParticles();
        rafId = requestAnimationFrame(gameLoop);
    }

    function startGame() {
        document.getElementById('start-overlay').classList.add('hidden');
        document.getElementById('game-over-overlay').classList.add('hidden');
        score = 0;
        comboCount = 0;
        lastComboTime = 0;
        gameOver = false;
        gameStarted = true;
        overTimer = null;
        canShoot = true;
        particles = [];
        if (rafId) cancelAnimationFrame(rafId);
        document.getElementById('current-score').textContent = '0';
        initEngine();
        currentFruitIndex = Math.floor(Math.random() * 4);
        nextFruitIndex = Math.floor(Math.random() * 4);
        updateNextPreview();
        if (ysdk) { try { ysdk.features.LoadingAPI.ready(); } catch (e) { } }
        gameLoop();
    }

    function endGame() {
        gameOver = true;
        gameStarted = false;
        if (overTimer) { clearTimeout(overTimer); overTimer = null; }
        document.getElementById('final-score').textContent = score;
        document.getElementById('game-over-overlay').classList.remove('hidden');
        if (ysdk) { try { ysdk.features.FullscreenAPI.request(); } catch (e) { } }
    }

    function updateNextPreview() {
        var preview = document.getElementById('next-fruit-preview');
        var fruit = FRUITS[nextFruitIndex];
        var img = FRUIT_IMAGES[fruit.name];
        if (img) {
            preview.innerHTML = '';
            var imgEl = document.createElement('img');
            imgEl.src = img.src;
            preview.appendChild(imgEl);
        } else {
            preview.innerHTML = '<div style="width:40px;height:40px;border-radius:50%;background:' + fruit.color + ';box-shadow:0 3px 8px rgba(0,0,0,0.2);"></div>';
        }
    }

    function loadBestScore() {
        try { var s = localStorage.getItem('suika_best'); if (s) bestScore = parseInt(s, 10) || 0; } catch (e) { }
        document.getElementById('best-score').textContent = bestScore;
    }

    function saveBestScore() {
        try { localStorage.setItem('suika_best', bestScore.toString()); } catch (e) { }
    }

    function setupInput() {
        function getAngle(cx, cy) { return Math.atan2(cy - centerY, cx - centerX); }

        canvas.addEventListener('mousemove', function (e) {
            if (!gameStarted) return;
            aimAngle = getAngle(e.clientX, e.clientY);
        });
        canvas.addEventListener('click', function (e) {
            if (!gameStarted) return;
            aimAngle = getAngle(e.clientX, e.clientY);
            shootFruit();
        });
        canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            if (!gameStarted) return;
            aimAngle = getAngle(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: false });
        canvas.addEventListener('touchend', function (e) {
            e.preventDefault();
            if (!gameStarted) return;
            shootFruit();
        }, { passive: false });
    }

    function init() {
        resize();
        loadBestScore();
        loadFruitImages(updateNextPreview);
        setupInput();
        window.addEventListener('resize', resize);

        document.getElementById('play-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            startGame();
        });
        document.getElementById('restart-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            startGame();
        });
        document.getElementById('multiply-btn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            startGame();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();