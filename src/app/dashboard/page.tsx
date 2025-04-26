'use client';

import { useUser } from '../../context/UserContext';
import { useEffect, useState } from 'react';

type Turno = {
  dogName: string;
  date: string;
  time: string;
  serviceType: string;
  id: string;
};

export default function Dashboard() {
  const { token, isLoggedIn } = useUser();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;
    // Fetch de los turnos del usuario actual
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos/user/${token}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTurnos(data);
          setError('');
        } else {
          setTurnos([]);
          setError(typeof data === 'object' && data.message ? data.message : 'Error inesperado al obtener los turnos.');
        }
        setLoading(false);
      })
      .catch((err) => {
        setTurnos([]);
        setError('Error de red al obtener los turnos.');
        setLoading(false);
      });
  }, [isLoggedIn, token]);

  if (!isLoggedIn) return <p>Debes iniciar sesión para ver tu panel.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Panel</h1>
      {loading ? (
        <p>Cargando tus turnos...</p>
      ) : (
        <div>
          {error && <div className="mb-2 text-red-600 font-semibold">{error}</div>}
          {turnos.length === 0 ? (
            <p>No tienes turnos reservados.</p>
          ) : (
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-2">Mascota</th>
                  <th className="border px-2">Fecha</th>
                  <th className="border px-2">Hora</th>
                  <th className="border px-2">Servicio</th>
                </tr>
              </thead>
              <tbody>
                {turnos.map((turno, i) => (
                  <tr key={i}>
                    <td className="border px-2">{turno.dogName}</td>
                    <td className="border px-2">{turno.date}</td>
                    <td className="border px-2">{turno.time}</td>
                    <td className="border px-2">{turno.serviceType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
