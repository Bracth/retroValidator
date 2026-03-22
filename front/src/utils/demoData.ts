import { ConsolaId } from '../../../shared/consoles';

export interface DemoCase {
  id: string;
  name: string;
  consolaId: ConsolaId;
  front: string;
  back: string;
  pins?: string;
}

export const demoCases: Record<string, DemoCase> = {
  MK64_ORIGINAL: {
    id: 'MK64_ORIGINAL',
    name: 'MK64 (Original)',
    consolaId: ConsolaId.N64,
    front: '/assets/demos/front_mario_kart_64.webp',
    back: '/assets/demos/back_mario_kart_64.webp',
    pins: '/assets/demos/bottom_mario_kart_64.webp',
  },
  MK64_REPRO: {
    id: 'MK64_REPRO',
    name: 'Resident Evil (Repro)',
    consolaId: ConsolaId.N64,
    front: '/assets/demos/resident_evil_front_repro.jpeg',
    back: '/assets/demos/resident_evil_back_repro.jpg',
    pins: '/assets/demos/resident_evil_bottom_repro.jpg',
  },
  NES_ORIGINAL: {
    id: 'NES_ORIGINAL',
    name: 'Robocop (NES Original)',
    consolaId: ConsolaId.NES,
    front: '/assets/demos/front_robocop_nes.jpg',
    back: '/assets/demos/back_robocop_nes.jpg',
  },
  NES_REPRO: {
    id: 'NES_REPRO',
    name: 'NOTM (NES Repro)',
    consolaId: ConsolaId.NES,
    front: '/assets/demos/front_notm_repro_nes.jpg',
    back: '/assets/demos/back_notm_repro_nes.jpg',
  },
};
