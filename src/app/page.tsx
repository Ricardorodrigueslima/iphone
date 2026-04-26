"use client";

import { useState, useEffect, useMemo } from "react";
import DeviceCard from "@/components/DeviceCard";
import Filters from "@/components/Filters";
import { Device } from "@/types";


const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || "Cell Store";
const STORE_SLOGAN =
  process.env.NEXT_PUBLIC_STORE_SLOGAN || "Os melhores celulares, no seu bolso";
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5531999999999";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.003 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Home() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [taxaJuros, setTaxaJuros] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    marca: "",
    condicao: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/devices").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ])
      .then(([devicesData, settingsData]) => {
        setDevices(devicesData);
        setTaxaJuros(settingsData.taxaJuros ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredDevices = useMemo(
    () =>
      devices.filter((d) => {
        if (filters.marca && d.marca !== filters.marca) return false;
        if (filters.condicao && d.condicao !== filters.condicao) return false;
        if (filters.minPrice && d.precoVenda < parseFloat(filters.minPrice)) return false;
        if (filters.maxPrice && d.precoVenda > parseFloat(filters.maxPrice)) return false;
        return true;
      }),
    [devices, filters]
  );

  const featuredDevices = useMemo(
    () => filteredDevices.filter((d) => d.destaque && d.status === "Disponível"),
    [filteredDevices]
  );

  const availableDevices = useMemo(
    () => filteredDevices.filter((d) => d.status === "Disponível"),
    [filteredDevices]
  );

  const unavailableDevices = useMemo(
    () => filteredDevices.filter((d) => d.status !== "Disponível"),
    [filteredDevices]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[480px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20">
          <div className="inline-block mb-4 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-blue-100 text-sm font-medium">
            📱 Compra e Revenda de Celulares
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            {STORE_NAME}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {STORE_SLOGAN}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              Ver Catálogo
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-colors shadow-lg inline-flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 80L60 68C120 56 240 32 360 24C480 16 600 24 720 30C840 36 960 40 1080 44C1200 48 1320 52 1380 54L1440 56V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
              className="fill-gray-50 dark:fill-gray-900"
            />
          </svg>
        </div>
      </section>

      {/* Destaques */}
      {featuredDevices.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                ⭐ Destaques
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Os melhores aparelhos selecionados para você
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDevices.slice(0, 3).map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  whatsappNumber={WHATSAPP_NUMBER}
                  variant="featured"
                  taxaJuros={taxaJuros}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Catálogo Completo */}
      <section id="catalog" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              📱 Catálogo Completo
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Todos os aparelhos disponíveis
            </p>
          </div>

          <Filters
            selectedMarca={filters.marca}
            selectedCondicao={filters.condicao}
            minPrice={filters.minPrice}
            maxPrice={filters.maxPrice}
            onMarcaChange={(marca) => setFilters((p) => ({ ...p, marca }))}
            onCondicaoChange={(condicao) => setFilters((p) => ({ ...p, condicao }))}
            onPriceChange={(min, max) => setFilters((p) => ({ ...p, minPrice: min, maxPrice: max }))}
            onClear={() => setFilters({ marca: "", condicao: "", minPrice: "", maxPrice: "" })}
          />

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {availableDevices.length} aparelho(s) disponível(is)
          </p>

          {availableDevices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  whatsappNumber={WHATSAPP_NUMBER}
                  taxaJuros={taxaJuros}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Nenhum aparelho encontrado
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Tente ajustar os filtros de busca
              </p>
            </div>
          )}

          {/* Indisponíveis */}
          {unavailableDevices.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                🔒 Indisponíveis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-60">
                {unavailableDevices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    device={device}
                    whatsappNumber={WHATSAPP_NUMBER}
                    taxaJuros={taxaJuros}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-3">{STORE_NAME}</h3>
              <p className="text-gray-400 text-sm">{STORE_SLOGAN}</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Contato</h3>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Fale no WhatsApp
              </a>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Administração</h3>
              <a
                href="/admin"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Acesso administrativo →
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} {STORE_NAME}. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
