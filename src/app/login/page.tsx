'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../components/Button';
import { useUser } from '../../context/UserContext';

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
  const { login } = useUser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error al iniciar sesión');
        return;
      }
      if (data.access_token) {
        login(data.access_token);
        router.push('/'); // Redirige al inicio
        setSuccess('¡Login exitoso!');
      } else {
        setError('No se recibió token del servidor');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
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
          ¿No tienes cuenta? <a href="/register" className="text-teal-600 hover:underline">Regístrate</a>
        </p>
      </form>
    </main>
  );
}