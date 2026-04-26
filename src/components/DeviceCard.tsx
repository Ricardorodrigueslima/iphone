"use client";

import { useState } from "react";
import Image from "next/image";
import { Device } from "@/types";
import {
  formatCurrency,
  getStatusColor,
  getConditionColor,
  getWhatsappUrl,
  generateWhatsappMessage,
} from "@/lib/devices";

interface DeviceCardProps {
  device: Device;
  whatsappNumber: string;
  variant?: "default" | "featured";
  taxaJuros?: number;
}

const PARCELAS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Tabela Price (juros compostos): PMT = PV × [i(1+i)^n] / [(1+i)^n - 1]
function calcPMT(preco: number, taxaMensal: number, n: number): number {
  if (taxaMensal <= 0) return preco / n;
  const i = taxaMensal / 100;
  return (preco * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.003 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function DeviceCard({
  device,
  whatsappNumber,
  variant = "default",
  taxaJuros = 0,
}: DeviceCardProps) {
  const [showSimulator, setShowSimulator] = useState(false);
  const isAvailable = device.status === "Disponível";
  const isFeatured = variant === "featured";

  const message = generateWhatsappMessage(
    device.nome,
    device.precoVenda,
    device.whatsappMsg || undefined
  );
  const whatsappUrl = getWhatsappUrl(whatsappNumber, message);

  const pmt12 = calcPMT(device.precoVenda, taxaJuros, 12);

  return (
    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
      {/* Badge de status */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(device.status)}`}
        >
          {device.status}
        </span>
      </div>

      {/* Badge de condição */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getConditionColor(device.condicao)}`}
        >
          {device.condicao}
        </span>
      </div>

      {/* Imagem */}
      <div className={`relative ${isFeatured ? "h-64" : "h-48"} bg-gray-100 dark:bg-gray-700`}>
        <Image
          src={device.foto}
          alt={device.nome}
          fill
          className="object-cover"
          sizes={
            isFeatured
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-xl">{device.status}</span>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className={`font-semibold text-gray-900 dark:text-white ${isFeatured ? "text-xl" : "text-base"} leading-tight`}>
          {device.nome}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {device.marca} · {device.modelo} · {device.cor}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {device.armazenamento}
        </p>

        <div className="mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Preço</p>
          <p className={`font-bold text-gray-900 dark:text-white ${isFeatured ? "text-2xl" : "text-xl"}`}>
            {formatCurrency(device.precoVenda)}
          </p>
          {isAvailable && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              ou 12x de {formatCurrency(pmt12)}
              {taxaJuros > 0 && ` (${taxaJuros.toFixed(2)}% a.m.)`}
            </p>
          )}
        </div>

        {/* Simulador de parcelas */}
        {isAvailable && (
          <div className="mt-2">
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showSimulator ? "Ocultar parcelas ▴" : "Ver parcelas ▾"}
            </button>
            {showSimulator && (
              <div className="mt-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
                {taxaJuros > 0 && (
                  <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Tabela Price · {taxaJuros.toFixed(2)}% a.m. (juros compostos)
                    </p>
                  </div>
                )}
                {/* À vista */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-600 bg-green-50 dark:bg-green-900/10">
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">
                    À vista
                  </span>
                  <span className="text-xs font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(device.precoVenda)}
                  </span>
                  <span className="text-xs text-green-600 dark:text-green-500">
                    sem juros
                  </span>
                </div>
                {/* Parcelado */}
                <div className="divide-y divide-gray-100 dark:divide-gray-600">
                  {PARCELAS.map((n) => {
                    const pmt = calcPMT(device.precoVenda, taxaJuros, n);
                    const total = pmt * n;
                    const acrescimo = total - device.precoVenda;
                    return (
                      <div key={n} className="flex items-center justify-between px-3 py-2 text-xs">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 w-7">
                          {n}x
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(pmt)}
                        </span>
                        <span className="text-gray-400 dark:text-gray-500 text-right">
                          Total {formatCurrency(total)}
                          {taxaJuros > 0 && (
                            <span className="text-orange-500 dark:text-orange-400 block">
                              +{formatCurrency(acrescimo)}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {isAvailable ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <WhatsAppIcon />
            Tenho interesse
          </a>
        ) : (
          <button
            disabled
            className="mt-4 w-full inline-flex items-center justify-center px-4 py-2.5 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-medium rounded-lg cursor-not-allowed"
          >
            {device.status}
          </button>
        )}
      </div>
    </div>
  );
}
