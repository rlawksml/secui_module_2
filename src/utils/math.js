/**
 * 두 점 사이의 거리 계산
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 벡터 정규화
 */
export function normalize(vector) {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  if (length === 0) {
    return { x: 0, y: 0 };
  }
  return {
    x: vector.x / length,
    y: vector.y / length,
  };
}

/**
 * 벡터 길이 계산
 */
export function vectorLength(vector) {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

/**
 * 두 점 사이의 각도 계산 (라디안)
 */
export function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * 선형 보간
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * 값을 범위 내로 제한
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * 랜덤 정수 생성 (min 이상 max 미만)
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 랜덤 실수 생성 (min 이상 max 미만)
 */
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
