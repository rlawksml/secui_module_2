import * as THREE from 'three';

export class Player {
  constructor(scene) {
    this.scene = scene;

    // 스탯
    this.maxHealth = 100;
    this.health = 100;
    this.speed = 200; // px/s
    this.damage = 20;
    this.attackSpeed = 1; // attacks per second

    // 레벨 시스템
    this.level = 1;
    this.experience = 0;
    this.experienceToNextLevel = 10;

    // 위치
    this.position = new THREE.Vector3(0, 0, 0);

    // 3D 메시 생성 (파란색 원)
    const geometry = new THREE.CircleGeometry(20, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x0066ff });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);

    // 충돌 반경
    this.radius = 20;
  }

  move(velocity, deltaTime) {
    // 대각선 이동 정규화
    const length = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    if (length > 0) {
      velocity.x /= length;
      velocity.y /= length;
    }

    // 이동 적용
    this.position.x += velocity.x * this.speed * deltaTime;
    this.position.y += velocity.y * this.speed * deltaTime;

    // 화면 경계 제한
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;

    this.position.x = Math.max(-halfWidth + this.radius, Math.min(halfWidth - this.radius, this.position.x));
    this.position.y = Math.max(-halfHeight + this.radius, Math.min(halfHeight - this.radius, this.position.y));

    this.mesh.position.copy(this.position);
  }

  update(deltaTime) {
    // 추가 업데이트 로직 (애니메이션 등)
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      return true; // 사망
    }
    return false;
  }

  addExperience(amount) {
    this.experience += amount;
    if (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
      return true;
    }
    return false;
  }

  levelUp() {
    this.level++;
    this.experience -= this.experienceToNextLevel;
    this.experienceToNextLevel = Math.floor(10 * Math.pow(this.level, 1.5));

    // 레벨업 보너스
    this.health = this.maxHealth; // 체력 완전 회복
    this.speed *= 1.05; // 이동 속도 +5%
    this.damage *= 1.1; // 공격 데미지 +10%
  }

  reset() {
    this.maxHealth = 100;
    this.health = 100;
    this.speed = 200;
    this.damage = 20;
    this.attackSpeed = 1;
    this.level = 1;
    this.experience = 0;
    this.experienceToNextLevel = 10;
    this.position.set(0, 0, 0);
    this.mesh.position.copy(this.position);
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
