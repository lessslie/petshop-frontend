"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PagarTurnoPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    // Llama a la API backend para obtener la preferencia de pago de Mercado Pago (POST)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create/${id}`, { method: 'POST' })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "No se pudo generar el link de pago");
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.init_point) {
          setPaymentUrl(data.init_point);
        } else {
          setError("No se pudo generar el link de pago");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error inesperado");
        setLoading(false);
      });
  }, [id]);

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-10 px-2">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 flex flex-col items-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Pago de Turno</h1>
        {loading ? (
          <p className="text-gray-600">Generando link de pago...</p>
        ) : error ? (
          <div className="text-red-600 font-semibold">{error}</div>
        ) : (
          <>
            <p className="mb-4 text-gray-700">Haz click en el botón para pagar tu turno de forma segura con Mercado Pago.</p>
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded shadow transition-colors text-lg"
            >
              Ir a Mercado Pago
            </a>
            <p className="mt-6 text-sm text-gray-500">Recibirás la confirmación por email una vez realizado el pago.</p>
          </>
        )}
      </div>
    </main>
  );
}
