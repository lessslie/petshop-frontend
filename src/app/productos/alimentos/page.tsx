'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AlimentosPage() {
  const router = useRouter();
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-10 px-2 sm:px-4">
      <button onClick={() => router.back()} className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-semibold self-start">← Volver atrás</button>
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Alimentos para Mascotas</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
        Gran variedad de alimentos premium y balanceados para perros y gatos de todas las edades y tamaños.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">
        {/* Card Perros */}
        <Link href="/productos/alimentos/perros" className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center p-6 hover:shadow-lg transition min-w-[200px] max-w-xs mx-auto w-full overflow-hidden">
          <svg className="w-14 h-14 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 7h6"/></svg>
          <h2 className="text-lg font-semibold text-gray-800 mb-1 mt-2 text-center">Alimento para Perros</h2>
          <p className="text-gray-500 mb-2 text-center">Bolsas de 3kg, 7kg y 15kg. Marcas premium y económicas.</p>
          <span className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-300 hover:text-blue-900 transition mt-2 w-full sm:w-auto text-center">Ver productos</span>
        </Link>
        {/* Card Gatos */}
        <Link href="/productos/alimentos/gatos" className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center p-6 hover:shadow-lg transition min-w-[200px] max-w-xs mx-auto w-full overflow-hidden">
          <svg className="w-14 h-14 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M15 7H9"/></svg>
          <h2 className="text-lg font-semibold text-gray-800 mb-1 mt-2 text-center">Alimento para Gatos</h2>
          <p className="text-gray-500 mb-2 text-center">Bolsas de 1kg, 3kg y 7kg. Marcas premium y económicas.</p>
          <span className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-300 hover:text-blue-900 transition mt-2 w-full sm:w-auto text-center">Ver productos</span>
        </Link>
      </div>
      <Link href="/" className="mt-10 text-blue-600 hover:underline">Volver al inicio</Link>
    </main>
  );
}
