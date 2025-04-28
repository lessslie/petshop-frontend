
'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';
import Button from '@/components/Button';

export default function NavbarAdmin() {
  const router = useRouter();
  const { logout, user } = useUserContext();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-teal-800 text-white px-6 py-3 flex items-center justify-between shadow">
      <div className="flex items-center gap-8">
        <span className="font-bold text-xl tracking-wide">Admin PetShop</span>
        <Link href="/admin/turnos" className="hover:underline">Turnos</Link>
        <Link href="/admin/alimentos" className="hover:underline">Alimentos</Link>
        <Link href="/admin/ropa" className="hover:underline">Ropa</Link>
        <Link href="/admin/juguetes" className="hover:underline">Juguetes</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden md:inline">{user?.name || 'Admin'}</span>
        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700">Salir</Button>
      </div>
    </nav>
  );
}