import * as THREE from 'three';

export class Enemy {
  constructor(scene, position) {
    this.scene = scene;
    this.position = new THREE.Vector3(position.x, position.y, 0);

    // 스탯
    this.health = 50;
    this.maxHealth = 50;
    this.speed = 100; // px/s
    this.damage = 10; // HP/s on contact
    this.experienceDrop = 5;

    // 3D 메시 생성 (빨간색 원)
    const geometry = new THREE.CircleGeometry(15, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);

    // 충돌 반경
    this.radius = 15;

    // 상태
    this.isAlive = true;
  }

  update(deltaTime, player) {
    if (!this.isAlive) return;

    // 플레이어를 향해 이동 (단순 경로 탐색)
    const direction = new THREE.Vector3()
      .subVectors(player.position, this.position)
      .normalize();

    this.position.x += direction.x * this.speed * deltaTime;
    this.position.y += direction.y * this.speed * deltaTime;

    this.mesh.position.copy(this.position);
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.health = 0;
      this.die();
      return true;
    }
    return false;
  }

  die() {
    this.isAlive = false;
  }

  destroy() {
    this.scene.remove(this.mesh);
  }

  getExperienceDrop() {
    return this.experienceDrop;
  }
}
