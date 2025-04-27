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
    // Fetch de los turnos del usuario actual
    const token = localStorage.getItem('token');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos/user/${token}`, {
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
  }, [isLoggedIn]);

  if (!isLoggedIn) return <p>Debes iniciar sesión para ver tu panel.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Panel</h1>
      {loading ? (
        <p>Cargando tus turnos...</p>
      ) : (
        <div>
          {error && <div className="mb-2 text-red-600 font-semibold">{}</div>}
          {(() => {
            const pendientes = turnos.filter(t => t.payment_status !== 'paid');
            const confirmados = turnos.filter(t => t.payment_status === 'paid');
            if (turnos.length === 0 || (pendientes.length > 0 && confirmados.length === 0)) {
              return (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4 flex items-center gap-3 animate-fade-in">
                  <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#FEF3C7"/><path d="M12 8v4m0 4h.01" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/></svg>
                  <div>
                    <p className="text-yellow-800 font-semibold">No tienes turnos confirmados.</p>
                    <p className="text-yellow-700 text-sm">Recuerda: solo verás aquí los turnos una vez realizado el pago y confirmación.<br/>Si ya reservaste, revisa tu email y sigue las instrucciones para confirmar tu turno.</p>
                    {pendientes.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold mb-2 text-yellow-900">Turnos pendientes de pago:</p>
                        <table className="min-w-full border bg-white">
                          <thead>
                            <tr>
                              <th className="border px-2">Mascota</th>
                              <th className="border px-2">Fecha</th>
                              <th className="border px-2">Hora</th>
                              <th className="border px-2">Servicio</th>
                              <th className="border px-2">Acción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendientes.map((turno, i) => (
                              <tr key={i}>
                                <td className="border px-2">{turno.dogName}</td>
                                <td className="border px-2">{turno.date}</td>
                                <td className="border px-2">{turno.time}</td>
                                <td className="border px-2">{turno.serviceType}</td>
                                <td className="border px-2">
                                  {/* Botón de pago Mercado Pago */}
                                  <a href={`/turnos/pagar/${turno.id}`} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-1 px-3 rounded transition-colors">Pagar</a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
            return (
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
                  {confirmados.map((turno, i) => (
                    <tr key={i}>
                      <td className="border px-2">{turno.dogName}</td>
                      <td className="border px-2">{turno.date}</td>
                      <td className="border px-2">{turno.time}</td>
                      <td className="border px-2">{turno.serviceType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          })()}
        </div>
      )}
    </div>
  );
}
