
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
