import { Player } from './entities/Player.js';
import { SpawnSystem } from './systems/SpawnSystem.js';
import { CombatSystem } from './systems/CombatSystem.js';
import { LevelSystem } from './systems/LevelSystem.js';

export class Game {
  constructor(scene, camera, renderer) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;

    // 게임 상태
    this.gameState = 'playing'; // 'playing', 'levelup', 'gameover'
    this.gameTime = 0;
    this.kills = 0;

    // 엔티티 배열
    this.enemies = [];
    this.projectiles = [];
    this.experienceOrbs = [];

    // 플레이어 생성
    this.player = new Player(this.scene);

    // 시스템 초기화
    this.spawnSystem = new SpawnSystem(this);
    this.combatSystem = new CombatSystem(this);
    this.levelSystem = new LevelSystem(this);

    // 입력 처리
    this.keys = {};
    this.setupInput();

    // 델타 타임 계산
    this.lastTime = performance.now();
  }

  setupInput() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  update() {
    if (this.gameState !== 'playing') return;

    // 델타 타임 계산
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.gameTime += deltaTime;

    // 입력 처리
    this.handleInput(deltaTime);

    // 플레이어 업데이트
    this.player.update(deltaTime);

    // 시스템 업데이트
    this.spawnSystem.update(deltaTime);
    this.combatSystem.update(deltaTime);
    this.levelSystem.update(deltaTime);

    // 적 업데이트
    this.enemies.forEach(enemy => enemy.update(deltaTime, this.player));

    // 발사체 업데이트
    this.projectiles = this.projectiles.filter(projectile => {
      projectile.update(deltaTime);
      return projectile.isAlive();
    });

    // 경험치 오브 업데이트
    this.experienceOrbs.forEach(orb => orb.update(deltaTime, this.player));

    // HUD 업데이트
    this.updateHUD();
  }

  handleInput(deltaTime) {
    const velocity = { x: 0, y: 0 };

    if (this.keys['w'] || this.keys['arrowup']) velocity.y = 1;
    if (this.keys['s'] || this.keys['arrowdown']) velocity.y = -1;
    if (this.keys['a'] || this.keys['arrowleft']) velocity.x = -1;
    if (this.keys['d'] || this.keys['arrowright']) velocity.x = 1;

    this.player.move(velocity, deltaTime);
  }

  updateHUD() {
    // 체력바
    const healthPercent = (this.player.health / this.player.maxHealth) * 100;
    document.getElementById('health-fill').style.width = healthPercent + '%';
    document.getElementById('hp-text').textContent =
      `${Math.ceil(this.player.health)}/${this.player.maxHealth}`;

    // 경험치바
    const expPercent = (this.player.experience / this.player.experienceToNextLevel) * 100;
    document.getElementById('exp-fill').style.width = expPercent + '%';
    document.getElementById('exp-text').textContent =
      `${this.player.experience}/${this.player.experienceToNextLevel}`;

    // 레벨
    document.getElementById('level-text').textContent = this.player.level;

    // 시간
    const minutes = Math.floor(this.gameTime / 60);
    const seconds = Math.floor(this.gameTime % 60);
    document.getElementById('time-text').textContent =
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // 킬 수
    document.getElementById('kills-text').textContent = this.kills;
  }

  showLevelUp() {
    const levelUpElement = document.getElementById('level-up');
    levelUpElement.style.display = 'block';
    setTimeout(() => {
      levelUpElement.style.display = 'none';
    }, 1000);
  }

  gameOver() {
    this.gameState = 'gameover';

    // 최종 통계 표시
    const minutes = Math.floor(this.gameTime / 60);
    const seconds = Math.floor(this.gameTime % 60);
    document.getElementById('final-time').textContent =
      `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('final-level').textContent = this.player.level;
    document.getElementById('final-kills').textContent = this.kills;

    document.getElementById('game-over').style.display = 'block';
  }

  restart() {
    // 모든 엔티티 제거
    this.enemies.forEach(enemy => enemy.destroy());
    this.projectiles.forEach(projectile => projectile.destroy());
    this.experienceOrbs.forEach(orb => orb.destroy());

    this.enemies = [];
    this.projectiles = [];
    this.experienceOrbs = [];

    // 게임 상태 리셋
    this.gameTime = 0;
    this.kills = 0;
    this.gameState = 'playing';

    // 플레이어 리셋
    this.player.reset();

    // 시스템 리셋
    this.spawnSystem.reset();
    this.combatSystem.reset();

    this.lastTime = performance.now();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  addEnemy(enemy) {
    this.enemies.push(enemy);
  }

  addProjectile(projectile) {
    this.projectiles.push(projectile);
  }

  addExperienceOrb(orb) {
    this.experienceOrbs.push(orb);
  }
}
