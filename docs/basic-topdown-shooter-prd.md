# PRD: 기본 탑다운 슈터 시스템

## 문서 정보
- **프로젝트명**: Vampire Survivors-like Game - Basic Top-Down Shooter
- **작성일**: 2026-02-02
- **버전**: 1.0
- **담당자**: Development Team

---

## 1. 개요 (Overview)

뱀파이어 서바이벌류 게임의 핵심 메커니즘인 기본 탑다운 슈터 시스템을 구현한다. 플레이어는 캐릭터를 조작하여 화면을 이동하며, 자동으로 적을 공격하고, 적을 처치하여 경험치를 획득하고 레벨업하는 기본 게임플레이를 제공한다.

### 1.1 목적
- 뱀파이어 서바이벌 장르의 핵심 게임플레이 구현
- 추후 확장 가능한 기반 시스템 구축
- JavaScript 기반의 웹 게임 프로토타입 완성

### 1.2 범위
- **포함**: 플레이어 이동, 자동 공격, 적 AI, 경험치/레벨 시스템
- **제외**: 복잡한 무기 업그레이드, 보스, 멀티플레이어

---

## 2. 목표 (Goals & Objectives)

### 2.1 비즈니스 목표
- 프로토타입 완성을 통한 게임 컨셉 검증
- 플레이어 피드백 수집 기반 마련
- 추가 기능 개발을 위한 기술적 토대 구축

### 2.2 사용자 목표
- 직관적이고 쉬운 조작감 제공
- 몰입감 있는 전투 경험
- 성장하는 재미 (레벨업 시스템)

### 2.3 기술 목표
- 60 FPS 이상의 부드러운 렌더링
- 100개 이상의 동시 적 처리 가능
- 모듈화된 코드 구조

---

## 3. 핵심 기능 (Core Features)

### 3.1 플레이어 시스템

#### 3.1.1 이동 시스템
- **입력 방식**: WASD 또는 방향키
- **이동 속도**: 기본 200px/s (레벨업 시 증가 가능)
- **이동 범위**: 화면 경계 내에서 자유롭게 이동
- **충돌 처리**: 적과 충돌 시 데미지 받음

**기술 요구사항**:
```javascript
// 예상 인터페이스
class Player {
  position: { x: number, y: number }
  velocity: { x: number, y: number }
  speed: number
  health: number
  maxHealth: number
  level: number
  experience: number
  experienceToNextLevel: number
}
```

#### 3.1.2 체력 시스템
- **기본 체력**: 100 HP
- **피격 시**: 적과 접촉 시 1초당 10 데미지
- **사망 조건**: 체력 0 이하 시 게임 오버
- **체력 회복**: 없음 (추후 아이템으로 확장 가능)

#### 3.1.3 경험치 및 레벨 시스템
- **경험치 획득**: 적 처치 시 5 EXP
- **레벨업 공식**: `expToNextLevel = 10 * level^1.5`
- **레벨업 효과**:
  - 체력 완전 회복
  - 이동 속도 5% 증가
  - 공격 데미지 10% 증가
- **최대 레벨**: 제한 없음

### 3.2 전투 시스템

#### 3.2.1 자동 공격
- **공격 방식**: 가장 가까운 적을 자동으로 타겟팅
- **공격 타입**: 발사체 (Projectile)
- **공격 속도**: 초당 1회
- **공격 범위**: 화면 내 모든 적
- **공격 데미지**: 기본 20 데미지

**발사체 속성**:
- 속도: 400px/s
- 관통: 1회 (1명의 적만 타격)
- 크기: 10px 원형
- 색상: 노란색

#### 3.2.2 타겟팅 시스템
```javascript
// 타겟 선택 로직
function findNearestEnemy(playerPos, enemies) {
  return enemies
    .filter(e => e.isAlive)
    .sort((a, b) =>
      distance(playerPos, a.pos) - distance(playerPos, b.pos)
    )[0];
}
```

### 3.3 적 시스템

#### 3.3.1 적 타입
**기본 적 (Basic Enemy)**:
- 체력: 50 HP
- 이동 속도: 80px/s
- 접촉 데미지: 10 HP/s
- 경험치 드롭: 5 EXP
- 외형: 빨간색 원형 (반지름 15px)

#### 3.3.2 적 AI
- **행동 패턴**: 플레이어를 향해 직선 이동
- **추적 범위**: 무제한 (항상 플레이어 추적)
- **회피 행동**: 없음

