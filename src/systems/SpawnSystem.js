import { Enemy } from '../entities/Enemy.js';

export class SpawnSystem {
  constructor(game) {
    this.game = game;

    // 스폰 설정
    this.baseSpawnRate = 2; // 초당 2마리
    this.spawnTimer = 0;
    this.maxEnemies = 200;

    // 난이도 스케일링
    this.difficultyInterval = 60; // 60초마다 난이도 증가
    this.difficultyMultiplier = 0.2; // 20% 증가
  }

  update(deltaTime) {
    this.spawnTimer += deltaTime;

    // 현재 스폰율 계산 (분당 20% 증가)
    const difficultyLevel = Math.floor(this.game.gameTime / this.difficultyInterval);
    const currentSpawnRate = this.baseSpawnRate * (1 + this.difficultyMultiplier * difficultyLevel);
    const spawnInterval = 1 / currentSpawnRate;

    // 스폰 실행
    if (this.spawnTimer >= spawnInterval && this.game.enemies.length < this.maxEnemies) {
      this.spawnEnemy();
      this.spawnTimer = 0;
    }
  }

  spawnEnemy() {
    // 화면 밖 랜덤 위치에서 스폰
    const spawnPosition = this.getRandomSpawnPosition();
    const enemy = new Enemy(this.game.scene, spawnPosition);
    this.game.addEnemy(enemy);
  }

  getRandomSpawnPosition() {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;
    const margin = 100; // 화면 밖 여유 공간

    const side = Math.floor(Math.random() * 4);
    let x, y;

    switch (side) {
      case 0: // 위쪽
        x = Math.random() * window.innerWidth - halfWidth;
        y = halfHeight + margin;
        break;
      case 1: // 아래쪽
        x = Math.random() * window.innerWidth - halfWidth;
        y = -halfHeight - margin;
        break;
      case 2: // 왼쪽
        x = -halfWidth - margin;
        y = Math.random() * window.innerHeight - halfHeight;
        break;
      case 3: // 오른쪽
        x = halfWidth + margin;
        y = Math.random() * window.innerHeight - halfHeight;
        break;
    }

    return { x, y };
  }

  reset() {
    this.spawnTimer = 0;
  }
}
