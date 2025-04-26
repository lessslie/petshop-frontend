'use client';

import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Turno = {
  userName: string;
  dogName: string;
  date: string;
  time: string;
  id: string;
  // ...otros campos
};

export default function AdminDashboard() {
  const { role, token, isLoggedIn } = useUser();
  const router = useRouter();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;
    if (role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    // Fetch de todos los turnos (solo admin)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTurnos(data);
        } else {
          setTurnos([]);
          // Opcional: muestra un mensaje de error
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isLoggedIn, role, token, router]);

  if (!isLoggedIn || role !== 'admin') return null;

  // Filtra los turnos por fecha (YYYY-MM-DD)
  const turnosFiltrados = filtroFecha
    ? turnos.filter(turno => turno.date.startsWith(filtroFecha))
    : turnos;

  // Función para eliminar turno
  const eliminarTurno = async (turnoId: string) => {
    if (!confirm('¿Estás seguro de eliminar este turno?')) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos/${turnoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setTurnos(turnos => turnos.filter(t => t.id !== turnoId));
        setMensaje('Turno eliminado correctamente.');
        setTimeout(() => setMensaje(''), 2500);
      } else {
        setMensaje('Error al eliminar el turno.');
        setTimeout(() => setMensaje(''), 2500);
      }
    } catch {
      setMensaje('Error de red al eliminar el turno.');
      setTimeout(() => setMensaje(''), 2500);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      {/* Filtro de fecha */}
      <input
        type="date"
        value={filtroFecha}
        onChange={e => setFiltroFecha(e.target.value)}
        className="mb-4 p-2 border rounded"
        placeholder="Filtrar por fecha"
      />
      {mensaje && <div className="mb-2 text-green-600 font-semibold">{mensaje}</div>}
      {loading ? (
        <p>Cargando turnos...</p>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-2">Cliente</th>
              <th className="border px-2">Mascota</th>
              <th className="border px-2">Fecha</th>
              <th className="border px-2">Hora</th>
              <th className="border px-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnosFiltrados.map((turno, i) => (
              <tr key={i}>
                <td className="border px-2">{turno.userName}</td>
                <td className="border px-2">{turno.dogName}</td>
                <td className="border px-2">{turno.date}</td>
                <td className="border px-2">{turno.time}</td>
                <td className="border px-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => eliminarTurno(turno.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
