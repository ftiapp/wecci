"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";

/** จุดเริ่มต้นเมื่อยังไม่เคยปักหมุด — กลางกรุงเทพฯ */
const FALLBACK: [number, number] = [13.7563, 100.5018];

/** อ่านค่า "lat, lng" ที่บันทึกไว้ คืน null ถ้ายังไม่มีหรือรูปแบบไม่ถูก */
function parseLatLng(value: string): [number, number] | null {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;

  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;

  return [lat, lng];
}

/**
 * แผนที่สำหรับปักหมุด — คลิกหรือลากหมุดเพื่อย้ายตำแหน่ง
 * ค่าที่ได้เก็บเป็นข้อความ "ละติจูด, ลองจิจูด" ส่งไปกับฟอร์มผ่าน input ซ่อน
 * ใช้ Leaflet กับแผนที่ OpenStreetMap จึงไม่ต้องใช้ API key
 */
export function MapPicker({
  name,
  label,
  help,
  defaultValue,
}: {
  name: string;
  label: string;
  help?: string;
  defaultValue: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  const [position, setPosition] = useState<[number, number] | null>(() =>
    parseLatLng(defaultValue),
  );
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  /** ย้ายหมุดและเลื่อนแผนที่ไปยังพิกัดที่กำหนด */
  function pinAt(lat: number, lng: number) {
    setPosition([lat, lng]);
    markerRef.current?.setLatLng([lat, lng]);
    mapRef.current?.setView([lat, lng], 17);
  }

  /** ค้นหาที่อยู่ด้วย Nominatim ของ OpenStreetMap — ใช้ได้ฟรีไม่ต้องมี API key */
  async function searchAddress() {
    const keyword = query.trim();
    if (!keyword) return;

    setBusy(true);
    setMessage(null);

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&accept-language=th&q=${encodeURIComponent(keyword)}`;
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      const results = (await response.json()) as { lat: string; lon: string }[];

      if (results.length === 0) {
        setMessage("ไม่พบที่อยู่นี้ ลองพิมพ์ให้ละเอียดขึ้นหรือคลิกบนแผนที่แทน");
        return;
      }

      pinAt(Number(results[0].lat), Number(results[0].lon));
    } catch {
      setMessage("ค้นหาไม่สำเร็จ ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
    } finally {
      setBusy(false);
    }
  }

  /** ใช้ตำแหน่งของเครื่องที่กำลังใช้งานอยู่ */
  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setMessage("เบราว์เซอร์นี้ไม่รองรับการหาตำแหน่ง");
      return;
    }

    setBusy(true);
    setMessage(null);

    navigator.geolocation.getCurrentPosition(
      (result) => {
        pinAt(result.coords.latitude, result.coords.longitude);
        setBusy(false);
      },
      () => {
        setMessage("ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง — กดอนุญาตในเบราว์เซอร์แล้วลองใหม่");
        setBusy(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let cancelled = false;

    // โหลด Leaflet ตอนรันในเบราว์เซอร์เท่านั้น เพราะมันอ้างถึง window
    void import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;

      const start = parseLatLng(defaultValue) ?? FALLBACK;
      const map = L.map(containerRef.current).setView(start, 16);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      // ไอคอนเริ่มต้นของ Leaflet อ้างไฟล์ภาพจาก CDN จึงวาดหมุดเองด้วย HTML แทน
      const icon = L.divIcon({
        className: "",
        html: `<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#e2231a;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35)"></span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker(start, { icon, draggable: true }).addTo(map);

      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        setPosition([lat, lng]);
      });

      map.on("click", (event) => {
        const { lat, lng } = event.latlng;
        marker.setLatLng([lat, lng]);
        setPosition([lat, lng]);
      });

      mapRef.current = map;
      markerRef.current = marker;
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [defaultValue]);

  const value = position ? `${position[0].toFixed(6)}, ${position[1].toFixed(6)}` : "";

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</span>

      <input type="hidden" name={name} value={value} />

      {/* Leaflet ต้องมีสไตล์ของตัวเอง โหลดจากไฟล์ในแพ็กเกจ */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        // eslint-disable-next-line react/no-unknown-property
        precedence="default"
      />

      {/* ค้นหาที่อยู่ หรือดึงตำแหน่งของเครื่องที่ใช้อยู่ */}
      <div className="mb-2 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              // อยู่ในฟอร์มใหญ่ ต้องกันไม่ให้ Enter สั่งบันทึกทั้งบล็อก
              event.preventDefault();
              void searchAddress();
            }
          }}
          placeholder="พิมพ์ที่อยู่หรือชื่อสถานที่ แล้วกดค้นหา"
          className="min-w-56 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm outline-none transition focus:border-wecci-blue focus:ring-2 focus:ring-wecci-blue/20"
        />

        <button
          type="button"
          onClick={() => void searchAddress()}
          disabled={busy}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue disabled:opacity-50"
        >
          ค้นหา
        </button>

        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={busy}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue disabled:opacity-50"
        >
          ใช้ตำแหน่งปัจจุบัน
        </button>
      </div>

      {message && <p className="mb-2 text-xs text-red-600">{message}</p>}

      <div
        ref={containerRef}
        className="h-[32rem] w-full overflow-hidden rounded-xl border border-slate-200"
      />

      <p className="mt-2 text-xs text-slate-400">
        {position ? "คลิกบนแผนที่หรือลากหมุดเพื่อย้ายตำแหน่ง" : "คลิกบนแผนที่เพื่อปักหมุด"}
      </p>

      {help && <p className="mt-1 text-xs text-slate-400">{help}</p>}
    </div>
  );
}
