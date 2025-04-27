"use client";
import { useState, useEffect } from "react";

export default function AdminServiciosPage() {
  const [precios, setPrecios] = useState({
    bano_corte: {
      perro_grande: 0,
      perro_mediano: 0,
      perro_chico: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/servicios")
      .then((res) => res.json())
      .then((data) => {
        setPrecios(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los precios de servicios.");
        setLoading(false);
      });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    setPrecios((prev) => ({
      ...prev,
      bano_corte: {
        ...prev.bano_corte,
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
      const res = await fetch("/api/servicios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(precios),
      });
      if (!res.ok) throw new Error("No se pudo guardar");
      setSuccess("Precios actualizados correctamente");
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  }

  if (loading) return <div className="p-8">Cargando precios...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!precios?.bano_corte) return <div className="p-8 text-red-600">No se pudieron cargar los precios de servicios.</div>;
  return (
    <main className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow mt-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Precios de Servicios</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Baño y Corte - Perro Grande</label>
          <input
            type="number"
            value={precios.bano_corte.perro_grande}
            onChange={(e) => handleChange(e, "perro_grande")}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Baño y Corte - Perro Mediano</label>
          <input
            type="number"
            value={precios.bano_corte.perro_mediano}
            onChange={(e) => handleChange(e, "perro_mediano")}
            className="w-full border px-3 py-2 rounded"
            min={0}
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Baño y Corte - Perro Chico</label>
          <input
            type="number"
            value={precios.bano_corte.perro_chico}
            onChange={(e) => handleChange(e, "perro_chico")}
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
