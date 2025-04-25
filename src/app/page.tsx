'use client';
import Link from 'next/link';

// Heroicons SVGs (inline, para no depender de imágenes externas)
const icons = {
  bano: (
    <svg className="w-16 h-16 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 20h16M4 8V6a4 4 0 118 0v2m4 0h-8m0 0v6m0-6h8m0 0v6" />
    </svg>
  ),
  corte: (
    <svg className="w-16 h-16 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12l4.553-4.553a2.121 2.121 0 10-3-3L12 9m0 0L7.447 4.447a2.121 2.121 0 10-3 3L9 12m3-3v12" />
    </svg>
  ),
  alimentos: (
    <svg className="w-16 h-16 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m6-6a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
  ),
  ropa: (
    <svg className="w-16 h-16 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0M4 7v10a4 4 0 004 4h8a4 4 0 004-4V7" />
    </svg>
  ),
  juguetes: (
    <svg className="w-16 h-16 text-blue-200 mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364l-1.414 1.414M6.05 17.95l-1.414 1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464" />
    </svg>
  ),
};

const sections = [
  {
    title: 'Peluquería',
    description: 'Baño y corte para perros grandes, medianos y chicos.',
    icon: icons.corte,
    link: '/servicios/bano-corte',
  },
  {
    title: 'Alimentos',
    description: 'Alimentos para perros y gatos de todas las edades.',
    icon: icons.alimentos,
    link: '/productos/alimentos',
  },
  {
    title: 'Ropa',
    description: 'Ropa para perros y gatos, todas las temporadas.',
    icon: icons.ropa,
    link: '/productos/ropa',
  },
  {
    title: 'Juguetes',
    description: 'Juguetes para mascotas, diversión asegurada.',
    icon: icons.juguetes,
    link: '/productos/juguetes',
  },
];

export default function Home() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Bienvenido a Pelu PetShop</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col items-center p-6 hover:shadow-lg transition"
          >
            {section.icon}
            <h2 className="text-xl font-semibold text-gray-800 mb-2 mt-2">{section.title}</h2>
            <p className="text-gray-500 mb-4 text-center">{section.description}</p>
            <Link href={section.link}>
              <button
                className="px-5 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-300 hover:text-blue-900 transition"
              >
                Ver sección
              </button>
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}