#### 3.3.3 스폰 시스템
- **스폰 위치**: 화면 밖 랜덤 위치
- **스폰 간격**: 초당 2마리
- **스폰 증가**: 1분마다 스폰율 20% 증가
- **최대 동시 적 수**: 200마리

**스폰 공식**:
```javascript
spawnRate = baseSpawnRate * (1 + 0.2 * floor(gameTime / 60))
```

### 3.4 경험치 오브 시스템

#### 3.4.1 드롭 메커니즘
- 적 사망 시 경험치 오브 생성
- 오브 위치: 적 사망 위치
- 오브 외형: 파란색 작은 원 (반지름 5px)

#### 3.4.2 수집 메커니즘
- **수집 방식**: 플레이어와 충돌 시 자동 수집
- **수집 범위**: 50px (플레이어 중심)
- **자석 효과**: 범위 내 오브가 플레이어에게 끌려옴
- **이동 속도**: 300px/s

---

## 4. UI/UX 요구사항

### 4.1 HUD (Heads-Up Display)
- **위치**: 화면 상단
- **표시 정보**:
  - 체력바 (빨간색, 현재/최대 HP)
  - 경험치바 (파란색, 진행도 %)
  - 현재 레벨
  - 생존 시간 (MM:SS)

### 4.2 레벨업 알림
- 레벨업 시 화면 중앙에 "LEVEL UP!" 텍스트 표시
- 1초간 표시 후 자동 사라짐
- 효과음 재생 (추후 추가)

### 4.3 게임 오버 화면
- 배경 어둡게 처리
- 표시 정보:
  - "GAME OVER"
  - 생존 시간
  - 도달 레벨
  - 처치한 적 수
  - 재시작 버튼

---

## 5. 기술 스택 (Technical Stack)

### 5.1 권장 기술
**옵션 1: Vanilla JavaScript + Canvas 2D**
- 장점: 가볍고 빠름, 학습 곡선 낮음
- 단점: 복잡한 기능 구현 시 직접 구현 필요

**옵션 2: Phaser.js**
- 장점: 게임 개발에 최적화된 API, 물리 엔진 내장
- 단점: 라이브러리 크기, 학습 시간 필요

### 5.2 개발 환경
```json
{
  "language": "JavaScript (ES6+)",
  "framework": "Phaser 3.60+ (권장) or Vanilla",
  "bundler": "Vite or Webpack",
  "package-manager": "npm or yarn"
}
```

### 5.3 파일 구조
```
project/
├── src/
│   ├── index.js              # 진입점
│   ├── game.js               # 게임 메인 로직
│   ├── entities/
│   │   ├── Player.js         # 플레이어 클래스
│   │   ├── Enemy.js          # 적 클래스
│   │   ├── Projectile.js     # 발사체 클래스
│   │   └── ExperienceOrb.js  # 경험치 오브 클래스
│   ├── systems/
│   │   ├── SpawnSystem.js    # 적 스폰 관리
│   │   ├── CombatSystem.js   # 전투 로직
│   │   └── LevelSystem.js    # 레벨/경험치 관리
│   └── utils/
│       ├── math.js           # 수학 유틸리티
│       └── collision.js      # 충돌 감지
├── assets/
│   ├── sprites/
│   └── sounds/
├── index.html
└── package.json
```

---

## 6. 성능 요구사항

### 6.1 프레임레이트
- **목표**: 60 FPS 유지
- **최소**: 30 FPS 이상
- **테스트 조건**: 적 100마리, 발사체 50개 동시 존재

### 6.2 최적화 전략
- **오브젝트 풀링**: 발사체 및 적 재사용
- **공간 분할**: 쿼드트리 또는 그리드 기반 충돌 감지
- **렌더링 최적화**: 화면 밖 오브젝트 렌더링 스킵
- **가비지 컬렉션**: 임시 객체 생성 최소화

---

## 7. 사용자 스토리 (User Stories)

### 7.1 기본 플레이
```
As a player,
I want to control my character with keyboard keys,
So that I can avoid enemies and survive longer.
```

### 7.2 전투
```
As a player,
I want my character to automatically attack nearby enemies,
So that I can focus on movement and positioning.
```

### 7.3 성장
```
As a player,
I want to gain experience and level up,
So that I feel a sense of progression and become stronger.
```

### 7.4 도전
```
As a player,
I want enemies to gradually become more numerous,
So that the game remains challenging and exciting.
```

