"use client";

import { useState } from "react";
import Image from "next/image";
import { Device } from "@/types";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getConditionColor,
  getLucroColor,
} from "@/lib/devices";

interface DeviceTableProps {
  devices: Device[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkSold: (id: string) => void;
  actionLoading?: string | null;
}

type SortField =
  | "nome"
  | "precoCusto"
  | "precoVenda"
  | "lucro"
  | "margem"
  | "dataCompra"
  | "status";
type SortOrder = "asc" | "desc";

export default function DeviceTable({
  devices,
  onEdit,
  onDelete,
  onMarkSold,
  actionLoading,
}: DeviceTableProps) {
  const [sortField, setSortField] = useState<SortField>("dataCompra");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMarca, setFilterMarca] = useState("");

  const marcas = Array.from(new Set(devices.map((d) => d.marca))).sort();

  const filteredDevices = devices.filter((device) => {
    if (filterStatus && device.status !== filterStatus) return false;
    if (filterMarca && device.marca !== filterMarca) return false;
    return true;
  });

  const sortedDevices = [...filteredDevices].sort((a, b) => {
    let cmp = 0;
    switch (sortField) {
      case "nome":       cmp = a.nome.localeCompare(b.nome); break;
      case "precoCusto": cmp = a.precoCusto - b.precoCusto; break;
      case "precoVenda": cmp = a.precoVenda - b.precoVenda; break;
      case "lucro":      cmp = a.lucro - b.lucro; break;
      case "margem":     cmp = a.margem - b.margem; break;
      case "dataCompra": cmp = new Date(a.dataCompra).getTime() - new Date(b.dataCompra).getTime(); break;
      case "status":     cmp = a.status.localeCompare(b.status); break;
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="ml-1 text-gray-300">↕</span>;
    return (
      <span className="ml-1 text-blue-500">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Filtros */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Todos</option>
            <option value="Disponível">Disponível</option>
            <option value="Vendido">Vendido</option>
            <option value="Reservado">Reservado</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">
            Marca
          </label>
          <select
            value={filterMarca}
            onChange={(e) => setFilterMarca(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="">Todas</option>
            {marcas.map((marca) => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end ml-auto">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredDevices.length} dispositivo(s)
          </span>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-14">
                Foto
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort("nome")}
              >
                Nome <SortIcon field="nome" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Condição
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort("precoCusto")}
              >
                Custo <SortIcon field="precoCusto" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort("precoVenda")}
              >
                Venda <SortIcon field="precoVenda" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort("lucro")}
              >
                Lucro <SortIcon field="lucro" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort("margem")}
              >
                Margem <SortIcon field="margem" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort("dataCompra")}
              >
                Data <SortIcon field="dataCompra" />
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none"
                onClick={() => handleSort("status")}
              >
                Status <SortIcon field="status" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedDevices.map((device) => {
              const isLoading = actionLoading === device.id;
              return (
                <tr
                  key={device.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${isLoading ? "opacity-50" : ""}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={device.foto}
                        alt={device.nome}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {device.nome}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {device.marca} · {device.cor} · {device.armazenamento}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${getConditionColor(device.condicao)}`}
                    >
                      {device.condicao}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(device.precoCusto)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(device.precoVenda)}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${getLucroColor(device.lucro)}`}>
                    {formatCurrency(device.lucro)}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${getLucroColor(device.lucro)}`}>
                    {device.margem.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(device.dataCompra)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${getStatusColor(device.status)}`}
                    >
                      {device.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(device.id)}
                        disabled={isLoading}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        title="Editar"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      {device.status === "Disponível" && (
                        <button
                          onClick={() => onMarkSold(device.id)}
                          disabled={isLoading}
                          className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                          title="Marcar como vendido"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(device.id)}
                        disabled={isLoading}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Excluir"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedDevices.length === 0 && (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Nenhum dispositivo encontrado.
        </div>
      )}
    </div>
  );
}
