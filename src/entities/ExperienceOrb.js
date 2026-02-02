import * as THREE from 'three';

export class ExperienceOrb {
  constructor(scene, position, experience) {
    this.scene = scene;
    this.position = new THREE.Vector3(position.x, position.y, 0);
    this.experience = experience;

    // 자석 효과 설정
    this.magnetRadius = 300; // 자석 활성화 범위
    this.magnetSpeed = 300; // px/s
    this.collectRadius = 50; // 수집 범위

    // 3D 메시 생성 (초록색 작은 원)
    const geometry = new THREE.CircleGeometry(8, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this.position);
    scene.add(this.mesh);

    // 상태
    this.collected = false;

    // 애니메이션
    this.time = 0;
  }

  update(deltaTime, player) {
    if (this.collected) return;

    this.time += deltaTime;

    // 떠오르는 애니메이션
    const bobOffset = Math.sin(this.time * 3) * 5;
    this.mesh.position.z = bobOffset;

    // 플레이어와의 거리 계산
    const distance = this.position.distanceTo(player.position);

    // 수집 범위 내
    if (distance < this.collectRadius) {
      this.collected = true;
      return;
    }

    // 자석 효과 범위 내
    if (distance < this.magnetRadius) {
      const direction = new THREE.Vector3()
        .subVectors(player.position, this.position)
        .normalize();

      this.position.x += direction.x * this.magnetSpeed * deltaTime;
      this.position.y += direction.y * this.magnetSpeed * deltaTime;

      this.mesh.position.x = this.position.x;
      this.mesh.position.y = this.position.y;
    }
  }

  isCollected() {
    return this.collected;
  }

  destroy() {
    this.scene.remove(this.mesh);
  }

  getExperience() {
    return this.experience;
  }
}
