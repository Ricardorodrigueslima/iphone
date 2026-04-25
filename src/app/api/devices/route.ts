import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import { Device, DeviceFormData } from "@/types";

const DATA_FILE = join(process.cwd(), "data", "devices.json");

async function readDevices(): Promise<Device[]> {
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeDevices(devices: Device[]): Promise<void> {
  await writeFile(DATA_FILE, JSON.stringify(devices, null, 2), "utf-8");
}

function calculateLucroMargem(precoCusto: number, precoVenda: number) {
  const lucro = precoVenda - precoCusto;
  const margem = precoCusto > 0 ? (lucro / precoCusto) * 100 : 0;
  return {
    lucro: Math.round(lucro * 100) / 100,
    margem: Math.round(margem * 10) / 10,
  };
}

export async function GET() {
  try {
    const devices = await readDevices();
    return NextResponse.json(devices);
  } catch (error) {
    console.error("Error reading devices:", error);
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: DeviceFormData = await request.json();
    const { lucro, margem } = calculateLucroMargem(body.precoCusto, body.precoVenda);

    const devices = await readDevices();
    const newDevice: Device = { id: uuidv4(), ...body, lucro, margem };
    devices.push(newDevice);
    await writeDevices(devices);

    return NextResponse.json(newDevice, { status: 201 });
  } catch (error) {
    console.error("Error creating device:", error);
    return NextResponse.json({ error: "Failed to create device" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: { id: string; data: Partial<DeviceFormData> } = await request.json();
    const { id, data } = body;

    const devices = await readDevices();
    const index = devices.findIndex((d) => d.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    const existing = devices[index];
    const precoCusto = data.precoCusto ?? existing.precoCusto;
    const precoVenda = data.precoVenda ?? existing.precoVenda;
    const { lucro, margem } = calculateLucroMargem(precoCusto, precoVenda);

    devices[index] = { ...existing, ...data, lucro, margem };
    await writeDevices(devices);

    return NextResponse.json(devices[index]);
  } catch (error) {
    console.error("Error updating device:", error);
    return NextResponse.json({ error: "Failed to update device" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Device ID is required" }, { status: 400 });
    }

    const devices = await readDevices();
    const filtered = devices.filter((d) => d.id !== id);

    if (filtered.length === devices.length) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    await writeDevices(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting device:", error);
    return NextResponse.json({ error: "Failed to delete device" }, { status: 500 });
  }
}
