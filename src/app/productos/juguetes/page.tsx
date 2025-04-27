'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JuguetesPage() {
  const router = useRouter();

  function handleBack() {
    router.back();
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center bg-gray-50 py-10 px-2 sm:px-4">
      <button onClick={handleBack} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold self-start">← Volver atrás</button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Juguetes para Mascotas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
        <Link href="/productos/juguetes/perros" className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center p-6 hover:shadow-lg transition min-w-[200px] max-w-xs mx-auto w-full overflow-hidden cursor-pointer">
        <svg className="w-16 h-16 text-blue-200 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" />
          </svg>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Juguetes para Perros</h2>
          <p className="text-gray-600 text-center">Juguetes divertidos y resistentes para tu perro.</p>
        </Link>
        <Link href="/productos/juguetes/gatos" className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center p-6 hover:shadow-lg transition min-w-[200px] max-w-xs mx-auto w-full overflow-hidden cursor-pointer">
        <svg className="w-16 h-16 text-blue-200 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" />
          </svg>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Juguetes para Gatos</h2>
          <p className="text-gray-600 text-center">Entretené a tu gato con juguetes especiales.</p>
        </Link>
      </div>
    </main>
  );
}
