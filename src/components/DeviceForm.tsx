"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { DeviceFormData, Device } from "@/types";
import {
  MARCAS,
  CONDICOES,
  STATUS,
  ARMAZENAMENTOS,
  CORES,
  formatCurrency,
  calculateLucroMargem,
} from "@/lib/devices";

interface DeviceFormProps {
  device?: Device;
  onSubmit: (data: DeviceFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const inputClass =
  "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent";

const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

export default function DeviceForm({
  device,
  onSubmit,
  onCancel,
  isLoading,
}: DeviceFormProps) {
  const [formData, setFormData] = useState<DeviceFormData>({
    nome: "",
    marca: "",
    modelo: "",
    cor: "",
    armazenamento: "",
    condicao: "Seminovo",
    descricao: "",
    foto: "",
    precoCusto: 0,
    precoVenda: 0,
    dataCompra: new Date().toISOString().split("T")[0],
    status: "Disponível",
    destaque: false,
    whatsappMsg: "",
  });

  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (device) {
      setFormData({
        nome: device.nome,
        marca: device.marca,
        modelo: device.modelo,
        cor: device.cor,
        armazenamento: device.armazenamento,
        condicao: device.condicao,
        descricao: device.descricao,
        foto: device.foto,
        precoCusto: device.precoCusto,
        precoVenda: device.precoVenda,
        dataCompra: device.dataCompra,
        status: device.status,
        destaque: device.destaque,
        whatsappMsg: device.whatsappMsg,
      });
    }
  }, [device]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
    if (name === "foto") setPreviewError(false);
  };

  const { lucro, margem } = calculateLucroMargem(
    formData.precoCusto,
    formData.precoVenda
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* URL da Imagem */}
      <div>
        <label className={labelClass}>URL da Imagem *</label>
        <input
          type="url"
          name="foto"
          value={formData.foto}
          onChange={handleChange}
          placeholder="https://exemplo.com/imagem.jpg"
          className={inputClass}
          required
        />
        {formData.foto && (
          <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
            {!previewError ? (
              <Image
                src={formData.foto}
                alt="Preview"
                fill
                className="object-cover"
                onError={() => setPreviewError(true)}
                sizes="100vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                URL de imagem inválida
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nome e Marca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nome do Aparelho *</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Ex: iPhone 13 128GB"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Marca *</label>
          <select name="marca" value={formData.marca} onChange={handleChange} className={inputClass} required>
            <option value="">Selecione a marca</option>
            {MARCAS.map((marca) => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Modelo e Cor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Modelo *</label>
          <input
            type="text"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            placeholder="Ex: iPhone 13"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Cor *</label>
          <select name="cor" value={formData.cor} onChange={handleChange} className={inputClass} required>
            <option value="">Selecione a cor</option>
            {CORES.map((cor) => (
              <option key={cor} value={cor}>{cor}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Armazenamento e Condição */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Armazenamento *</label>
          <select name="armazenamento" value={formData.armazenamento} onChange={handleChange} className={inputClass} required>
            <option value="">Selecione o armazenamento</option>
            {ARMAZENAMENTOS.map((arm) => (
              <option key={arm} value={arm}>{arm}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Condição *</label>
          <select name="condicao" value={formData.condicao} onChange={handleChange} className={inputClass} required>
            {CONDICOES.map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Preços */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Preço de Custo (R$) *</label>
          <input
            type="number"
            name="precoCusto"
            value={formData.precoCusto}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Preço de Venda (R$) *</label>
          <input
            type="number"
            name="precoVenda"
            value={formData.precoVenda}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Lucro e Margem (calculados automaticamente) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Lucro (calculado)
          </p>
          <p className={`text-2xl font-bold ${lucro >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {formatCurrency(lucro)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Margem (calculada)
          </p>
          <p className={`text-2xl font-bold ${margem >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {margem.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Data de Compra e Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Data de Compra *</label>
          <input
            type="date"
            name="dataCompra"
            value={formData.dataCompra}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
            {STATUS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Descrição */}
      <div>
        <label className={labelClass}>Descrição</label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={handleChange}
          rows={3}
          placeholder="Estado do aparelho, acessórios incluídos, etc."
          className={inputClass}
        />
      </div>

      {/* Mensagem WhatsApp */}
      <div>
        <label className={labelClass}>Mensagem Personalizada para WhatsApp</label>
        <textarea
          name="whatsappMsg"
          value={formData.whatsappMsg}
          onChange={handleChange}
          rows={2}
          placeholder='Deixe vazio para usar a mensagem padrão'
          className={inputClass}
        />
        <p className="text-xs text-gray-500 mt-1">
          Padrão: &quot;Olá! Tenho interesse no {"{nome}"} por {"{preço}"}. Ainda está disponível?&quot;
        </p>
      </div>

      {/* Destaque */}
      <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <input
          type="checkbox"
          name="destaque"
          id="destaque"
          checked={formData.destaque}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="destaque" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          ⭐ Exibir em destaque na página inicial
        </label>
      </div>

      {/* Botões */}
      <div className="flex gap-4 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors font-medium"
        >
          {isLoading ? "Salvando..." : device ? "Atualizar" : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
