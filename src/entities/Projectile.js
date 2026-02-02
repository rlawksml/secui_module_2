import * as THREE from 'three';

export class Projectile {
  constructor(scene, position, target, damage) {
    this.scene = scene;
    this.position = new THREE.Vector3(position.x, position.y, 0);

    // 스탯
    this.speed = 400; // px/s
    this.damage = damage;
    this.pierceCount = 1; // 관통 횟수
    this.hitEnemies = new Set(); // 이미 맞춘 적 추적

    // 타겟 방향 계산
    this.direction = new THREE.Vector3()
      .subVectors(target, this.position)
      .normalize();

    // 3D 메시 생성 (노란색 작은 원)
    const geometry = new THREE.CircleGeometry(5, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);

    // 충돌 반경
    this.radius = 5;

    // 상태
    this.alive = true;
    this.maxDistance = 1000; // 최대 이동 거리
    this.distanceTraveled = 0;
  }

  update(deltaTime) {
    if (!this.alive) return;

    // 이동
    const movement = this.speed * deltaTime;
    this.position.x += this.direction.x * movement;
    this.position.y += this.direction.y * movement;
    this.distanceTraveled += movement;

    this.mesh.position.copy(this.position);

    // 화면 밖이나 최대 거리 도달 시 제거
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;

    if (
      Math.abs(this.position.x) > halfWidth + 100 ||
      Math.abs(this.position.y) > halfHeight + 100 ||
      this.distanceTraveled > this.maxDistance
    ) {
      this.alive = false;
    }
  }

  hit(enemy) {
    // 이미 맞춘 적인지 확인
    if (this.hitEnemies.has(enemy)) return false;

    this.hitEnemies.add(enemy);
    this.pierceCount--;

    if (this.pierceCount <= 0) {
      this.alive = false;
    }

    return true;
  }

  isAlive() {
    return this.alive;
  }

  destroy() {
    this.scene.remove(this.mesh);
  }
}
