"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StatsCards from "@/components/StatsCards";
import DeviceTable from "@/components/DeviceTable";
import LoginForm from "@/components/LoginForm";
import { Device, DashboardStats } from "@/types";
import { calculateStats } from "@/lib/devices";
import { StoreSettings } from "@/lib/storage";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [settings, setSettings] = useState<StoreSettings>({ taxaJuros: 0 });
  const [taxaInput, setTaxaInput] = useState("0");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setShowLogin(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        setSettings(s);
        setTaxaInput(String(s.taxaJuros ?? 0));
      })
      .catch(console.error);
  }, [isAuthenticated]);

  const fetchDevices = useCallback(async () => {
    try {
      const response = await fetch("/api/devices");
      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error("Error fetching devices:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDevices();
    }
  }, [isAuthenticated, fetchDevices]);

  const stats: DashboardStats = calculateStats(devices);

  const handleLogin = async (password: string) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        localStorage.setItem("admin_auth", "true");
        setIsAuthenticated(true);
        setShowLogin(false);
        setLoginError("");
      } else {
        setLoginError("Senha incorreta. Tente novamente.");
      }
    } catch {
      setLoginError("Erro de conexão. Tente novamente.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setShowLogin(true);
    setDevices([]);
    setLoading(true);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/editar/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este dispositivo?")) return;

    setActionLoading(id);
    try {
      const response = await fetch(`/api/devices?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        setDevices((prev) => prev.filter((d) => d.id !== id));
      } else {
        alert("Erro ao excluir dispositivo");
      }
    } catch {
      alert("Erro ao excluir dispositivo");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    setSettingsSaved(false);
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taxaJuros: parseFloat(taxaInput) || 0 }),
      });
      if (response.ok) {
        const updated = await response.json();
        setSettings(updated);
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2500);
      } else {
        alert("Erro ao salvar configurações");
      }
    } catch {
      alert("Erro ao salvar configurações");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleMarkSold = async (id: string) => {
    if (!confirm("Marcar este dispositivo como vendido?")) return;

    setActionLoading(id);
    try {
      const response = await fetch("/api/devices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, data: { status: "Vendido" } }),
      });
      if (response.ok) {
        const updated = await response.json();
        setDevices((prev) => prev.map((d) => (d.id === id ? updated : d)));
      } else {
        alert("Erro ao atualizar status");
      }
    } catch {
      alert("Erro ao atualizar status");
    } finally {
      setActionLoading(null);
    }
  };

  if (showLogin && !isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Painel Administrativo
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gerencie seus dispositivos
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Ver Loja
            </a>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <StatsCards stats={stats} />

        {/* Configurações da Loja */}
        <div className="mt-6 mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border-l-4 border-blue-500">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
            Taxa de juros da maquininha
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div className="flex-1">
              <input
                type="number"
                value={taxaInput}
                onChange={(e) => setTaxaInput(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Ex: 3.99"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                % ao mês cobrado pela maquininha ao parcelar. Aparece no simulador do catálogo.
              </p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 transition-colors font-medium whitespace-nowrap"
            >
              {savingSettings ? "Salvando..." : settingsSaved ? "Salvo!" : "Salvar taxa"}
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Dispositivos Cadastrados
          </h2>
          <a
            href="/admin/novo"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Cadastrar novo aparelho
          </a>
        </div>

        <DeviceTable
          devices={devices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMarkSold={handleMarkSold}
          actionLoading={actionLoading}
        />

      </main>
    </div>
  );
}
