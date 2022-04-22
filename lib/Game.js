const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

function Game(){
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

Game.prototype.initializeGame = function() {
    this.enemies.push(new Enemy('goblin','sword'));
    this.enemies.push(new Enemy('orc','baseball bat'));
    this.enemies.push(new Enemy('skeleton','axe'));
    
    this.currentEnemy = this.enemies[0];

    inquirer.prompt({
        type: 'text',
        name: 'name',
        message: 'What is your name?'
    })
    //need to use the ES6 arrow function as the ES5 will no longer recognize 'this' in the Game Object.
    .then(({ name })=>{
        this.player=new Player(name);

        //test the object creation
        this.startNewBattle();
    });
};

module.exports = Game;