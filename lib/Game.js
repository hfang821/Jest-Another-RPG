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

Game.prototype.startNewBattle = function () {
    if(this.player.agility>this.currentEnemy.agility){
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    console.log('Your stats are as follows:');
    console.table(this.player.getStats());
    console.log(this.currentEnemy.getDescription());

    this.battle();
};

Game.prototype.battle = function () {
    if(this.isPlayerTurn){
        inquirer.prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['Attack','Use potion']
        }).then(({action})=>{
            if(action === 'Use potion'){
                if(!this.player.getInventory()){
                    console.log("You don't have potions.")
                    return this.checkEndOfBattles();
                }
            inquirer.prompt({
                type: 'list',
                message: 'Which potion would you like to use?',
                name: 'action',
                //ask Ta: how does the map work here? (what does the index:item mean here?)
                choices: this.player.getInventory().map((item,index) => `${index + 1}:${item.name}`)
            }).then (({action})=>{
                const potionDetails = action.split(': ');
                //subtract 1 to get back to the original array index.
                this.player.usePotion(potionDetails[0]-1);
                //potionDetails[1] is the name.
                console.log(`You used a ${potionDetails[1]} potion`);
                this.checkEndOfBattles();
            });
            } else {
                const damage = this.player.getAttackValue();
                this.currentEnemy.reduceHealth(damage);

                console.log(`You attacked the ${this.currentEnemy.name}`);
                console.log(this.currentEnemy.getHealth());
                this.checkEndOfBattles();
            }
        });

    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`you were attacked by the ${this.currentEnemy.name}`);
        console.log(this.player.getHealth());
        this.checkEndOfBattles();
    }
};

Game.prototype.checkEndOfBattles = function() {
    if(this.player.isAlive() && this.currentEnemy.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    } else if(this.player.isAlive() && !this.currentEnemy.isAlive()){
        console.log(`You have defeated the ${this.currentEnemy.name} `);
        this.player.addPotion(this.currentEnemy.potion);
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`)

        this.roundNumber++;

        if(this.roundNumber < this.enemies.length) {
            this.currentEnemy = this.enemies[this.roundNumber];
            this.startNewBattle();
        } else {
            console.log('You win!');
        }
    } else {
        console.log('You have been defeated.');
    }
};

module.exports = Game;