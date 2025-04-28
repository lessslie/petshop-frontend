'use client';
import  { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import { useUserContext } from '../../context/UserContext';
import Link from 'next/link';

// Define el tipo correcto para tu payload JWT
type MyJwtPayload = {
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  userId?: string;
  phone?: string;
  petName?: string;
  [key: string]: string | undefined;
};

export default function LoginPage() {
  // Estado para cada campo
  const [form, setForm] = useState({
    email: '',
    password: '',

  });

  // Estado para mensajes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const router = useRouter();

  // Maneja cambios en los inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Maneja el submit
  const { setUser } = useUserContext();

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError('');
  setSuccess('');
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',

      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      setError('Credenciales incorrectas');
      return;
    }
    const data = await res.json();
    // Guarda el token si lo necesitas
    localStorage.setItem('token', data.access_token);
    
    // Decodifica el token para extraer datos del usuario
    const decoded = jwtDecode<MyJwtPayload>(data.access_token);

    setUser({
      name: `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim(),
      email: decoded.email,
      role: decoded.role,
      userId: decoded.userId,
    });
    setSuccess('¡Login exitoso!');
    // Redirige según el rol
    if (decoded.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  } catch {
    setError('Error de red');
  }
}
  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-5" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-2">Iniciar sesión</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-600 text-center">{success}</p>}
        <div>
          <label htmlFor="email" className="block mb-1 font-medium text-slate-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="usuario@ejemplo.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium text-slate-700">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="********"
            required
          />
        </div>
        <Button type="submit" className="w-full mt-2">Iniciar sesión</Button>
        <p className="text-sm text-center mt-2">
          ¿No tienes cuenta? <Link href="/register" className="text-teal-600 hover:underline">Regístrate</Link>
        </p>
      </form>
    </main>
  );
}