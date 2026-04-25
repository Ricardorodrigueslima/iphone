import { Device, DeviceFormData } from "@/types";
import { v4 as uuidv4 } from "uuid";

export async function getDevices(): Promise<Device[]> {
  try {
    const response = await fetch("/api/devices");
    if (!response.ok) throw new Error("Failed to fetch devices");
    return response.json();
  } catch (error) {
    console.error("Error fetching devices:", error);
    return [];
  }
}

export async function getDeviceById(id: string): Promise<Device | null> {
  try {
    const devices = await getDevices();
    return devices.find((d) => d.id === id) || null;
  } catch (error) {
    console.error("Error fetching device:", error);
    return null;
  }
}

export function calculateLucroMargem(precoCusto: number, precoVenda: number) {
  const lucro = precoVenda - precoCusto;
  const margem = precoCusto > 0 ? (lucro / precoCusto) * 100 : 0;
  return {
    lucro: Math.round(lucro * 100) / 100,
    margem: Math.round(margem * 10) / 10,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export function generateWhatsappMessage(
  deviceName: string,
  price: number,
  defaultMessage?: string
): string {
  const formatted = formatCurrency(price);
  const base =
    defaultMessage ||
    `Olá! Tenho interesse no ${deviceName} por ${formatted}. Ainda está disponível?`;
  return encodeURIComponent(base);
}

export function getWhatsappUrl(phoneNumber: string, message: string): string {
  return `https://wa.me/${phoneNumber}?text=${message}`;
}

export function createDeviceData(formData: DeviceFormData): Device {
  const { lucro, margem } = calculateLucroMargem(
    formData.precoCusto,
    formData.precoVenda
  );
  return { id: uuidv4(), ...formData, lucro, margem };
}

export function updateDeviceData(
  existingDevice: Device,
  formData: Partial<DeviceFormData>
): Device {
  const precoCusto = formData.precoCusto ?? existingDevice.precoCusto;
  const precoVenda = formData.precoVenda ?? existingDevice.precoVenda;
  const { lucro, margem } = calculateLucroMargem(precoCusto, precoVenda);
  return { ...existingDevice, ...formData, lucro, margem };
}

export function calculateStats(devices: Device[]) {
  const totalCadastrados = devices.length;
  const disponiveis = devices.filter((d) => d.status === "Disponível").length;
  const totalInvestido = devices.reduce((sum, d) => sum + d.precoCusto, 0);
  const lucroPotencial = devices
    .filter((d) => d.status === "Disponível")
    .reduce((sum, d) => sum + d.lucro, 0);

  return {
    totalCadastrados,
    disponiveis,
    totalInvestido: Math.round(totalInvestido * 100) / 100,
    lucroPotencial: Math.round(lucroPotencial * 100) / 100,
  };
}

export function validateDeviceForm(data: DeviceFormData): string[] {
  const errors: string[] = [];
  if (!data.nome?.trim()) errors.push("Nome é obrigatório");
  if (!data.marca?.trim()) errors.push("Marca é obrigatória");
  if (!data.modelo?.trim()) errors.push("Modelo é obrigatório");
  if (!data.cor?.trim()) errors.push("Cor é obrigatória");
  if (!data.armazenamento?.trim()) errors.push("Armazenamento é obrigatório");
  if (!data.condicao) errors.push("Condição é obrigatória");
  if (!data.foto?.trim()) errors.push("Foto é obrigatória");
  if (data.precoCusto <= 0) errors.push("Preço de custo deve ser maior que zero");
  if (data.precoVenda <= 0) errors.push("Preço de venda deve ser maior que zero");
  if (!data.dataCompra) errors.push("Data de compra é obrigatória");
  return errors;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "Disponível": return "bg-green-500";
    case "Vendido":    return "bg-gray-500";
    case "Reservado":  return "bg-yellow-500";
    default:           return "bg-gray-500";
  }
}

export function getConditionColor(condicao: string): string {
  switch (condicao) {
    case "Novo":     return "bg-blue-500";
    case "Seminovo": return "bg-purple-500";
    case "Usado":    return "bg-orange-500";
    default:         return "bg-gray-500";
  }
}

export function getLucroColor(lucro: number): string {
  if (lucro > 0) return "text-green-600 dark:text-green-400";
  if (lucro < 0) return "text-red-600 dark:text-red-400";
  return "text-gray-500";
}

export const MARCAS = [
  "Apple",
  "Samsung",
  "Xiaomi",
  "Motorola",
  "OnePlus",
  "Realme",
  "Poco",
  "Infinix",
  "Tecno",
  "Nokia",
  "Outro",
] as const;

export const CONDICOES = ["Novo", "Seminovo", "Usado"] as const;
export const STATUS = ["Disponível", "Vendido", "Reservado"] as const;

export const ARMAZENAMENTOS = [
  "32GB",
  "64GB",
  "128GB",
  "256GB",
  "512GB",
  "1TB",
] as const;

export const CORES = [
  "Preto",
  "Branco",
  "Azul",
  "Verde",
  "Vermelho",
  "Rosa",
  "Dourado",
  "Prata",
  "Cinza",
  "Roxo",
  "Outro",
] as const;
