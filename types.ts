export enum Status {
  Pendente = 'MATERIAL ENTREGUE - PENDENTE',
  Finalizado = 'MATERIAL PAGO - FINALIZADO',
}

export interface Release {
  id: number;
  material: string;
  operador: string;
  rua: string;
  localDeEntrega: string;
  data: string;
  status: Status;
  sm: string;
}

export enum FiberStatus {
  EmEstoque = 'EM ESTOQUE',
  Pago = 'MATERIAL PAGO',
}

export interface FiberStockItem {
  id: number;
  material: string;
  lote: string;
  qtd: string;
  prateleira: string;
  rua: string;
  sala: string;
  status: FiberStatus;
  sm: string;
}
