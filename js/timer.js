class Monster {
    constructor(name, health, attackPower) {
        this.name = name;
        this.health = health;
        this.attackPower = attackPower;
    }

    attack(target) {
        if (this.health > 0) {
            let damage = Math.floor(Math.random() * this.attackPower) + 1;
            target.health -= damage;
            console.log(`${this.name} attacks ${target.name} for ${damage} damage!`);
        }
    }
}

class Battle {
    constructor(player, enemy, duration) {
        this.player = player;
        this.enemy = enemy;
        this.duration = duration;
        this.timer = duration;
        this.turn = true; // true for player, false for enemy
    }

    start() {
        console.log(`Battle starts! ${this.player.name} vs ${this.enemy.name}`);
        this.battleInterval = setInterval(() => {
            if (this.timer <= 0 || this.player.health <= 0 || this.enemy.health <= 0) {
                clearInterval(this.battleInterval);
                this.endBattle();
                return;
            }
            this.takeTurn();
            this.timer -= 2;
        }, 2000);
    }

    takeTurn() {
        if (this.turn) {
            this.player.attack(this.enemy);
        } else {
            this.enemy.attack(this.player);
        }
        this.turn = !this.turn;
        this.displayHealth();
    }

    displayHealth() {
        console.log(`${this.player.name} HP: ${this.player.health} | ${this.enemy.name} HP: ${this.enemy.health}`);
    }

    endBattle() {
        if (this.player.health <= 0) {
            console.log(`${this.player.name} has been defeated!`);
        } else if (this.enemy.health <= 0) {
            console.log(`${this.enemy.name} has been defeated! Enemy will return stronger after a short break.`);
            setTimeout(() => {
                this.enemy.health = 100 + (this.duration - this.timer);
                console.log(`A new enemy appears with ${this.enemy.health} HP!`);
                this.timer = this.duration;
                this.start();
            }, 3000);
        } else {
            console.log("Time's up! Battle ends.");
        }
    }
}

// Example usage
const playerMonster = new Monster("PlayerMonster", 300, 20);
const enemyMonster = new Monster("EnemyMonster", 100, 15);
const battle = new Battle(playerMonster, enemyMonster, 30);
battle.start();
