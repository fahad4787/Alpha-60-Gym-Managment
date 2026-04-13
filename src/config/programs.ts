export const PROGRAMS = [
  { id: 'weight_loss', label: 'Weight loss challenge' },
  { id: 'strength_conditioning', label: 'Strength and Conditioning' },
  { id: 'martial_arts', label: 'Martial Arts' },
  { id: 'physiotherapy', label: 'Physiotherapy' },
] as const

export type ProgramId = (typeof PROGRAMS)[number]['id']

