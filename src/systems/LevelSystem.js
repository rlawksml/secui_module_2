export class LevelSystem {
  constructor(game) {
    this.game = game;
  }

  update(deltaTime) {
    // 경험치 및 레벨 진행 관리
    // 주로 CombatSystem에서 처리되지만, 추가 로직이 필요할 경우 여기에 작성
  }

  calculateExperienceToNextLevel(level) {
    // 공식: expToNextLevel = 10 * level^1.5
    return Math.floor(10 * Math.pow(level, 1.5));
  }
}
