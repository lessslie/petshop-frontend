'use client';
import Link from 'next/link';

export default function JuguetesPage() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Juguetes para Mascotas</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
        Juguetes resistentes, seguros y divertidos para perros y gatos de todas las edades.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {[
          {
            name: 'Juguetes para Perros',
            description: 'Pelotas, sogas, mordillos y más. Materiales resistentes.',
            icon: (
              <svg className="w-14 h-14 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8"/></svg>
            ),
          },
          {
            name: 'Juguetes para Gatos',
            description: 'Ratones, cañas, pelotas con sonido y más.',
            icon: (
              <svg className="w-14 h-14 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M16 12H8"/></svg>
            ),
          },
        ].map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center p-6 hover:shadow-lg transition"
          >
            {item.icon}
            <h2 className="text-lg font-semibold text-gray-800 mb-1 mt-2">{item.name}</h2>
            <p className="text-gray-500 mb-2 text-center">{item.description}</p>
            <button className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-300 hover:text-blue-900 transition">
              Ver productos
            </button>
          </div>
        ))}
      </div>
      <Link href="/" className="mt-10 text-blue-600 hover:underline">Volver al inicio</Link>
    </main>
  );
}
