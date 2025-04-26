'use client';
import { useState } from 'react';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/UserContext';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useUser();
  // Estado para cada campo
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    petName: '',
  });

  // Estado para mensajes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Maneja cambios en los inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Maneja el submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      res
        .then(async res => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setError(data.message || 'Error al registrar usuario.');
            return;
          }
          const data = await res.json();
          login(data.token || data.access_token);
          router.push('/');
          setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
          setForm({
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phone: '',
            petName: '',
          });
          setError('');
        })
        .catch(() => setError('Error de red al registrar usuario.'));
    } catch {
      setError('Error de red');
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-5" onSubmit={handleSubmit}>
        {error && <div className="mb-2 text-red-600 font-semibold">{error}</div>}
        <h2 className="text-2xl font-bold text-center text-teal-700 mb-2">Crear cuenta</h2>
        
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
            minLength={6}
            required
          />
        </div>
        <div>
          <label htmlFor="firstName" className="block mb-1 font-medium text-slate-700">Nombre</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Juan"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block mb-1 font-medium text-slate-700">Apellido</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Pérez"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-1 font-medium text-slate-700">Teléfono</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="123456789"
            required
          />
        </div>
        <div>
          <label htmlFor="petName" className="block mb-1 font-medium text-slate-700">Nombre de tu mascota</label>
          <input
            id="petName"
            name="petName"
            type="text"
            value={form.petName}
            onChange={handleChange}
            className="w-full p-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Max"
            required
          />
        </div>
        <Button type="submit" className="w-full mt-2">Registrarme</Button>
        <p className="text-sm text-center mt-2">
          ¿Ya tienes cuenta? <Link href="/login" className="text-teal-600 hover:underline">Inicia sesión</Link>
        </p>
      </form>
    </main>
  );
}