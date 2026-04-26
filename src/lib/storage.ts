import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { kv } from "@vercel/kv";
import { unstable_noStore as noStore } from "next/cache";
import { Device } from "@/types";

const DATA_FILE = join(process.cwd(), "data", "devices.json");
const SETTINGS_FILE = join(process.cwd(), "data", "settings.json");

export interface StoreSettings {
  taxaJuros: number;
}

const DEFAULT_SETTINGS: StoreSettings = { taxaJuros: 0 };

const USE_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

export async function getDevices(): Promise<Device[]> {
  noStore();
  if (USE_KV) {
    const stored = await kv.get<Device[]>("devices");
    if (stored != null) return stored;
    // Auto-migra o JSON bundled na primeira execução em produção
    try {
      const data = await readFile(DATA_FILE, "utf-8");
      const devices: Device[] = JSON.parse(data);
      await kv.set("devices", devices);
      return devices;
    } catch {
      return [];
    }
  }
  try {
    const data = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function setDevices(devices: Device[]): Promise<void> {
  if (USE_KV) {
    await kv.set("devices", devices);
    return;
  }
  await writeFile(DATA_FILE, JSON.stringify(devices, null, 2), "utf-8");
}

export async function getSettings(): Promise<StoreSettings> {
  noStore();
  if (USE_KV) {
    const stored = await kv.get<StoreSettings>("settings");
    return stored ?? DEFAULT_SETTINGS;
  }
  try {
    const data = await readFile(SETTINGS_FILE, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function setSettings(settings: StoreSettings): Promise<void> {
  if (USE_KV) {
    await kv.set("settings", settings);
    return;
  }
  await writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf-8");
}
