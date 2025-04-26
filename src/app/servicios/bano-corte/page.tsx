'use client';
import Link from 'next/link';

export default function BanoCortePage() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Bañooo y Corte para Perros</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-2xl text-center">
        Servicio completo de baño y corte profesional para perros grandes, medianos y chicos.
        <br />
        Incluye baño, corte de pelo, secado, cepillado y revisión general.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {[
          {
            size: 'Perro Grande',
            price: '$5000',
            description: 'Para perros de más de 25kg. Incluye baño, corte y cepillado.',
            icon: (
              <svg className="w-14 h-14 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 15s1.5-2 4-2 4 2 4 2" /></svg>
            ),
          },
          {
            size: 'Perro Mediano',
            price: '$3500',
            description: 'Para perros de 10kg a 25kg. Incluye baño, corte y cepillado.',
            icon: (
              <svg className="w-14 h-14 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 15s1-1.5 3-1.5 3 1.5 3 1.5" /></svg>
            ),
          },
          {
            size: 'Perro Chico',
            price: '$2500',
            description: 'Para perros de menos de 10kg. Incluye baño, corte y cepillado.',
            icon: (
              <svg className="w-14 h-14 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M10 15s.5-1 2-1 2 1 2 1" /></svg>
            ),
          },
        ].map((service) => (
          <div
            key={service.size}
            className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center p-6 hover:shadow-lg transition"
          >
            {service.icon}
            <h2 className="text-lg font-semibold text-gray-800 mb-1 mt-2">{service.size}</h2>
            <p className="text-gray-500 mb-2 text-center">{service.description}</p>
            <div className="text-blue-700 font-bold text-xl mb-4">{service.price}</div>
            <button className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-300 hover:text-blue-900 transition"
              onClick={() => window.location.href = `/turnos/reservar?servicio=ba%C3%B1o%20y%20corte&size=${service.size.toLowerCase().replace('perro ', '')}`}
            >
              Solicitar turno
            </button>
          </div>
        ))}
      </div>
      <Link href="/" className="mt-10 text-blue-600 hover:underline">Volver al inicio</Link>
    </main>
  );
}
