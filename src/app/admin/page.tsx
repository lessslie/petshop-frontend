'use client';

import { useUserContext } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user } = useUserContext();
  const isLoggedIn = !!user;
  const role = user?.role || null;
  const router = useRouter();

  // Log temporal para depuración
  console.log('user:', user);

  useEffect(() => {
    if (!isLoggedIn) return;
    if (role !== 'admin') {
      router.push('/dashboard');
      return;
    }
  }, [isLoggedIn, role, router]);

  if (!isLoggedIn || role !== 'admin') return null;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-teal-700">
        Panel de Administración
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Card Turnos */}
        <a href="/admin/turnos" className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center hover:bg-teal-50 transition cursor-pointer border border-teal-200">
          <span className="text-5xl mb-2">🗓️</span>
          <span className="text-xl font-semibold mb-1">Turnos</span>
          <span className="text-gray-500 text-center">Gestiona turnos y clientes</span>
        </a>
        {/* Card Alimentos */}
        <a href="/admin/alimentos" className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center hover:bg-teal-50 transition cursor-pointer border border-teal-200">
          <span className="text-5xl mb-2">🍖</span>
          <span className="text-xl font-semibold mb-1">Alimentos</span>
          <span className="text-gray-500 text-center">Gestiona productos de alimentos</span>
        </a>
        {/* Card Ropa */}
        <a href="/admin/ropa" className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center hover:bg-teal-50 transition cursor-pointer border border-teal-200">
          <span className="text-5xl mb-2">👗</span>
          <span className="text-xl font-semibold mb-1">Ropa</span>
          <span className="text-gray-500 text-center">Gestiona productos de ropa</span>
        </a>
        {/* Card Juguetes */}
        <a href="/admin/juguetes" className="bg-white shadow-lg rounded-xl p-8 flex flex-col items-center hover:bg-teal-50 transition cursor-pointer border border-teal-200">
          <span className="text-5xl mb-2">🧸</span>
          <span className="text-xl font-semibold mb-1">Juguetes</span>
          <span className="text-gray-500 text-center">Gestiona productos de juguetes</span>
        </a>
      </div>
    </div>
  );
}
