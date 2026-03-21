export interface DemoCase {
  id: string;
  name: string;
  front: string;
  back: string;
  pins: string;
}

export const demoCases: Record<string, DemoCase> = {
  MK64_ORIGINAL: {
    id: 'MK64_ORIGINAL',
    name: 'MK64 (Original)',
    front: '/assets/demos/front_mario_kart_64.webp',
    back: '/assets/demos/back_mario_kart_64.webp',
    pins: '/assets/demos/bottom_mario_kart_64.webp',
  },
  MK64_REPRO: {
    id: 'MK64_REPRO',
    name: 'MK64 (Repro)',
    front: '/assets/demos/front_mario_kart_64.webp',
    back: '/assets/demos/back_mario_kart_64.webp',
    pins: '/assets/demos/bottom_mario_kart_64.webp',
  },
};
