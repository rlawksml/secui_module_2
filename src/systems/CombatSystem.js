import { Projectile } from '../entities/Projectile.js';
import { ExperienceOrb } from '../entities/ExperienceOrb.js';
import { checkCircleCollision } from '../utils/collision.js';

export class CombatSystem {
  constructor(game) {
    this.game = game;

    // 자동 공격 설정
    this.attackTimer = 0;
    this.attackInterval = 1; // 1초당 1발 (기본)

    // 접촉 데미지
    this.contactDamageTimer = 0;
    this.contactDamageInterval = 0.1; // 0.1초마다 체크
  }

  update(deltaTime) {
    // 자동 타겟팅 및 발사
    this.attackTimer += deltaTime;
    if (this.attackTimer >= this.attackInterval / this.game.player.attackSpeed) {
      this.autoAttack();
      this.attackTimer = 0;
    }

    // 발사체-적 충돌 감지
    this.checkProjectileCollisions();

    // 플레이어-적 접촉 데미지
    this.contactDamageTimer += deltaTime;
    if (this.contactDamageTimer >= this.contactDamageInterval) {
      this.checkContactDamage();
      this.contactDamageTimer = 0;
    }

    // 플레이어-경험치 오브 수집
    this.checkExperienceCollection();
  }

  autoAttack() {
    // 가장 가까운 적 찾기
    const target = this.findClosestEnemy();
    if (!target) return;

    // 발사체 생성
    const projectile = new Projectile(
      this.game.scene,
      this.game.player.position,
      target.position,
      this.game.player.damage
    );
    this.game.addProjectile(projectile);
  }

  findClosestEnemy() {
    let closestEnemy = null;
    let closestDistance = Infinity;

    this.game.enemies.forEach(enemy => {
      if (!enemy.isAlive) return;

      const distance = this.game.player.position.distanceTo(enemy.position);

      // 화면 범위 내에서만 타겟팅
      const screenRange = Math.max(window.innerWidth, window.innerHeight) / 2;
      if (distance < closestDistance && distance < screenRange) {
        closestDistance = distance;
        closestEnemy = enemy;
      }
    });

    return closestEnemy;
  }

  checkProjectileCollisions() {
    this.game.projectiles.forEach(projectile => {
      if (!projectile.isAlive()) return;

      this.game.enemies.forEach((enemy, index) => {
        if (!enemy.isAlive) return;

        // 충돌 감지
        if (checkCircleCollision(
          projectile.position,
          projectile.radius,
          enemy.position,
          enemy.radius
        )) {
          // 발사체가 적을 맞춤
          if (projectile.hit(enemy)) {
            const isDead = enemy.takeDamage(projectile.damage);

            if (isDead) {
              // 적 처치
              this.game.kills++;

              // 경험치 오브 드롭
              const orb = new ExperienceOrb(
                this.game.scene,
                enemy.position,
                enemy.getExperienceDrop()
              );
              this.game.addExperienceOrb(orb);

              // 적 제거
              enemy.destroy();
              this.game.enemies.splice(index, 1);
            }
          }
        }
      });
    });
  }

  checkContactDamage() {
    this.game.enemies.forEach(enemy => {
      if (!enemy.isAlive) return;

      // 충돌 감지
      if (checkCircleCollision(
        this.game.player.position,
        this.game.player.radius,
        enemy.position,
        enemy.radius
      )) {
        // 플레이어 데미지
        const damageAmount = enemy.damage * this.contactDamageInterval;
        const isDead = this.game.player.takeDamage(damageAmount);

        if (isDead) {
          this.game.gameOver();
        }
      }
    });
  }

  checkExperienceCollection() {
    this.game.experienceOrbs = this.game.experienceOrbs.filter(orb => {
      if (orb.isCollected()) {
        // 경험치 획득
        const leveledUp = this.game.player.addExperience(orb.getExperience());

        if (leveledUp) {
          this.game.showLevelUp();
        }

        orb.destroy();
        return false;
      }
      return true;
    });
  }

  reset() {
    this.attackTimer = 0;
    this.contactDamageTimer = 0;
  }
}
