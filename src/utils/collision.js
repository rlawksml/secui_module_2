/**
 * 원-원 충돌 감지
 */
export function checkCircleCollision(pos1, radius1, pos2, radius2) {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < radius1 + radius2;
}

/**
 * 점-원 충돌 감지
 */
export function checkPointInCircle(pointX, pointY, circleX, circleY, radius) {
  const dx = pointX - circleX;
  const dy = pointY - circleY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < radius;
}

/**
 * 사각형-사각형 충돌 감지 (AABB)
 */
export function checkRectCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

/**
 * 원-사각형 충돌 감지
 */
export function checkCircleRectCollision(circleX, circleY, radius, rect) {
  // 가장 가까운 점 찾기
  const closestX = clamp(circleX, rect.x, rect.x + rect.width);
  const closestY = clamp(circleY, rect.y, rect.y + rect.height);

  // 거리 계산
  const dx = circleX - closestX;
  const dy = circleY - closestY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < radius;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 공간 분할을 위한 그리드 시스템 (최적화용)
 */
export class SpatialGrid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  getCellKey(x, y) {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  insert(entity) {
    const key = this.getCellKey(entity.position.x, entity.position.y);
    if (!this.grid.has(key)) {
      this.grid.set(key, []);
    }
    this.grid.get(key).push(entity);
  }

  query(x, y, radius) {
    const results = [];
    const cellRadius = Math.ceil(radius / this.cellSize);

    const centerCellX = Math.floor(x / this.cellSize);
    const centerCellY = Math.floor(y / this.cellSize);

    for (let dx = -cellRadius; dx <= cellRadius; dx++) {
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        const key = `${centerCellX + dx},${centerCellY + dy}`;
        if (this.grid.has(key)) {
          results.push(...this.grid.get(key));
        }
      }
    }

    return results;
  }

  clear() {
    this.grid.clear();
  }
}
