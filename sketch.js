var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("Images/trex.png");
  trex_collided = loadAnimation("Images/trex_collided.png");
  
  groundImage = loadImage("Images/desertBackground.jpg");
  groundImage2 = loadImage("Images/ground2.png")
  
  cloudImage = loadImage("Images/cloud.jpg");
  
  obstacle1 = loadImage("Images/obstacle1.jpg");
  obstacle2 = loadImage("Images/obstacle2.png");
  obstacle3 = loadImage("Images/obstacle3.jpg");
  obstacle4 = loadImage("Images/obstacle4.jpg");
  obstacle5 = loadImage("Images/obstacle5.jpg");
  obstacle6 = loadImage("Images/obstacle6.jpg");
  
  restartImg = loadImage("Images/restart.png")
  gameOverImg = loadImage("Images/gameOver.png")
  
  jumpSound = loadSound("Sounds/jump.mp3")
  dieSound = loadSound("Sounds/die.mp3")
  checkPointSound = loadSound("Sounds/checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth, displayHeight - 80);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,displayHeight - 120,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.3;
  
  ground = createSprite(displayWidth/15,displayHeight - 120,displayWidth*2,40);
  ground.addImage("ground",groundImage2);
  
  
  gameOver = createSprite(displayWidth/2,displayHeight/2 - 20);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2 + 10,displayHeight/2 + 20);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(displayWidth/2,displayHeight-90,displayWidth,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  
  score = 0;
}

function draw() {
  
  background(groundImage);
  //displaying score
  text("Score: "+ score, displayWidth/1.05,displayHeight/15);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    

    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    trex.velocityX = (6 + score/100);
  
      ground.velocityX = (6 + score/100);
      invisibleGround.velocityX = (6 + score/100);

  
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= displayHeight - 140) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.5;
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        trex.velocityX = 0;
        trex.velocityY = 0;
        invisibleGround.velocityX = 0;
        gameOver.velocityX = 0;
        restart.velocityX = 0; 
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
      ground.velocityX = 0;
      trex.velocityY = 0;
      invisibleGround.velocityX = 0;
      gameOver.velocityX = 0;
      restart.velocityX = 0;
     
      if(mousePressedOver(restart)) {
      reset();
      gameOver.x = displayWidth/2;
      restart.x = displayWidth/2;
      }
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score = 0;

}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(trex.x + 600,displayHeight - 120,10,40);


         camera.position.x = trex.x;
          camera.position.y = displayHeight/2;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              obstacle.scale = 0.7
              break;
      case 2: obstacle.addImage(obstacle2);
              obstacle.scale = 0.8
              break;
      case 3: obstacle.addImage(obstacle3);
              obstacle.scale = 0.6
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              obstacle.scale = 0.3;
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(displayWidth,-displayHeight + 30,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 400;
    cloud.scale = 0.05;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

