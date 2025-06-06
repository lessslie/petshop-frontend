"use client";
import { useState, useEffect } from "react";

function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

// Tipo para los precios de servicios
export type PreciosServicios = {
  bano: {
    perro_grande: number;
    perro_mediano: number;
    perro_chico: number;
  };
  bano_corte: {
    perro_grande: number;
    perro_mediano: number;
    perro_chico: number;
  };
};

export default function AdminServiciosPage() {
  const [precios, setPrecios] = useState<PreciosServicios | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = getToken();
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicios`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        // Asegura que siempre haya estructura para bano y bano_corte
        setPrecios({
          bano: data.bano || { perro_grande: 0, perro_mediano: 0, perro_chico: 0 },
          bano_corte: data.bano_corte || { perro_grande: 0, perro_mediano: 0, perro_chico: 0 },
        });
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los precios de servicios.");
        setLoading(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, tipo: 'bano' | 'bano_corte', key: string) {
    setPrecios((prev) => ({
      ...prev!,
      [tipo]: {
        ...prev![tipo],
        [key]: Number(e.target.value),
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const token = getToken ();
  
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicios`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(precios),
      });
      if (!res.ok) throw new Error("No se pudo guardar");
      setSuccess("Precios actualizados correctamente");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Error desconocido');
    }
    setSaving(false);
  }

  if (loading) return <div className="p-8">Cargando precios...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!precios?.bano || !precios?.bano_corte) return <div className="p-8 text-red-600">No se pudieron cargar los precios de servicios.</div>;
  return (
    <main className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Precios de Servicios</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Baño solo */}
        <div>
          <label className="block font-semibold mb-2">Baño solo - Perro Grande</label>
          <input
            type="number"
            value={precios.bano.perro_grande}
            onChange={(e) => handleChange(e, "bano", "perro_grande")}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Baño solo - Perro Mediano</label>
          <input
            type="number"
            value={precios.bano.perro_mediano}
            onChange={(e) => handleChange(e, "bano", "perro_mediano")}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Baño solo - Perro Chico</label>
          <input
            type="number"
            value={precios.bano.perro_chico}
            onChange={(e) => handleChange(e, "bano", "perro_chico")}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>
        {/* Baño y corte */}
        <div>
          <label className="block font-semibold mb-2">Baño y Corte - Perro Grande</label>
          <input
            type="number"
            value={precios.bano_corte.perro_grande}
            onChange={(e) => handleChange(e, "bano_corte", "perro_grande")}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Baño y Corte - Perro Mediano</label>
          <input
            type="number"
            value={precios.bano_corte.perro_mediano}
            onChange={(e) => handleChange(e, "bano_corte", "perro_mediano")}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Baño y Corte - Perro Chico</label>
          <input
            type="number"
            value={precios.bano_corte.perro_chico}
            onChange={(e) => handleChange(e, "bano_corte", "perro_chico")}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>
        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        {success && <div className="text-green-600 font-semibold">{success}</div>}
      </form>
    </main>
  );
}
