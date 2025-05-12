'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { PreciosServicios } from '../../admin/servicios/page';

export default function BanoCortePage() {
  const router = useRouter();
  const [precios, setPrecios] = useState<PreciosServicios | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/servicios`)
      .then(r => r.json())
      .then(data => {
        setPrecios(data);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los precios.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Cargando precios...</div>;
  if (error || !precios?.bano_corte) return <div className="p-8 text-red-600">{error || 'No se pudieron cargar los precios.'}</div>;

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-10 px-2 sm:px-4">
      <button onClick={() => router.back()} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold self-start">← Volver atrás</button>
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Baño y Corte para Perros</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
        Servicio completo de baño y corte profesional para perros grandes, medianos y chicos.
        <br />
        Incluye baño, corte de pelo, secado, cepillado y revisión general.
      </p>
      <div className="flex justify-center w-full max-w-4xl">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center p-8 hover:shadow-lg transition max-w-md mx-auto w-full overflow-hidden">
          <div className="flex justify-center gap-4 mb-4">
            <svg className="w-14 h-14 text-blue-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 13s1.5 2 4 2 4-2 4-2" /></svg>
            <svg className="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 13s1 1.5 3 1.5 3-1.5 3-1.5" /></svg>
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 13s.5 1 2 1 2-1 2-1" /></svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">Servicio de Baño y Corte</h2>
          <p className="text-gray-600 mb-4 text-center">Ofrecemos servicio para todos los tamaños de perros.<br/>El precio varía según el tamaño de tu mascota:</p>
          
          <div className="grid grid-cols-3 gap-4 w-full mb-6 text-center">
            <div>
              <div className="font-medium text-gray-700">Perro Chico</div>
              <div className="text-blue-700 font-bold">${precios.bano_corte.perro_chico}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Perro Mediano</div>
              <div className="text-blue-700 font-bold">${precios.bano_corte.perro_mediano}</div>
            </div>
            <div>
              <div className="font-medium text-gray-700">Perro Grande</div>
              <div className="text-blue-700 font-bold">${precios.bano_corte.perro_grande}</div>
            </div>
          </div>
          
          <button 
            className="px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-300 hover:text-blue-900 transition w-full sm:w-auto"
            onClick={() => window.location.href = `/turnos/reservar?servicio=bath%20and%20cut`}
          >
            Solicitar turno
          </button>
        </div>
      </div>
      <Link href="/" className="mt-10 text-blue-600 hover:underline">Volver al inicio</Link>
    </main>
  );
}
