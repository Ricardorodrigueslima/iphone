"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DeviceForm from "@/components/DeviceForm";
import { DeviceFormData } from "@/types";

export default function NewDevicePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin");
    } else {
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, [router]);

  const handleSubmit = async (data: DeviceFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        alert("Erro ao cadastrar dispositivo");
      }
    } catch {
      alert("Erro ao cadastrar dispositivo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cadastrar Novo Aparelho
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Preencha os dados do dispositivo
            </p>
          </div>
          <a
            href="/admin"
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            ← Voltar
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <DeviceForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/admin")}
            isLoading={isSubmitting}
          />
        </div>
      </main>
    </div>
  );
}
