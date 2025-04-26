"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";

// Tipo Turno para admin
export type Turno = {
  id: string;
  userId: string;
  userName: string;
  email: string;
  dogName: string;
  date: string;
  time: string;
  serviceType: string;
  dogSize?: string;
};

export default function AdminTurnos() {
  const { user } = useUserContext();
  const [token, setToken] = useState<string | null>(null);
  const role = user?.role;
  const isLoggedIn = !!user;
  const router = useRouter();
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Turno|null>(null);
  const [turnoEditando, setTurnoEditando] = useState<Turno|null>(null);
  const [editForm, setEditForm] = useState({
    dogName: '',
    date: '',
    time: '',
    dogSize: '',
    serviceType: '',
  });

  // Accede a localStorage solo en el cliente
  useEffect(() => {
    setToken(typeof window !== 'undefined' ? localStorage.getItem('token') : null);
  }, []);

  useEffect(() => {
    if (!token || !isLoggedIn) return;
    if (role !== "admin") {
      router.push("/dashboard");
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // DEBUG: mostrar los datos recibidos
        console.log('Turnos recibidos:', data);
        if (Array.isArray(data)) {
          setTurnos(data);
          setError("");
        } else {
          setTurnos([]);
          setError(
            typeof data === "object" && data.message
              ? data.message
              : "Error inesperado al obtener los turnos."
          );
        }
        setLoading(false);
      })
      .catch(() => {
        setTurnos([]);
        setError("Error de red al obtener los turnos.");
        setLoading(false);
      });
  }, [token, isLoggedIn, role, router]);

  // Filtra los turnos por fecha (YYYY-MM-DD)
  const turnosFiltrados = filtroFecha
    ? turnos.filter((turno) => turno.date.startsWith(filtroFecha))
    : turnos;

  // Función para eliminar turno
  const eliminarTurno = async (turnoId: string) => {
    if (!confirm("¿Estás seguro de eliminar este turno?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/turnos/${turnoId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setTurnos((turnos) => turnos.filter((t) => t.id !== turnoId));
        setMensaje("Turno eliminado correctamente.");
        setTimeout(() => setMensaje(""), 2500);
      } else {
        setMensaje("Error al eliminar el turno.");
        setTimeout(() => setMensaje(""), 2500);
      }
    } catch {
      setMensaje("Error de red al eliminar el turno.");
      setTimeout(() => setMensaje(""), 2500);
    }
  };

  const handleEditarTurno = (turno: Turno) => {
    setTurnoEditando(turno);
    setEditForm({
      dogName: turno.dogName,
      date: turno.date,
      time: turno.time,
      dogSize: turno.dogSize || '',
      serviceType: turno.serviceType,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnoEditando) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/turnos/${turnoEditando.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dogName: editForm.dogName,
          date: editForm.date,
          time: editForm.time,
          dogSize: editForm.dogSize,
          serviceType: editForm.serviceType,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTurnos((prev) => prev.map((t) => t.id === updated.id ? { ...t, ...updated } : t));
        setMensaje('Turno actualizado correctamente. Se notificará al cliente por email.');
        alert('¡Turno editado exitosamente! Se notificará al cliente por email.');
        setTimeout(() => setMensaje(''), 2500);
        setTurnoEditando(null);
      } else {
        setMensaje('Error al actualizar el turno.');
        setTimeout(() => setMensaje(''), 2500);
      }
    } catch {
      setMensaje('Error de red al actualizar el turno.');
      setTimeout(() => setMensaje(''), 2500);
    }
  };

  if (!isLoggedIn || role !== "admin") return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Turnos</h1>
      {error && <div className="mb-2 text-red-600 font-semibold">{error}</div>}
      {mensaje && <div className="mb-2 text-green-600 font-semibold">{mensaje}</div>}
      {/* Filtro de fecha */}
      <input
        type="date"
        value={filtroFecha}
        onChange={(e) => setFiltroFecha(e.target.value)}
        className="mb-4 p-2 border rounded"
        placeholder="Filtrar por fecha"
      />
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
              <th className="border px-2">Servicio</th>
              <th className="border px-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {turnosFiltrados.map((turno, i) => (
              <tr key={i}>
                <td
                  className="border px-2 text-teal-700 underline cursor-pointer hover:text-teal-900"
                  onClick={() => setClienteSeleccionado(turno)}
                  title="Ver datos del cliente"
                >
                  {turno.userName || 'Sin nombre'}
                </td>
                <td className="border px-2">{turno.dogName}</td>
                <td className="border px-2">{turno.date}</td>
                <td className="border px-2">{turno.time}</td>
                <td className="border px-2">{turno.serviceType}</td>
                <td className="border px-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEditarTurno(turno)}
                  >
                    Editar
                  </button>
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
      {clienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setClienteSeleccionado(null)}
              title="Cerrar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Datos del Cliente</h2>
            <div className="mb-2"><b>Nombre:</b> {clienteSeleccionado.userName || 'Sin nombre'}</div>
            <div className="mb-2"><b>Email:</b> {clienteSeleccionado.email || 'No disponible'}</div>
            <div className="mb-2"><b>Mascota:</b> {clienteSeleccionado.dogName}</div>
            <div className="mb-2"><b>Fecha:</b> {clienteSeleccionado.date}</div>
            <div className="mb-2"><b>Hora:</b> {clienteSeleccionado.time}</div>
            <div className="mb-2"><b>Servicio:</b> {clienteSeleccionado.serviceType}</div>
            {/* Puedes agregar más datos aquí si están disponibles en el turno */}
          </div>
        </div>
      )}
      {turnoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setTurnoEditando(null)}
              title="Cerrar"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">Editar Turno</h2>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block font-semibold">Cliente</label>
                <input value={turnoEditando.userName} disabled className="w-full border rounded p-2 bg-gray-100" />
              </div>
              <div>
                <label className="block font-semibold">Mascota</label>
                <input name="dogName" value={editForm.dogName} onChange={handleEditChange} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-semibold">Fecha</label>
                <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-semibold">Hora</label>
                <input type="time" name="time" value={editForm.time} onChange={handleEditChange} required className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-semibold">Tamaño</label>
                <select name="dogSize" value={editForm.dogSize} onChange={handleEditChange} required className="w-full border rounded p-2">
                  <option value="">Selecciona</option>
                  <option value="small">Pequeño</option>
                  <option value="medium">Mediano</option>
                  <option value="large">Grande</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold">Servicio</label>
                <select name="serviceType" value={editForm.serviceType} onChange={handleEditChange} required className="w-full border rounded p-2">
                  <option value="bath">Baño</option>
                  <option value="bath and cut">Baño y Corte</option>
                </select>
              </div>
              <button type="submit" className="bg-teal-600 text-white py-2 rounded font-bold mt-2 hover:bg-teal-800">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
