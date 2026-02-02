import * as THREE from 'three';
import { Game } from './game.js';

// 게임 초기화
let game = null;

function init() {
  // Scene, Camera, Renderer 설정
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    0.1,
    1000
  );
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.createElement('canvas')
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // 게임 인스턴스 생성
  game = new Game(scene, camera, renderer);

  // 재시작 버튼 이벤트
  document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('game-over').style.display = 'none';
    game.restart();
  });

  // 창 크기 변경 처리
  window.addEventListener('resize', () => {
    camera.left = window.innerWidth / -2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 게임 루프 시작
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (game) {
    game.update();
    game.render();
  }
}

// 초기화 실행
init();
