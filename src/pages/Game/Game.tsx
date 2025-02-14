// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import Phaser from 'phaser';
import styles from './styles.module.scss';

const Game = () => {
  const phaserRef = useRef(null);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
  const [canMoveSprite, setCanMoveSprite] = useState(true);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 1024,
      height: 512,
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1000 },
          debug: false
        }
      },
      scene: {
        preload,
        create,
      }
    };

    const game = new Phaser.Game(config);
    phaserRef.current = game;

    return () => {
      game.destroy(true);
    };
  }, []);

  const preload = function () {
    this.load.image('player', 'src/sprites/player_tile.png');
    this.load.image('platform', 'src/sprites/platform_tile.png');
    this.load.image('flag', 'src/sprites/flag_tile.png');
    this.load.image('sky', 'src/sprites/sky_tile.png');
    this.load.spritesheet('boing', 'src/sprites/boing_sheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fire', 'src/sprites/fire_sheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('death', 'src/sprites/death_anim.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('idle', 'src/sprites/knight_idle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.text('map', 'src/map2.txt');
    this.load.text('map2', 'src/map.txt');
  };

  const create = function () {
    const mapText = this.cache.text.get('map');
    const mapData = mapText.split('\n').map(row => row.replace(/[\[\],'\r]/g, '').split(' '));
    const mapText1 = this.cache.text.get('map2');
    const mapData1 = mapText1.split('\n').map(row => row.replace(/[\[\],'\r]/g, '').split(' '));

    const platform = this.physics.add.staticGroup();

    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        new Block(this, (c * 32) + 16, (r * 32) + 16, 'sky');
      }
    }

    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        new Block(this, (c * 32) + 512 + 16, (r * 32) + 16, 'sky');
      }
    }

    const player = new Player(this, 16, 464);

    this.anims.create({
      key: 'slime',
      frames: this.anims.generateFrameNumbers('boing', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'fire',
      frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'death',
      frames: this.anims.generateFrameNumbers('death', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: 0 // Play once
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }),
      frameRate: 10,
      repeat: -1
    });
    player.sprite.anims.play('idle');
    for (let row = 0; row < mapData.length; row++) {
      for (let col = 0; col < mapData[row].length; col++) {
        const tile = mapData[row][col];
        const x = col * 32 + 16;
        const y = row * 32 + 16;
        if (tile === 'p') {
          platform.create(x, y, 'platform').setScale(1).refreshBody();
          this.physics.add.collider(player.sprite, platform);
        } else if (tile === 'F') {
          const fire = new Block(this, x, y, 'fire');
          this.physics.add.collider(player.sprite, fire.sprite, die, null, this);
          fire.sprite.anims.play('fire');
        } else if (tile === 'E') {
          const flag = new Block(this, x, y, 'flag');
          this.physics.add.collider(player.sprite, flag.sprite, next_chunk, null, this);
        } else if (tile === 'J') {
          const boing = new Block(this, x, y, 'boing');
          this.physics.add.collider(player.sprite, boing.sprite, jump_boing, null, this);
          boing.sprite.anims.play('slime');
        }
      }
    }
    for (let row = 0; row < mapData1.length; row++) {
      for (let col = 0; col < mapData1[row].length; col++) {
        const tile = mapData1[row][col];
        const x1 = col * 32 + 512 + 16;
        const y1 = row * 32 + 16;
        if (tile === 'p') {
          platform.create(x1, y1, 'platform').setScale(1).refreshBody();
          this.physics.add.collider(player.sprite, platform);
        } else if (tile === 'F') {
          const fire = new Block(this, x1, y1, 'fire');
          this.physics.add.collider(player.sprite, fire.sprite, die, null, this);
          fire.sprite.anims.play('fire');
        } else if (tile === 'E') {
          const flag = new Block(this, x1, y1, 'flag');
          this.physics.add.collider(player.sprite, flag.sprite, first_chunk, null, this);
        } else if (tile === 'J') {
          const boing = new Block(this, x1, y1, 'boing');
          this.physics.add.collider(player.sprite, boing.sprite, jump_boing, null, this);
          boing.sprite.anims.play('slime');
        }
      }
    }

    const cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.update = function () {
      if (player.canMove) {
        player.sprite.setVelocityX(0);

        if (cursors.left.isDown || this.wasd.left.isDown) {
          player.sprite.setVelocityX(-250);
          player.sprite.setFlipX(true);
        } else if (cursors.right.isDown || this.wasd.right.isDown) {
          player.sprite.setVelocityX(250);
          player.sprite.setFlipX(false);
        }

        if (cursors.up.isDown || this.wasd.up.isDown) {
          player.jump(1);
        }
      }
    };

    function die(player, fire) {
      player.canMove = false;
      player.setVelocityX(0);
      player.setVelocityY(0);
      player.anims.play('death');
      player.scene.time.delayedCall(1000, () => {
        player.setX(16);
        player.setY(460);
        player.anims.play('idle');
        player.canMove = true;
      }, [], this);
    }

    function next_chunk(player, flag) {
      player.setX(16 + 512);
      player.setY(460);
    }

    function first_chunk(player, flag) {
      player.setX(16);
      player.setY(460);
    }

    function jump_boing(player, boing) {
      player.setVelocityY(-400 * 1.2);
    }
  };

  class Player {
    constructor(scene, x, y) {
      this.sprite = scene.physics.add.sprite(x, y, 'player');
      this.sprite.setBounce(0.0);
      this.sprite.setCollideWorldBounds(true);
      this.sprite.displayWidth = 16;
      this.sprite.displayHeight = 16;
      this.sprite.setScale(1);
      this.canMove = true;
    }

    jump(strength) {
      if (this.sprite.body.touching.down) {
        this.sprite.setVelocityY(-400 * strength);
      }
    }
  }

  class Block {
    constructor(scene, x, y, type) {
      this.sprite = scene.physics.add.staticSprite(x, y, type);
      this.sprite.setScale(1);
      this.type = type;
    }
  }

  return (
    <div className={styles.wrap}>
      <div id="game-container" className="game-container"></div>
    </div>
  );
}

export default Game;
