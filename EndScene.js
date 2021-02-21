class EndScene extends Phaser.Scene {
    constructor() {
      super({ key: 'EndScene' })
    }
  
    preload() {
      this.load.image('end', 'https://content.codecademy.com/courses/learn-phaser/BOB/Game%20over.png');
    }
  
    create() {
      //set and show total score before clearing for next game
      let scoreText = this.add.text(95, 530, `Earnings: $${score}`, { fontSize: '25px', fill: '#fff'});
      let displayScore = score;
      scoreText.depth = 1;
      scoreText.setText(`Total Salary: \$${displayScore}`);
      screen = this.add.image(0, 0, 'end').setOrigin(0);
  
      // Add code to reset global variables
    score = 0;
    speed = 1;
    moneyMultiplier = 100;
  
      // Reset sprite positions
      gameState.numCoordinates = {};
  
      this.input.keyboard.on('keydown', () => {
        this.scene.stop('EndScene');
        this.scene.start('GameScene');
      });
    }
  }