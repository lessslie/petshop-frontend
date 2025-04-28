'use client';

import { useUserContext } from '../../context/UserContext';
import { useEffect, useState } from 'react';

type Turno = {
  dogName: string;
  date: string;
  time: string;
  serviceType: string;
  id: string;
  payment_status?: string;
  payment_id?: string;
};

export default function Dashboard() {
  const { user } = useUserContext();
  const isLoggedIn = !!user;
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoggedIn) return;
    // CAMBIO: Usar el userId del usuario autenticado en la URL, no el token
    const token = localStorage.getItem('token');
    // CAMBIO: Usar user.userId, nunca user.id, para evitar error de TS y asegurar compatibilidad con el contexto
    const userId = user?.userId; // 'userId' es la propiedad correcta según tu UserContext
    if (!userId) {
      setTurnos([]);
      setError('No se pudo obtener tu identificador de usuario.');
      setLoading(false);
      return;
    }
    // CAMBIO: Usar la ruta correcta del backend: /turnos/appointments/:userId
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos/appointments/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
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
      .catch(() => {
        setTurnos([]);
        setError('Error de red al obtener los turnos.');
        setLoading(false);
      });
  }, [isLoggedIn, user]);

  if (!isLoggedIn) return <p>Debes iniciar sesión para ver tu panel.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Panel</h1>
      {loading ? (
        <p>Cargando tus turnos...</p>
      ) : (
        <div>
          {/* CAMBIO: Mensaje amigable si no hay turnos confirmados */}
          {error && <div className="mb-2 text-red-600 font-semibold">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center mt-8">
            {turnos.length === 0 ? (
              <div className="text-center text-gray-600 col-span-full">No tenés turnos confirmados.</div>
            ) : (
              [...turnos].sort((a, b) => {
                // Ordenar por fecha y hora ascendente (más próximo primero)
                const fechaA = new Date(`${a.date}T${a.time}`);
                const fechaB = new Date(`${b.date}T${b.time}`);
                return fechaA.getTime() - fechaB.getTime();
              }).map((turno) => (
                <div key={turno.id} className="bg-white rounded-xl shadow p-4 border border-gray-200 w-full max-w-md text-center">
                  <div className="mb-1"><span className="font-semibold">Mascota:</span> {turno.dogName}</div>
                  <div className="mb-1"><span className="font-semibold">Fecha:</span> {turno.date}</div>
                  <div className="mb-1"><span className="font-semibold">Hora:</span> {turno.time}</div>
                  <div className="mb-1"><span className="font-semibold">Servicio:</span> {turno.serviceType}</div>
                  {/* Si el turno está pendiente, muestra alerta y botón de pago */}
                  {turno.payment_status !== 'paid' && (
                    <div className="mt-4">
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-2 flex items-center gap-2">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FEF3C7"/><path d="M12 8v4m0 4h.01" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/></svg>
                        <span className="text-yellow-800 font-semibold">Pendiente de pago</span>
                      </div>
                      <a href={`/turnos/pagar/${turno.id}`} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-1 px-3 rounded transition-colors inline-block">Pagar</a>
                    </div>
                  )}
                  {/* Si el turno está confirmado, muestra mensaje */}
                  {turno.payment_status === 'paid' && (
                    <div className="mt-4 text-green-700 font-semibold">¡Turno confirmado!</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
