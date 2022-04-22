const Potion = require('../lib/Potion');

function Player(name = '') {
    this.name = name;

    this.health = Math.floor(Math.random()*10 + 95);
    this.strength = Math.floor(Math.random()*5 + 7);
    this.agility = Math.floor(Math.random()*5 + 7);
    //this will call the mocked version since potions were mocked in player.test.js
    this.inventory = [new Potion('health'), new Potion()];
}


    //returns an object with various player properties
    //the player.prototype method is better than 'this.' method because
    //using prototype you only create the method once (say if we have 100 players)
    Player.prototype.getStats = function () {
        return {
            potions: this.inventory.length,
            health: this.health,
            strength: this.strength,
            agility: this.agility
        };
    };

    //returns the inventory array or false if empty
    Player.prototype.getInventory = function () {
        if(this.inventory.length){
            return this.inventory;
        }
        return false;
    };

    Player.prototype.getHealth = function () {
        return `${this.name}'s health is now ${this.health}!`;
    };

    Player.prototype.isAlive = function () {
        if(this.health === 0) {
            return false;
        }
        return true;
    };

    Player.prototype.reduceHealth = function(health){
        this.health -= health;
        if(this.health<0) {
            this.health = 0;
        }
    };

    Player.prototype.getAttackValue = function () {
        const min=this.strength -5;
        const max=this.strength +5;

        return Math.floor(Math.random()*(max-min)+min);
    }

    Player.prototype.addPotion = function(potion){
        this.inventory.push(potion);
    };

    Player.prototype.usePotion = function(index){
        //splice(start, deleteCount, item1) delete/insert/replace an element with item1
        const potion = this.getInventory().splice(index,1)[0];
        //TA: to access the [0] element of the array after the splice.

        switch(potion.name) {
            case 'agility': 
            this.agility += potion.value;
            break;

            case 'health': 
            this.health += potion.value;
            break;

            case'strength': 
            this.strength +=potion.value;
            break;
        }
    };

module.exports = Player;