---

## 8. 테스트 시나리오

### 8.1 기능 테스트
1. **플레이어 이동**
   - [ ] WASD 키로 상하좌우 이동 가능
   - [ ] 화면 경계에서 이동 불가
   - [ ] 대각선 이동 시 속도 정규화

2. **전투 시스템**
   - [ ] 적이 범위 내에 있을 때 자동 공격
   - [ ] 발사체가 적에게 명중 시 데미지 적용
   - [ ] 적 처치 시 경험치 오브 드롭

3. **레벨 시스템**
   - [ ] 경험치 획득 시 UI 업데이트
   - [ ] 레벨업 시 능력치 증가
   - [ ] 레벨업 알림 표시

4. **게임 오버**
   - [ ] 체력 0 시 게임 종료
   - [ ] 통계 정보 표시
   - [ ] 재시작 가능

### 8.2 성능 테스트
- [ ] 적 100마리 동시 존재 시 60 FPS 유지
- [ ] 10분 이상 플레이 시 메모리 누수 없음
- [ ] 다양한 브라우저에서 동작 확인 (Chrome, Firefox, Safari)

---

## 9. 개발 일정 (Timeline)

### Phase 1: 기본 프레임워크 (2-3일)
- 프로젝트 셋업 및 개발 환경 구성
- 게임 루프 구현
- 플레이어 이동 및 렌더링

### Phase 2: 전투 시스템 (2-3일)
- 적 생성 및 AI
- 자동 공격 및 발사체 시스템
- 충돌 감지 및 데미지 처리

### Phase 3: 진행 시스템 (1-2일)
- 경험치 및 레벨 시스템
- HUD 구현
- 게임 오버 처리

### Phase 4: 밸런싱 및 테스트 (1-2일)
- 게임 밸런스 조정
- 버그 수정
- 성능 최적화

**총 예상 기간**: 6-10일

---

## 10. 성공 지표 (Success Metrics)

### 10.1 기술 지표
- 60 FPS 안정적 유지
- 메모리 사용량 < 100MB
- 로딩 시간 < 2초

### 10.2 게임플레이 지표
- 평균 생존 시간: 3-5분 (첫 플레이 기준)
- 레벨업 빈도: 30초당 1회
- 플레이어가 5분 이상 생존 가능

### 10.3 코드 품질
- 모든 핵심 기능에 대한 단위 테스트 작성
- ESLint 규칙 준수
- 코드 주석 및 문서화 완료

---

## 11. 리스크 및 대응 방안

### 11.1 기술 리스크
| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 성능 저하 (다수의 적) | 높음 | 오브젝트 풀링, 공간 분할 적용 |
| 크로스 브라우저 이슈 | 중간 | 주요 브라우저 테스트, Polyfill 사용 |
| 모바일 대응 | 낮음 | 초기 버전은 데스크톱만 지원 |

### 11.2 게임 디자인 리스크
| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 단조로운 게임플레이 | 중간 | 다양한 적 타입 추가 (Phase 2) |
| 난이도 불균형 | 중간 | 플레이테스트를 통한 밸런싱 |

---

## 12. 향후 확장 계획

### 12.1 단기 (1-2주)
- 추가 무기 타입 (근접, 범위 공격)
- 간단한 업그레이드 시스템
- 효과음 및 배경음악

### 12.2 중기 (1개월)
- 다양한 적 타입 및 보스
- 캐릭터 선택 시스템
- 스테이지 시스템

### 12.3 장기 (2-3개월)
- 멀티플레이어 모드
- 메타 진행 시스템
- 모바일 버전

---

## 13. 참고 자료

### 13.1 레퍼런스 게임
- Vampire Survivors
- Brotato
- 20 Minutes Till Dawn

### 13.2 기술 문서
- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Canvas API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)

### 13.3 튜토리얼
- [Building a Top-Down Game with Phaser](https://phasertutorials.com/)
- [JavaScript Game Development](https://developer.mozilla.org/en-US/docs/Games)

---

## 14. 승인 및 피드백

- [ ] 기획 검토 완료
- [ ] 기술 검토 완료
- [ ] 디자인 검토 완료
- [ ] 개발 시작 승인

**작성자**: Development Team
**검토자**: [검토자명]
**승인일**: [승인일자]

---

## 변경 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0 | 2026-02-02 | Dev Team | 최초 작성 |
