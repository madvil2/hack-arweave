// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import Phaser from 'phaser';
import { notification } from 'antd';
import styles from './styles.module.scss';

const EditPage = () => {
  const phaserRef = useRef(null);
  const [selectedBlock, setSelectedBlock] = useState('platform');
  const [mapData, setMapData] = useState([]);
  const [canMoveSprite, setCanMoveSprite] = useState(true);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
  const [canSave, setCanSave] = useState(false); // State variable to track if the player can save the map

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 512,
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
    this.load.image('speed', 'src/sprites/speed_tile.png');
    this.load.spritesheet('boing', 'src/sprites/boing_sheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('fire', 'src/sprites/fire_sheet.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('death', 'src/sprites/death_anim.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('idle', 'src/sprites/knight_idle.png', { frameWidth: 32, frameHeight: 32 });
    this.load.text('map', 'src/map.txt');
  };

  const create = function () {
    const mapText = this.cache.text.get('map');
    const initialMapData = mapText.split('\n').map(row => row.replace(/[\[\],'\r]/g, '').split(' '));
    setMapData(initialMapData);

    const platform = this.physics.add.staticGroup();

    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        new Block(this, (c * 32) + 16, (r * 32) + 16, 'sky');
      }
    }

    const player = new Player(this, 16, 464);

    this.anims.create({
      key: 'slime',
      frames: this.anims.generateFrameNumbers('boing', { start: 0, end: 3 }), // Adjust start and end based on your spritesheet
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'fire',
      frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 3 }), // Adjust start and end based on your spritesheet
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'death',
      frames: this.anims.generateFrameNumbers('death', { start: 0, end: 3 }), // Adjust start and end based on your spritesheet
      frameRate: 10,
      repeat: 0 // Play once
    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 5 }), // Adjust start and end based on your spritesheet
      frameRate: 10,
      repeat: -1
    });
    player.sprite.anims.play('idle');
    initialMapData.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        const x = colIndex * 32 + 16;
        const y = rowIndex * 32 + 16;
        if (tile === 'p') {
          platform.create(x, y, 'platform').setScale(1).refreshBody();
          this.physics.add.collider(player.sprite, platform);
        } else if (tile === 'F') {
          const fire = new Block(this, x, y, 'fire');
          this.physics.add.collider(player.sprite, fire.sprite, die, null, this);
          fire.sprite.anims.play('fire');
        } else if (tile === 'E') {
          const flag = new Block(this, x, y, 'flag');
          this.physics.add.collider(player.sprite, flag.sprite, reachEnd, null, this);
        } else if (tile === 'J') {
          const boing = new Block(this, x, y, 'boing');
          this.physics.add.collider(player.sprite, boing.sprite, jump_boing, null, this);
          boing.sprite.anims.play('slime');
        }
      });
    });

    const cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });

    this.input.on('pointerdown', (pointer) => {
      const x = Math.floor(pointer.x / 32) * 32 + 16;
      const y = Math.floor(pointer.y / 32) * 32 + 16;
      placeBlock(this, x, y, selectedBlock);
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
      player.scene.time.delayedCall(1000, () => { // Delay for 1 second (1000ms)
        player.setX(16);
        player.setY(460);
        player.anims.play('idle');
        player.canMove = true;
      }, [], this);
    }

    function reachEnd(player, flag) {
      player.setX(16);
      player.setY(460);
      setCanSave(true); // Enable the Save button
    }

    function jump_boing(player, boing) {
      player.setVelocityY(-400 * 1.2);
    }

    function placeBlock(scene, x, y, type) {
      const col = Math.floor((x - 16) / 32);
      const row = Math.floor((y - 16) / 32);

      if (mapData[row] && mapData[row][col]) {
        mapData[row][col] = type[0]; // 'p', 'F', 'E', 'J'
        setMapData([...mapData]);
      }

      new Block(scene, x, y, type);
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
      this.canMove = true; // Add canMove property
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

  const saveMap = () => {
    // Logic to save the mapData, perhaps send it to the server or store locally
    console.log('Map saved', mapData);
    notification.success({
      message: 'Success',
      description: 'Map saved successfully!',
      placement: 'bottomRight',
    });
  };

  const cancelEdit = () => {
    window.location.reload(); // Reload the page
  };

  return (
    <div className={styles.wrap}>
      <div id="game-container" className="game-container"></div>
      <div className={styles.controls}>
        <div className={styles.palette}>
          <div onClick={() => setSelectedBlock('platform')} className={selectedBlock === 'platform' ? styles.selected : ''}>
            <img src="src/sprites/platform_tile.png" alt="Platform" />
          </div>
          <div onClick={() => setSelectedBlock('fire')} className={selectedBlock === 'fire' ? styles.selected : ''}>
            <img src="src/sprites/fire_tile.gif" alt="Fire" />
          </div>
          <div onClick={() => setSelectedBlock('speed')} className={selectedBlock === 'speed' ? styles.selected : ''}>
            <img src="src/sprites/speed_tile.gif" alt="Speed" />
          </div>
          <div onClick={() => setSelectedBlock('boing')} className={selectedBlock === 'boing' ? styles.selected : ''}>
            <img src="src/sprites/boing_tile.gif" alt="Boing" />
          </div>
        </div>
        <div className={styles.wrapper}>
          <button className={styles.button} onClick={saveMap} disabled={!canSave}>Save</button>
          <button className={styles.button} onClick={cancelEdit}>Give up</button>
        </div>
      </div>
    </div>
  );
}

export default EditPage;
