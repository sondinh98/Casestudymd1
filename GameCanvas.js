class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.player = new Player(this.width / 2, this.height - 50, 50, 50, 5);
        this.enemies = [];
        this.enemySpeed = 2;
        this.score = 0;

        this.registerEvents();
    }

    registerEvents() {
        document.addEventListener('keydown', event => {
            if (event.keyCode === 37) { // Left arrow key
                this.player.moveLeft();
            } else if (event.keyCode === 39) { // Right arrow key
                this.player.moveRight();
            } else if (event.keyCode === 32) { // Space bar key
                this.player.shoot();
            }
        });
    }

    start() {
        setInterval(() => {
            this.update();
            this.render();
        }, 10);
        setInterval(() => {
            this.createEnemy();
        }, 1000);
    }

    update() {
        this.player.update();

        for (let i = 0; i < this.player.bullets.length; i++) {
            const bullet = this.player.bullets[i];
            bullet.update();

            for (let j = 0; j < this.enemies.length; j++) {
                const enemy = this.enemies[j];
                if (bullet.collidesWith(enemy)) {
                    this.player.bullets.splice(i, 1);
                    this.enemies.splice(j, 1);
                    this.score++;
                }
            }

            if (bullet.isOffscreen(this.width, this.height)) {
                this.player.bullets.splice(i, 1);
            }
        }

        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            enemy.update();

            if (enemy.collidesWith(this.player)) {
                alert('Game over!');
                location.reload();
            }

            if (enemy.isOffscreen(this.width, this.height)) {
                this.enemies.splice(i, 1);
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.player.draw();

        for (const bullet of this.player.bullets) {
            bullet.draw();
        }

        for (const enemy of this.enemies) {
            enemy.draw();
        }

        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    }

    createEnemy() {
        const x = Math.random() * (this.width - 50);
        const y = 0;
        const width = 50;
        const height = 50;
        const speed = this.enemySpeed;
        const enemy = new Enemy(x, y, width, height, speed);
        this.enemies.push(enemy);
    }
}

class Player {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.bullets = [];
    }

    moveLeft() {
        if (this.x > 0) {
            this.x -= this.speed;
        }
    }

    moveRight() {
        if (this.x < game.width - this.width) {
            this.x += this.speed;
        }
    }

    shoot() {
        const bullet = new Bullet(this.x + this.width / 2, this.y, 5, 10, 10);
        this.bullets.push(bullet);
    }

    update() {
        for (const bullet of this.bullets) {
            bullet.update();
        }
    }

    draw() {
        game.ctx.fillStyle = 'blue';
        game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Enemy {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    update() {
        this.y += this.speed;
    }

    draw() {
        game.ctx.fillStyle = 'red';
        game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(other) {
        const left = this.x;
        const right = this.x + this.width;
        const top = this.y;
        const bottom = this.y + this.height;

        const otherLeft = other.x;
        const otherRight = other.x + other.width;
        const otherTop = other.y;
        const otherBottom = other.y + other.height;

        return (
            left < otherRight &&
            right > otherLeft &&
            top < otherBottom &&
            bottom > otherTop
        );
    }

    isOffscreen(width, height) {
        return this.y > height;
    }
}

class Bullet {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        game.ctx.fillStyle = 'green';
        game.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    collidesWith(other) {
        const left = this.x;
        const right = this.x + this.width;
        const top = this.y;
        const bottom = this.y + this.height;

        const otherLeft = other.x;
        const otherRight = other.x + other.width;
        const otherTop = other.y;
        const otherBottom = other.y + other.height;

        return (
            left < otherRight &&
            right > otherLeft &&
            top < otherBottom &&
            bottom > otherTop
        );
    }

    isOffscreen(width, height) {
        return this.y < -this.height;
    }
}

const game = new Game('canvas');
game.start();