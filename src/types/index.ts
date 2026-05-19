export type TargetDistance = 3 | 5 | 10;

// GPS 좌표 하나
export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteStep {
  instruction: string;
  distanceFromStartM: number;
}

export interface RunRoute {
  coordinates: Coordinate[]; // 좌표 목록
  distanceKm: number; // 총 거리
  steps: RouteStep[]; // 단계(음성 안내)
}

// 앱의 상태를 나타내는 타입
export type RouteStatus = 'idle' | 'loading' | 'success' | 'error';
