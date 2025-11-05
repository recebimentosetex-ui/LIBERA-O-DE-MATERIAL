import { Status, FiberStatus } from './types';

export const OPERADORES: string[] = [
  '08 - LUIZ', '08 - FABIO', '05 - EDER', '04 - EVERTON', '03 - LUCAS', '03 - RAFAEL', '01 - ALTIERES',
];

export const RUAS: string[] = [
  'SP - 01', 'SP - 02', 'SP - 03', 'SP - 04', 'SP - 05', 'SP - 06', 'SP - 07', 'SP - 08', 'SP - 09', 'SP - 10',
  'SP - 11', 'SP - 12', 'SP - 13', 'SP - 14', 'SP - 15', 'SP - 16', 'SP - 17', 'SP - 18', 'SP - 19', 'SP - 20',
  'SP - 21', 'SP - 22', 'SP - 23', 'SP - 24', 'SP - 25', 'SP - 26', 'SP - 27', 'SP - 28', 'SP - 29', 'SP - 30',
  'SP - 31', 'SP - 32', 'TENDA', 'STEEL', 'MEZANINO',
];

export const LOCAIS_DE_ENTREGA: string[] = [
  'RAMPA', 'TENDA', 'KANBAN',
];

export const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: Status.Pendente, label: 'MATERIAL ENTREGUE - PENDENTE' },
  { value: Status.Finalizado, label: 'MATERIAL PAGO - FINALIZADO' },
];

export const FIBER_STATUS_OPTIONS: { value: FiberStatus; label: string }[] = [
  { value: FiberStatus.EmEstoque, label: 'EM ESTOQUE' },
  { value: FiberStatus.Pago, label: 'MATERIAL PAGO' },
];
