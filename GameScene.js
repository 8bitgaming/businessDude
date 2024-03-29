// Add a variable to keep count of Bob's earning
let score = 0;

// Add a variable to multiply money
const moneyMultiplier = 100;

// Add a variable to control speed of Bob sprite
let speed = 1;



// Values used to keep track of where money and paper appear
const gameState = {
  numCoordinates: {},
};
let randomCoord;

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.spritesheet('bob-front', 'assets/sprites/Bob_front-sheet.png', { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('bob-back', 'assets/sprites/Bob_back-sheet.png', { frameWidth: 80, frameHeight: 80 });
    this.load.spritesheet('bob-side', 'assets/sprites/Bob_side-sheet.png', { frameWidth: 80, frameHeight: 80 });
    this.load.image('money', 'https://content.codecademy.com/courses/learn-phaser/BOB/Money.png');
    this.load.image('paper', 'https://content.codecademy.com/courses/learn-phaser/BOB/Paperwork.png');
    // this.load.audio('cash_register', 'https://actions.google.com/sounds/v1/impacts/crash.ogg');
    this.load.audio('cash_register', 'assets/cash_register.mp3');
  }

  create() {
    // Display text showing how much cash Bob earned
    let scoreText = this.add.text(140, 610, `Earnings: $${score}`, { fontSize: '25px', fill: '#fff' });

    //create sound effect
    const soundEffects = this.sound.add('cash_register')

    // Create the Bob sprite and set boundaries for it
    gameState.player = this.physics.add.sprite(240, 500, 'bob-front').setScale(.8);
    this.physics.world.setBounds(0, 0, 480, 600);  // Slightly above score
    gameState.player.setCollideWorldBounds(true);
    gameState.player.body.collideWorldBounds = true;
    gameState.player.body.setSize(25,40,true); // Hardcoded size, unsure of the easiest way to set scale by sprite size in this

    // Create animations for Bob
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('bob-back', { end: 8 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('bob-front', { end: 6 }),
      frameRate: 15,
      repeat: -1
    });

    this.anims.create({
      key: 'side',
      frames: this.anims.generateFrameNumbers('bob-side', { end: 8 }),
      frameRate: 15,
      repeat: -1
    });

    // Create money sprite in random spots on canvas
    randomCoord = assignCoords();
    gameState.money = this.physics.add.sprite(randomCoord.x, randomCoord.y, 'money').setScale(.5);

    // Create paper sprite group
    gameState.enemies = this.physics.add.group();

    // Collision detection between Bob and money sprite
    this.physics.add.overlap(gameState.player, gameState.money, () => {
      // Hide and deactivate the money sprite after Bob collides with it
      gameState.money.disableBody();
      // Play cashRegister sound
      soundEffects.play();
      // Place paper sprite on canvas randomly
      randomCoord = assignCoords();
      gameState.enemies.create(randomCoord.x, randomCoord.y, 'paper').setScale(.6);
      // Move money somewhere else on the canvas
      delete gameState.numCoordinates[`x${gameState.money.x}y${gameState.money.y}`];
      randomCoord = assignCoords();
      // Place the money sprite somewhere new, then show and activate it
      gameState.money.enableBody(true, randomCoord.x, randomCoord.y);
      // Increase the score randomly between 100 and 1000
      score += (Math.round(Math.random() * 10) * moneyMultiplier);
      // Update cash total text
      scoreText.setText(`Earnings: \$${score}`);
      // Increase speed
      speed = speed + .1;
    });

    // Collision detection between Bob and paper sprites
    this.physics.add.collider(gameState.player, gameState.enemies, () => this.endGame());

    // Helper function to return an object containing evenly spaced x and y coordinates:
    function generateRandomCoords() {
      const randomX = Math.floor(Math.random() * 5) * 75 + 25
      const randomY = Math.floor(Math.random() * 8) * 75 + 25
      return { x: randomX, y: randomY }
    }

    // Helper function that returns one set of coordinates not in gameState.numCoordinates
    function assignCoords() {
      let assignedCoord = generateRandomCoords();

      // If the coordinates are already in gameState.numCoordinates, then other set of coordinates are generated until there is one not in use
      while (gameState.numCoordinates[`x${assignedCoord.x}y${assignedCoord.y}`] || gameState.player.x == assignedCoord.x || gameState.player.y == assignedCoord.y) {
        assignedCoord = generateRandomCoords()
      }

      gameState.numCoordinates[`x${assignedCoord.x}y${assignedCoord.y}`] = true

      return assignedCoord;
    }
  }

  update() {
    // Arrow keys that will move Bob in 4 directions
    const cursors = this.input.keyboard.createCursorKeys();
    // Add variables that store if a specific arrow key is being pressed
    const rightArrow = cursors.right.isDown;
    const leftArrow = cursors.left.isDown;
    const upArrow = cursors.up.isDown;
    const downArrow = cursors.down.isDown;







// Add code to check whether any of the arrow keys were pressed, move Bob and play appropriate animation
if (rightArrow === true) {
  moveBobRight()
  gameState.player.anims.play('side',true);
}else if (leftArrow === true) {
  moveBobLeft()
  gameState.player.anims.play('side',true);
}else if (upArrow === true) {
  moveBobUp()
  gameState.player.anims.play('up',true);
}else if (downArrow === true) {
  moveBobDown()
  gameState.player.anims.play('down',true);
}

// Speed up animation as Bob gets faster
gameState.player.anims.msPerFrame = 60 * (1/speed);

// Add variables that store the x and y coordinates of the Bob sprite
const bobXCoord = gameState.player.x;
const bobYCoord = gameState.player.y;

// Add code to check collision between Bob and edges of the canvas of the game
if (bobXCoord <= 32 || bobXCoord >= 448) {
  this.endGame();
} 

if (bobYCoord <= 32 || bobYCoord >= 568) {
  this.endGame();
}






    // Helper functions to move Bob in 4 directions
    function moveBobRight() {
      gameState.player.flipX = false;
      //gameState.player.setTexture('bob-side');
      gameState.player.setVelocityX(150 * speed);
      gameState.player.setVelocityY(0);
    }

    function moveBobLeft() {
      // NOTE: By default Bob looks to the right so we flip the image if moving left
      gameState.player.flipX = true;
      //gameState.player.setTexture('bob-side');
      gameState.player.setVelocityX(-150 * speed);
      gameState.player.setVelocityY(0);
    }

    function moveBobUp() {
      gameState.player.flipX = false;
      //gameState.player.setTexture('bob-back');
      gameState.player.setVelocityX(0);
      gameState.player.setVelocityY(-150 * speed);
    }

    function moveBobDown() {
      gameState.player.flipX = false;
      //gameState.player.setTexture('bob-front');
      gameState.player.setVelocityX(0);
      gameState.player.setVelocityY(150 * speed);
    }
  }

  // Class function that ends current Game and transitions to End Scene
  endGame() {
    // Stop sprites moving
    this.physics.pause();
    // Transition to end scene w/fade
    this.cameras.main.fade(800, 0, 0, 0, false, function (camera, progress) {
      if (progress > .5) {
        this.scene.stop('GameScene');
        this.scene.start('EndScene');
      }
    });
  }
}
