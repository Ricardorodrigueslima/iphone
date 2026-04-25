export interface Device {
  id: string;
  nome: string;
  marca: string;
  modelo: string;
  cor: string;
  armazenamento: string;
  condicao: "Novo" | "Seminovo" | "Usado";
  descricao: string;
  foto: string;
  precoCusto: number;
  precoVenda: number;
  lucro: number;
  margem: number;
  dataCompra: string;
  status: "Dispon\u00edvel" | "Vendido" | "Reservado";
  destaque: boolean;
  whatsappMsg: string;
}

export interface DeviceFormData {
  nome: string;
  marca: string;
  modelo: string;
  cor: string;
  armazenamento: string;
  condicao: "Novo" | "Seminovo" | "Usado";
  descricao: string;
  foto: string;
  precoCusto: number;
  precoVenda: number;
  dataCompra: string;
  status: "Dispon\u00edvel" | "Vendido" | "Reservado";
  destaque: boolean;
  whatsappMsg: string;
}

export type DeviceStatus = "Dispon\u00edvel" | "Vendido" | "Reservado";
export type DeviceCondition = "Novo" | "Seminovo" | "Usado";

export interface DashboardStats {
  totalCadastrados: number;
  disponiveis: number;
  totalInvestido: number;
  lucroPotencial: number;
}