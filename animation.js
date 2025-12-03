/**
 * Origami Animation for Uncrumpled
 * Creates a generative animation representing:
 * - Origami folding/unfolding
 * - Structured squares
 * - Organic yet orderly movement
 * - Layers arranging themselves
 */

class OrigamiAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.squares = [];
        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isRunning = true;

        // Monokai colors
        this.colors = {
            bg: '#1e1f1a',
            pink: '#f92672',
            green: '#a6e22e',
            yellow: '#e6db74',
            blue: '#66d9ef',
            purple: '#ae81ff',
            orange: '#fd971f',
            white: '#f8f8f2'
        };

        this.init();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        this.resize();
        this.createSquares();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;

        this.ctx.scale(dpr, dpr);

        this.width = rect.width;
        this.height = rect.height;
    }

    createSquares() {
        this.squares = [];
        const numSquares = 40;
        const colorKeys = ['pink', 'green', 'yellow', 'blue', 'purple', 'orange'];

        for (let i = 0; i < numSquares; i++) {
            this.squares.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 20 + Math.random() * 60,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                color: this.colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]],
                opacity: 0.1 + Math.random() * 0.4,
                phaseX: Math.random() * Math.PI * 2,
                phaseY: Math.random() * Math.PI * 2,
                speedX: 0.3 + Math.random() * 0.5,
                speedY: 0.3 + Math.random() * 0.5,
                amplitudeX: 20 + Math.random() * 40,
                amplitudeY: 20 + Math.random() * 40,
                baseX: Math.random() * this.width,
                baseY: Math.random() * this.height,
                foldState: Math.random(),
                foldSpeed: 0.005 + Math.random() * 0.01,
                layer: Math.floor(Math.random() * 3)
            });
        }

        // Sort by layer for proper depth
        this.squares.sort((a, b) => a.layer - b.layer);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createSquares();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });

        // Pause animation when not visible
        document.addEventListener('visibilitychange', () => {
            this.isRunning = !document.hidden;
            if (this.isRunning) this.animate();
        });
    }

    drawFoldedSquare(square) {
        const ctx = this.ctx;
        const { x, y, size, rotation, color, opacity, foldState } = square;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        // Calculate fold effect (0 = flat, 1 = fully folded)
        const fold = Math.sin(foldState * Math.PI) * 0.5;

        // Draw the main square with perspective fold
        ctx.globalAlpha = opacity;

        // Back face (visible when folding)
        if (fold > 0.1) {
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity * 0.3;
            ctx.beginPath();
            ctx.moveTo(-size / 2, -size / 2);
            ctx.lineTo(size / 2 * (1 - fold), -size / 2);
            ctx.lineTo(size / 2 * (1 - fold), size / 2);
            ctx.lineTo(-size / 2, size / 2);
            ctx.closePath();
            ctx.fill();
        }

        // Front face
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;

        // Create origami-like fold effect
        ctx.beginPath();
        ctx.moveTo(-size / 2 * (1 - fold * 0.3), -size / 2);
        ctx.lineTo(size / 2, -size / 2 * (1 - fold * 0.5));
        ctx.lineTo(size / 2 * (1 - fold * 0.2), size / 2);
        ctx.lineTo(-size / 2, size / 2 * (1 - fold * 0.4));
        ctx.closePath();
        ctx.fill();

        // Add subtle border
        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity * 0.5;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner fold line
        if (fold > 0.05) {
            ctx.beginPath();
            ctx.moveTo(-size / 4, -size / 2);
            ctx.lineTo(size / 4, size / 2);
            ctx.globalAlpha = opacity * fold * 0.5;
            ctx.stroke();
        }

        ctx.restore();
    }

    drawGridLines() {
        const ctx = this.ctx;
        const gridSize = 80;

        ctx.strokeStyle = this.colors.white;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.03;

        // Vertical lines
        for (let x = 0; x < this.width; x += gridSize) {
            const offset = Math.sin(this.time * 0.001 + x * 0.01) * 5;
            ctx.beginPath();
            ctx.moveTo(x + offset, 0);
            ctx.lineTo(x - offset, this.height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < this.height; y += gridSize) {
            const offset = Math.cos(this.time * 0.001 + y * 0.01) * 5;
            ctx.beginPath();
            ctx.moveTo(0, y + offset);
            ctx.lineTo(this.width, y - offset);
            ctx.stroke();
        }
    }

    update() {
        this.time++;

        this.squares.forEach((square, i) => {
            // Organic movement
            square.x = square.baseX + Math.sin(this.time * 0.001 * square.speedX + square.phaseX) * square.amplitudeX;
            square.y = square.baseY + Math.cos(this.time * 0.001 * square.speedY + square.phaseY) * square.amplitudeY;

            // Subtle drift
            square.baseX += Math.sin(this.time * 0.0003 + i) * 0.1;
            square.baseY += Math.cos(this.time * 0.0003 + i) * 0.1;

            // Wrap around edges
            if (square.baseX < -square.size) square.baseX = this.width + square.size;
            if (square.baseX > this.width + square.size) square.baseX = -square.size;
            if (square.baseY < -square.size) square.baseY = this.height + square.size;
            if (square.baseY > this.height + square.size) square.baseY = -square.size;

            // Rotation
            square.rotation += square.rotationSpeed;

            // Fold animation
            square.foldState += square.foldSpeed;
            if (square.foldState > 2 * Math.PI) {
                square.foldState = 0;
            }

            // Mouse interaction - subtle attraction/repulsion
            const dx = this.mouseX - square.x;
            const dy = this.mouseY - square.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150 && dist > 0) {
                const force = (150 - dist) / 150;
                square.baseX -= (dx / dist) * force * 0.5;
                square.baseY -= (dy / dist) * force * 0.5;
            }
        });
    }

    draw() {
        const ctx = this.ctx;

        // Clear canvas
        ctx.fillStyle = this.colors.bg;
        ctx.fillRect(0, 0, this.width, this.height);

        // Draw subtle grid
        this.drawGridLines();

        // Draw squares
        this.squares.forEach(square => {
            this.drawFoldedSquare(square);
        });

        // Add vignette effect
        const gradient = ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.7
        );
        gradient.addColorStop(0, 'rgba(30, 31, 26, 0)');
        gradient.addColorStop(1, 'rgba(30, 31, 26, 0.4)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    animate() {
        if (!this.isRunning) return;

        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.isRunning = false;
    }
}

// Initialize animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('origami-canvas');
    if (canvas) {
        window.origamiAnimation = new OrigamiAnimation(canvas);
    }
});
