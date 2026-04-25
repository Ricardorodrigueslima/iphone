"use client";

import { MARCAS, CONDICOES } from "@/lib/devices";

interface FiltersProps {
  selectedMarca: string;
  selectedCondicao: string;
  minPrice: string;
  maxPrice: string;
  onMarcaChange: (marca: string) => void;
  onCondicaoChange: (condicao: string) => void;
  onPriceChange: (min: string, max: string) => void;
  onClear: () => void;
}

export default function Filters({
  selectedMarca,
  selectedCondicao,
  minPrice,
  maxPrice,
  onMarcaChange,
  onCondicaoChange,
  onPriceChange,
  onClear,
}: FiltersProps) {
  const hasFilters = selectedMarca || selectedCondicao || minPrice || maxPrice;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Marca
          </label>
          <select
            value={selectedMarca}
            onChange={(e) => onMarcaChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as marcas</option>
            {MARCAS.map((marca) => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Condição
          </label>
          <select
            value={selectedCondicao}
            onChange={(e) => onCondicaoChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas as condições</option>
            {CONDICOES.map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Faixa de Preço (R$)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              value={minPrice}
              onChange={(e) => onPriceChange(e.target.value, maxPrice)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Máx"
              value={maxPrice}
              onChange={(e) => onPriceChange(minPrice, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {hasFilters && (
          <div className="flex items-end">
            <button
              onClick={onClear}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
