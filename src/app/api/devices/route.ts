import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Device, DeviceFormData } from "@/types";
import { getDevices, setDevices } from "@/lib/storage";

function calcLucroMargem(precoCusto: number, precoVenda: number) {
  const lucro = precoVenda - precoCusto;
  const margem = precoCusto > 0 ? (lucro / precoCusto) * 100 : 0;
  return {
    lucro: Math.round(lucro * 100) / 100,
    margem: Math.round(margem * 10) / 10,
  };
}

export async function GET() {
  try {
    const devices = await getDevices();
    return NextResponse.json(devices);
  } catch (error) {
    console.error("GET /api/devices error:", error);
    return NextResponse.json({ error: "Erro ao buscar dispositivos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DeviceFormData = await request.json();
    const { lucro, margem } = calcLucroMargem(body.precoCusto, body.precoVenda);
    const newDevice: Device = { id: uuidv4(), ...body, lucro, margem };

    const devices = await getDevices();
    devices.push(newDevice);
    await setDevices(devices);

    return NextResponse.json(newDevice, { status: 201 });
  } catch (error) {
    console.error("POST /api/devices error:", error);
    return NextResponse.json({ error: "Erro ao cadastrar dispositivo" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string; data: Partial<DeviceFormData> } = await request.json();
    const { id, data } = body;

    const devices = await getDevices();
    const index = devices.findIndex((d) => d.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 });
    }

    const existing = devices[index];
    const precoCusto = data.precoCusto ?? existing.precoCusto;
    const precoVenda = data.precoVenda ?? existing.precoVenda;
    const { lucro, margem } = calcLucroMargem(precoCusto, precoVenda);

    devices[index] = { ...existing, ...data, lucro, margem };
    await setDevices(devices);

    return NextResponse.json(devices[index]);
  } catch (error) {
    console.error("PUT /api/devices error:", error);
    return NextResponse.json({ error: "Erro ao atualizar dispositivo" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID obrigatório" }, { status: 400 });
    }

    const devices = await getDevices();
    const filtered = devices.filter((d) => d.id !== id);

    if (filtered.length === devices.length) {
      return NextResponse.json({ error: "Dispositivo não encontrado" }, { status: 404 });
    }

    await setDevices(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/devices error:", error);
    return NextResponse.json({ error: "Erro ao excluir dispositivo" }, { status: 500 });
  }
}
