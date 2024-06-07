// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import Phaser from 'phaser';
import styles from './styles.module.scss';

const Edit = () => {
  const phaserRef = useRef(null);
  const [spritePosition, setSpritePosition] = useState({ x: 0, y: 0 });
  const [canMoveSprite, setCanMoveSprite] = useState(true);

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
    this.load.image('fire', 'src/sprites/fire_tile.gif');
    this.load.image('flag', 'src/sprites/flag_tile.png');
    this.load.image('sky', 'src/sprites/sky_tile.png');
    this.load.image('boing', 'src/sprites/boing_tile.gif');
    this.load.text('map', 'src/map.txt');
  };

  const create = function () {
    const mapText = this.cache.text.get('map');
    const mapData = mapText.split('\n').map(row => row.replace(/[\[\],'\r]/g, '').split(' '));

    const platform = this.physics.add.staticGroup();

    for (let r = 0; r < 16; r++) {
      for (let c = 0; c < 16; c++) {
        new Block(this, (c * 32) + 16, (r * 32) + 16, 'sky');
      }
    }

    const player = new Player(this, 16, 464);

    for (let row = 0; row < mapData.length; row++) {
      for (let col = 0; col < mapData[row].length; col++) {
        const tile = mapData[row][col];
        const x = col * 32 + 16;
        const y = row * 32 + 16;
        if (tile === 'p') {
          platform.create(x, y, 'platform').setScale(2).refreshBody();
          this.physics.add.collider(player.sprite, platform);
        } else if (tile === 'F') {
          const fire = new Block(this, x, y, 'fire');
          this.physics.add.collider(player.sprite, fire.sprite, die, null, this);
        } else if (tile === 'E') {
          const flag = new Block(this, x, y, 'flag');
          this.physics.add.collider(player.sprite, flag.sprite, next_chunk, null, this);
        } else if (tile === 'J') {
          const boing = new Block(this, x, y, 'boing');
          this.physics.add.collider(player.sprite, boing.sprite, jump_boing, null, this);
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
      player.sprite.setVelocityX(0);

      if (cursors.left.isDown || this.wasd.left.isDown) {
        player.sprite.setVelocityX(-250);
      } else if (cursors.right.isDown || this.wasd.right.isDown) {
        player.sprite.setVelocityX(250);
      }

      if (cursors.up.isDown || this.wasd.up.isDown) {
        player.jump(1);
      }
    };

    function die(player, fire) {
      player.setVelocityX(0);
      player.setVelocityY(0);
      player.setX(16);
      player.setY(450);
    }

    function next_chunk(player, flag) {
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
      <div>
        <button className="button" onClick={() => { }}>Change Scene</button>
        <button disabled={canMoveSprite} className="button" onClick={() => { }}>Toggle Movement</button>
        <div className="spritePosition">Sprite Position:
          <pre>{`{\n  x: ${spritePosition.x}\n  y: ${spritePosition.y}\n}`}</pre>
        </div>
        <button className="button" onClick={() => { }}>Add New Sprite</button>
      </div>
    </div>
  );
}

export default Edit;
